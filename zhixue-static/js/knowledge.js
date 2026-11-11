/* 智学探索 · 知识库：联网学到的内容在此去重、归档、离线复用 */
const Knowledge = (() => {
  const MAX_ENTRIES = 800;
  let cache = [];
  let readyPromise = null;

  function normalize(text) {
    return String(text || '')
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/[，。！？、；：""''（）()【】\[\]?!.,;:'"`~—…·]/g, '');
  }

  function hash(text) {
    let h = 5381;
    for (let i = 0; i < text.length; i += 1) {
      h = ((h << 5) + h + text.charCodeAt(i)) >>> 0;
    }
    return h.toString(36);
  }

  function makeId(subject, question) {
    return 'learn-' + subject + '-' + hash(normalize(question));
  }

  function isValid(entry) {
    return (
      entry &&
      entry.id &&
      entry.subject &&
      (entry.question || entry.title) &&
      typeof entry.answer === 'string' &&
      entry.answer.trim().length > 0
    );
  }

  function sanitize(entry) {
    return {
      keywords: [],
      hits: 0,
      pinned: false,
      learnedAt: Date.now(),
      updatedAt: Date.now(),
      source: '',
      sourceUrl: '',
      auto: true,
      ...entry
    };
  }

  function sortCache() {
    cache.sort(
      (a, b) =>
        (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) ||
        (b.updatedAt || 0) - (a.updatedAt || 0)
    );
  }

  async function init() {
    if (readyPromise) return readyPromise;
    readyPromise = (async () => {
      const list = await KnowledgeStore.getAll();
      cache = list.filter(isValid).map(sanitize);
      sortCache();
      return cache;
    })();
    return readyPromise;
  }

  function list(subjectId) {
    return subjectId ? cache.filter((item) => item.subject === subjectId) : cache.slice();
  }

  const STOP_WORDS = /(为什么|是什么|怎么样|怎么|如何|请问|多少|什么|哪些|告诉我|原因|一下|的|了|吗|呢|吧|啊|呀|是|有|和|与|及|请)/g;

  function core(text) {
    return normalize(text).replace(STOP_WORDS, '');
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

  function find(subjectId, question) {
    const q = normalize(question);
    if (!q || q.length < 2) return null;

    let best = null;
    let bestScore = 0;

    cache.forEach((entry) => {
      if (subjectId && entry.subject !== subjectId) return;
      let score = 0;
      const nq = normalize(entry.question || '');
      const nt = normalize(entry.title || '');

      if (nq && nq === q) score = 10;
      else if (nt && nt === q) score = 9;
      else if (nq && Math.min(nq.length, q.length) >= 2 && (nq.includes(q) || q.includes(nq))) score = 6;
      else if (nt && Math.min(nt.length, q.length) >= 2 && (nt.includes(q) || q.includes(nt))) score = 5;

      if (!score && Array.isArray(entry.keywords)) {
        entry.keywords.forEach((k) => {
          const nk = normalize(k);
          if (!nk || nk.length < 2) return;
          if (nk === q) score = Math.max(score, 5);
          else if (nk.includes(q) || q.includes(nk)) score = Math.max(score, 4);
        });
      }

      // 去掉疑问词后的核心词对比：如「潮汐形成原因」命中「潮汐是怎么形成的」
      if (!score) {
        const cq = core(question);
        const cnq = core(entry.question || '');
        const cnt = core(entry.title || '');
        if (cq && cq.length >= 2) {
          if (cnq && cnq === cq) score = 8;
          else if (cnt && cnt === cq) score = 7;
          else if (cnq && (cnq.includes(cq) || cq.includes(cnq))) score = 5;
          else if (cnt && (cnt.includes(cq) || cq.includes(cnt))) score = 4;
        }
        if (!score && q.length >= 4) {
          const sim = Math.max(bigramSimilarity(cq, cnq), bigramSimilarity(cq, cnt));
          if (sim >= 0.75) score = 7;
          else if (sim >= 0.5) score = 3;
        }
      }

      if (score > bestScore) {
        bestScore = score;
        best = entry;
      }
    });

    if (!best) return null;

    best.hits = (best.hits || 0) + 1;
    best.lastUsedAt = Date.now();
    KnowledgeStore.put(best);
    return best;
  }

  function buildKeywords(question, old) {
    const set = new Set(old || []);
    const q = String(question || '').trim();
    if (q) set.add(q.slice(0, 30));
    const c = core(q);
    if (c && c.length >= 2) set.add(c);
    q.split(/[\s,，。？?！!、；;：:]+/)
      .filter((t) => t.length >= 2)
      .slice(0, 4)
      .forEach((t) => set.add(t));
    return [...set].slice(0, 10);
  }

  function trim() {
    if (cache.length <= MAX_ENTRIES) return;
    const sorted = [...cache].sort(
      (a, b) =>
        (a.pinned ? 1 : 0) - (b.pinned ? 1 : 0) ||
        (a.lastUsedAt || a.updatedAt || 0) - (b.lastUsedAt || b.updatedAt || 0)
    );
    const dropIds = sorted.slice(0, cache.length - MAX_ENTRIES).map((item) => item.id);
    cache = cache.filter((item) => dropIds.indexOf(item.id) === -1);
    dropIds.forEach((id) => KnowledgeStore.remove(id));
  }

  async function saveLearned({ subject, question, answer, source, sourceUrl, title }) {
    const q = String(question || '').trim();
    const text = String(answer || '').trim();
    if (!subject || !q || text.length < 20) return null;

    const id = makeId(subject, q);
    const existing = cache.find((item) => item.id === id);
    const now = Date.now();
    const entry = existing
      ? { ...existing }
      : { id, subject, question: q, hits: 0, pinned: false, learnedAt: now };

    entry.title = title || entry.title || q.slice(0, 30);
    entry.answer = text;
    entry.source = source || entry.source || '';
    entry.sourceUrl = sourceUrl || entry.sourceUrl || '';
    entry.keywords = buildKeywords(q, entry.keywords);
    entry.updatedAt = now;
    entry.auto = true;

    cache = cache.filter((item) => item.id !== id);
    cache.push(entry);
    sortCache();
    trim();
    await KnowledgeStore.put(entry);
    return entry;
  }

  async function remove(id) {
    cache = cache.filter((item) => item.id !== id);
    await KnowledgeStore.remove(id);
  }

  async function togglePin(id) {
    const entry = cache.find((item) => item.id === id);
    if (!entry) return;
    entry.pinned = !entry.pinned;
    entry.updatedAt = Date.now();
    sortCache();
    await KnowledgeStore.put(entry);
  }

  function count() {
    return cache.length;
  }

  function countBySubject() {
    const map = {};
    cache.forEach((item) => {
      map[item.subject] = (map[item.subject] || 0) + 1;
    });
    return map;
  }

  function search(query) {
    const q = normalize(query);
    if (!q) return cache.slice();
    return cache.filter((item) => {
      const haystack = normalize(
        [item.question, item.title, item.answer.slice(0, 200), (item.keywords || []).join(' ')].join(' ')
      );
      return haystack.indexOf(q) !== -1;
    });
  }

  function exportJSON() {
    return JSON.stringify(
      { app: 'zhixue', version: 1, exportedAt: Date.now(), entries: cache },
      null,
      2
    );
  }

  async function importJSON(text) {
    const data = JSON.parse(text);
    const incoming = Array.isArray(data) ? data : data.entries || [];
    let added = 0;
    let updated = 0;

    for (const raw of incoming) {
      if (!isValid(raw)) continue;
      const entry = sanitize(raw);
      entry.id = entry.id || makeId(entry.subject, entry.question || entry.title);
      entry.updatedAt = entry.updatedAt || Date.now();

      const old = cache.find((item) => item.id === entry.id);
      if (old) {
        if ((entry.updatedAt || 0) < (old.updatedAt || 0)) continue;
        updated += 1;
      } else {
        added += 1;
      }

      cache = cache.filter((item) => item.id !== entry.id);
      cache.push(entry);
      await KnowledgeStore.put(entry);
    }

    sortCache();
    trim();
    return { added, updated };
  }

  return {
    init,
    list,
    find,
    saveLearned,
    remove,
    togglePin,
    count,
    countBySubject,
    search,
    exportJSON,
    importJSON,
    get ready() {
      return readyPromise;
    }
  };
})();

// 暴露到全局，便于其它脚本与控制台调试
if (typeof window !== 'undefined') {
  window.Knowledge = Knowledge;
}
