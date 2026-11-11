/**
 * 共享知识库客户端：与后端 /api/knowledge 通信。
 * 自动探测可用的后端地址（同源 → 3000 端口 → 配置地址），
 * 后端不可用时自动降级，不影响本地题库与本地知识库。
 */
(function (global) {
  'use strict';

  const TOKEN_KEY = 'zhixue_shared_tokens';
  const CACHE_TTL = 60 * 1000;
  const HEALTH_TIMEOUT = 1500;

  let items = [];
  let loadedAt = 0;
  let loading = null;
  let lastError = '';
  let resolvedBase = null;
  let baseResolved = false;

  function configuredBase() {
    const configured =
      (typeof global.SHARE_CONFIG !== 'undefined' && global.SHARE_CONFIG.apiBase) || '';
    return String(configured).replace(/\/+$/, '');
  }

  function candidates() {
    const list = [];
    const configured = configuredBase();
    if (configured) list.push(configured);

    const loc = global.location;
    if (loc && loc.protocol !== 'file:') {
      // 同源：前后端一起部署（node server.js / 反向代理）时最可靠
      list.push('');
    }
    const host = (loc && loc.hostname) || 'localhost';
    list.push(`http://${host}:3000`);
    if (host !== 'localhost' && host !== '127.0.0.1') {
      list.push('http://localhost:3000');
    }
    return Array.from(new Set(list));
  }

  async function tryHealth(base) {
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timer = setTimeout(() => {
      if (controller) controller.abort();
    }, HEALTH_TIMEOUT);
    try {
      const resp = await fetch(`${base}/api/health`, {
        cache: 'no-store',
        signal: controller ? controller.signal : undefined
      });
      if (!resp.ok) return false;
      const data = await resp.json().catch(() => null);
      return Boolean(data && data.ok);
    } catch {
      return false;
    } finally {
      clearTimeout(timer);
    }
  }

  async function resolveBase(force) {
    if (baseResolved && !force) return resolvedBase;
    const list = candidates();
    for (const base of list) {
      // eslint-disable-next-line no-await-in-loop
      if (await tryHealth(base)) {
        resolvedBase = base;
        baseResolved = true;
        return base;
      }
    }
    resolvedBase = null;
    baseResolved = true;
    return null;
  }

  function tokenMap() {
    try {
      const parsed = JSON.parse(global.localStorage.getItem(TOKEN_KEY) || '{}');
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
      return {};
    }
  }

  function saveToken(id, token) {
    if (!id || !token) return;
    const map = tokenMap();
    map[id] = token;
    try {
      global.localStorage.setItem(TOKEN_KEY, JSON.stringify(map));
    } catch {
      /* 忽略存储失败 */
    }
  }

  function dropToken(id) {
    const map = tokenMap();
    delete map[id];
    try {
      global.localStorage.setItem(TOKEN_KEY, JSON.stringify(map));
    } catch {
      /* 忽略存储失败 */
    }
  }

  // 平台访问门槛要求每个请求都携带 sharecode，内部 API 请求统一补上
  function withShare(p) {
    var sc = '6XPB2BZATX';
    try {
      var fromUrl = global.location && global.location.search
        ? new URLSearchParams(global.location.search).get('sharecode')
        : null;
      if (fromUrl) sc = fromUrl;
    } catch (e) { /* 忽略 */ }
    return p + (p.indexOf('?') >= 0 ? '&' : '?') + 'sharecode=' + encodeURIComponent(sc);
  }

  async function request(path, options = {}) {
    const base = await resolveBase(Boolean(options.forceBase));
    if (base === null) {
      const err = new Error('连不上共享服务');
      err.code = 'SHARE_UNREACHABLE';
      throw err;
    }

    const timeout = options.timeout || 6000;
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timer = setTimeout(() => {
      if (controller) controller.abort();
    }, timeout);

    try {
      const resp = await fetch(base + withShare(path), {
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {})
        },
        body: options.body,
        signal: controller ? controller.signal : undefined
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) throw new Error(data.error || `请求失败（${resp.status}）`);
      return data;
    } catch (err) {
      if (err && err.code !== 'SHARE_UNREACHABLE' && err.name === 'TypeError') {
        // 网络中断：下次重新探测地址
        baseResolved = false;
      }
      throw err;
    } finally {
      clearTimeout(timer);
    }
  }

  async function fetchItems(force) {
    if (loading) return loading;
    if (!force && loadedAt && Date.now() - loadedAt < CACHE_TTL) {
      return { ok: true, items: items.slice(), total: items.length, error: '' };
    }

    loading = request('/api/knowledge', { forceBase: force })
      .then((data) => {
        items = Array.isArray(data.items) ? data.items : [];
        loadedAt = Date.now();
        lastError = '';
        return { ok: true, items: items.slice(), total: data.total || items.length, error: '' };
      })
      .catch(async (err) => {
        if (err && err.code === 'SHARE_UNREACHABLE') lastError = '连不上共享服务';
        else if (err && err.name === 'AbortError') lastError = '连接共享服务超时';
        else lastError = (err && err.message) || '共享服务异常';
        // 静态部署（无后端）时，降级读取随站点附带的预设知识包
        try {
          const res = await fetch('data/preset-knowledge.json', { cache: 'no-cache' });
          if (res.ok) {
            const preset = await res.json();
            if (Array.isArray(preset) && preset.length) {
              items = preset;
              loadedAt = Date.now();
              lastError = '';
              return { ok: true, items: items.slice(), total: items.length, error: '' };
            }
          }
        } catch (e) { /* 没有预设包就保持原样 */ }
        return { ok: false, items: items.slice(), total: items.length, error: lastError };
      })
      .finally(() => {
        loading = null;
      });

    return loading;
  }

  function normalize(text) {
    return String(text || '')
      .toLowerCase()
      .replace(/[\s，。？！、；：,.?!;:'"“”‘’（）()\[\]【】《》<>·\-—_/\\]/g, '');
  }

  const STOP = /(为什么|是什么|怎么样|怎么|如何|请问|多少|什么|哪些|告诉我|原因|一下|的|了|吗|呢|吧|啊|呀|是|有|和|与|及|请)/g;

  function core(text) {
    return normalize(text).replace(STOP, '');
  }

  function bigramSimilarity(a, b) {
    if (!a || !b) return 0;
    const grams = (text) => {
      const set = new Set();
      for (let i = 0; i < text.length - 1; i += 1) set.add(text.slice(i, i + 2));
      return set;
    };
    const ga = grams(a);
    const gb = grams(b);
    if (!ga.size || !gb.size) return 0;
    let hit = 0;
    ga.forEach((g) => {
      if (gb.has(g)) hit += 1;
    });
    return hit / Math.min(ga.size, gb.size);
  }

  function scoreItem(entry, question) {
    const q = normalize(question);
    const nt = normalize(entry.title);
    const nc = normalize(entry.content);
    const cq = core(question);
    let score = 0;

    if (!q) return 0;
    if (nt === q) score = 10;
    else if (nt.includes(q) || q.includes(nt)) score = 7;
    else if (nc.includes(q)) score = 4;

    if (!score && cq.length >= 2) {
      if (core(entry.title) === cq) score = 8;
      else if (bigramSimilarity(cq, core(entry.title)) >= 0.6) score = 5;
    }
    return score;
  }

  async function find(subjectId, question) {
    if (!question) return null;
    if (!items.length) {
      if (typeof global.navigator !== 'undefined' && !global.navigator.onLine) return null;
      const result = await fetchItems(false);
      if (!result.ok && !items.length) return null;
    }

    let best = null;
    let bestScore = 0;
    items.forEach((entry) => {
      if (entry.subject !== subjectId) return;
      const score = scoreItem(entry, question);
      if (score > bestScore) {
        bestScore = score;
        best = entry;
      }
    });
    return bestScore >= 4 ? best : null;
  }

  async function create(payload) {
    const data = await request('/api/knowledge', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    if (data && data.ok && data.item) {
      saveToken(data.item.id, data.ownerToken);
      items = [data.item].concat(items);
      loadedAt = Date.now();
      return { ok: true, item: data.item };
    }
    return { ok: false, error: '保存失败' };
  }

  async function remove(id) {
    const token = tokenMap()[id];
    if (!token) return { ok: false, error: '只能删除自己添加的内容' };
    await request(`/api/knowledge/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: { 'X-Owner-Token': token }
    });
    items = items.filter((entry) => entry.id !== id);
    dropToken(id);
    return { ok: true };
  }

  function cached(subjectId) {
    return subjectId ? items.filter((entry) => entry.subject === subjectId) : items.slice();
  }

  function get(id) {
    return items.find((entry) => entry.id === id) || null;
  }

  function canDelete(id) {
    return Boolean(tokenMap()[id]);
  }

  function count() {
    return items.length;
  }

  function serverLabel() {
    const base = resolvedBase === null ? (baseResolved ? '未连接' : '探测中') : resolvedBase || '同源服务';
    return base;
  }

  function isLocalPage() {
    const loc = global.location;
    if (!loc) return true;
    return loc.protocol === 'file:' || loc.hostname === 'localhost' || loc.hostname === '127.0.0.1';
  }

  function status() {
    return { loadedAt, error: lastError, base: serverLabel(), local: isLocalPage() };
  }

  global.SharedKnowledge = {
    candidates,
    resolveBase,
    fetchItems,
    find,
    create,
    remove,
    cached,
    get,
    canDelete,
    count,
    status,
    isLocalPage
  };
})(typeof window !== 'undefined' ? window : globalThis);
