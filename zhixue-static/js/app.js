const SUBJECTS = [
  { id: 'chinese', name: '语文', en: 'Chinese' },
  { id: 'math', name: '数学', en: 'Mathematics' },
  { id: 'english', name: '英语', en: 'English' },
  { id: 'physics', name: '物理', en: 'Physics' },
  { id: 'chemistry', name: '化学', en: 'Chemistry' },
  { id: 'biology', name: '生物', en: 'Biology' },
  { id: 'geography', name: '地理', en: 'Geography' },
  { id: 'history', name: '历史', en: 'History' }
];

const SUBJECT_ACTIONS = {
  chinese: [
    { key: 'translate', label: '翻译' },
    { key: 'explain', label: '内容解释' },
    { key: 'author', label: '作者介绍' },
    { key: 'dictation', label: '默写' }
  ],
  math: [
    { key: 'formula', label: '相关公式' },
    { key: 'analysis', label: '深度解析' }
  ],
  english: [{ key: 'detail', label: '详解' }],
  physics: [
    { key: 'formula', label: '相关公式' },
    { key: 'structure', label: '原理结构' },
    { key: 'analysis', label: '深度解析' }
  ],
  chemistry: [
    { key: 'equation', label: '方程式公式' },
    { key: 'structure', label: '原理结构' },
    { key: 'analysis', label: '深度解析' }
  ],
  biology: [
    { key: 'diagram', label: '结构图解' },
    { key: 'analysis', label: '深度解析' }
  ],
  geography: [
    { key: 'relation', label: '关系图' },
    { key: 'structure', label: '地理结构' },
    { key: 'local', label: '当地信息' }
  ],
  history: [{ key: 'detail', label: '详解' }]
};

// 各学科题库（用于输入联想、随机一题、详情页上一篇/下一篇）
function getSubjectBank(subjectId) {
  switch (subjectId) {
    case 'chinese':
      return typeof CHINESE_POEMS !== 'undefined' ? CHINESE_POEMS : [];
    case 'math':
      return typeof MATH_PROBLEMS !== 'undefined' ? MATH_PROBLEMS : [];
    case 'physics':
      return typeof PHYSICS_TOPICS !== 'undefined' ? PHYSICS_TOPICS : [];
    case 'chemistry':
      return typeof CHEMISTRY_TOPICS !== 'undefined' ? CHEMISTRY_TOPICS : [];
    case 'biology':
      return typeof BIOLOGY_TOPICS !== 'undefined' ? BIOLOGY_TOPICS : [];
    case 'english':
      return typeof ENGLISH_TOPICS !== 'undefined' ? ENGLISH_TOPICS : [];
    case 'history':
      return typeof HISTORY_TOPICS !== 'undefined' ? HISTORY_TOPICS : [];
    case 'geography':
      return typeof GEO_TOPICS !== 'undefined' ? GEO_TOPICS : [];
    default:
      return [];
  }
}

function getBankItemLabel(subjectId, item) {
  if (!item) return '';
  if (subjectId === 'chinese') return item.title || item.id;
  if (subjectId === 'math') return (item.question && item.question[0]) || item.id;
  if (subjectId === 'english' || subjectId === 'history') return item.title || item.id;
  return (item.keywords && item.keywords[0]) || item.title || item.id;
}

function findBankItem(subjectId, entityId) {
  if (!entityId) return null;
  return getSubjectBank(subjectId).find((item) => item.id === entityId) || null;
}

const subjectIcon = (paths) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
    stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;

const SUBJECT_ICONS = {
  chinese: subjectIcon(
    '<path d="M12 6.5C10.5 5 8 4.5 4 4.5v13c4 0 6.5.5 8 2 1.5-1.5 4-2 8-2v-13c-4 0-6.5.5-8 2z"/><path d="M12 6.5v13"/>'
  ),
  math: subjectIcon(
    '<rect x="5" y="3" width="14" height="18" rx="2"/><rect x="8" y="6" width="8" height="3" rx="0.6"/><path d="M8.5 13h.01M12 13h.01M15.5 13h.01M8.5 17h.01M12 17h.01M15.5 17h.01"/>'
  ),
  english: subjectIcon(
    '<path d="M4 5h16v10H9l-5 4V5z"/><path d="M8 9h8M8 12h5"/>'
  ),
  physics: subjectIcon(
    '<circle cx="12" cy="12" r="1.8"/><ellipse cx="12" cy="12" rx="9" ry="4"/><ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(120 12 12)"/>'
  ),
  chemistry: subjectIcon(
    '<path d="M9 3h6M10 3v5l-5 8a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-8V3"/><path d="M7.5 14h9"/>'
  ),
  biology: subjectIcon(
    '<path d="M20 4C10 4 4 9 4 16c0 2 .5 3.5.5 3.5S8 20 11 20c7 0 9-6 9-16z"/><path d="M4 20C8 16 12 12 18 7"/>'
  ),
  geography: subjectIcon(
    '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><ellipse cx="12" cy="12" rx="4" ry="9"/>'
  ),
  history: subjectIcon(
    '<path d="M3 21h18M3 9h18M12 3l9 6H3l9-6z"/><path d="M6 9v12M10 9v12M14 9v12M18 9v12"/>'
  )
};

// 当前学科问答结果，供二级页 entityId 查找；不再跨导航保留
const answers = {};

const HISTORY_MAX = 20;
const HISTORY_PREFIX = 'zhixue_history:';

// ---- 历史记录抽屉 ----
let historyDrawerEl = null;
let historyCloseTimer = null;

function getHistory(subjectId) {
  try {
    const raw = localStorage.getItem(HISTORY_PREFIX + subjectId);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed)
      ? parsed.filter((item) => item && typeof item.question === 'string')
      : [];
  } catch {
    return [];
  }
}

function saveHistory(subjectId, question, result) {
  const list = getHistory(subjectId);
  // 去重：同 question 旧记录移走，但保留原来的置顶状态
  const old = list.find((item) => item.question === question);
  const filtered = list.filter((item) => item.question !== question);
  const entry = { question, result, timestamp: Date.now() };
  if (old && old.pinned) entry.pinned = true;
  filtered.unshift(entry);
  const trimmed = filtered.slice(0, HISTORY_MAX);
  try {
    localStorage.setItem(HISTORY_PREFIX + subjectId, JSON.stringify(trimmed));
  } catch {
    // 容量不够就丢最老的继续存
    if (trimmed.length > 1) {
      try {
        localStorage.setItem(
          HISTORY_PREFIX + subjectId,
          JSON.stringify(trimmed.slice(0, trimmed.length - 1))
        );
      } catch {
        // 还是不够就算了
      }
    }
  }
}

function deleteHistoryItem(subjectId, question) {
  const list = getHistory(subjectId).filter((item) => item.question !== question);
  localStorage.setItem(HISTORY_PREFIX + subjectId, JSON.stringify(list));
}

function toggleHistoryPin(subjectId, question) {
  const list = getHistory(subjectId).map((item) =>
    item.question === question ? { ...item, pinned: !item.pinned } : item
  );
  localStorage.setItem(HISTORY_PREFIX + subjectId, JSON.stringify(list));
}

function historyGroupLabel(ts) {
  if (!Number.isFinite(ts)) return '更早';
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  if (ts >= startOfToday) return '今天';
  if (ts >= startOfToday - 86400000) return '昨天';
  if (ts >= startOfToday - 6 * 86400000) return '本周';
  return '更早';
}

function clearHistory(subjectId) {
  localStorage.removeItem(HISTORY_PREFIX + subjectId);
}

function relativeTime(ts) {
  if (!Number.isFinite(ts)) return '';
  const diff = (Date.now() - ts) / 1000;
  if (diff < 5) return '刚刚';
  if (diff < 60) return Math.floor(diff) + '秒前';
  if (diff < 3600) return Math.floor(diff / 60) + '分钟前';
  if (diff < 86400) return Math.floor(diff / 3600) + '小时前';
  if (diff < 172800) return '昨天';
  const d = new Date(ts);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

function historyItemPreview(result) {
  if (!result || typeof result !== 'object') return String(result || '').slice(0, 30);
  if (result.type === 'poem' && result.poem) return `${result.poem.title} · ${result.poem.author}`;
  if (result.problem && result.problem.brief) return result.problem.brief.slice(0, 30);
  if (result.topic && result.topic.brief) return result.topic.brief.slice(0, 30);
  return (result.answer || '').slice(0, 30);
}

// 兼容旧版本存储格式，无法渲染的记录返回 null
function normalizeStoredResult(subjectId, result) {
  if (typeof result === 'string') {
    return result.trim() ? { type: subjectId, answer: result } : null;
  }
  if (!result || typeof result !== 'object') return null;
  if (result.type === 'poem') {
    return result.poem && Array.isArray(result.poem.poem) ? result : null;
  }
  if (result.type === 'geo' && (!result.topic || !Array.isArray(result.topic.places))) return null;
  if (!result.problem && !result.topic && !result.answer) return null;
  return result;
}

const app = document.getElementById('app');
let hasInternalHistory = false;
let currentSubjectId = null;
let deferredInstall = null;

// 支持安装的浏览器会触发 beforeinstallprompt，用它把网页装成桌面应用
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredInstall = e;
  const btn = document.getElementById('install-btn');
  if (btn) btn.hidden = false;
});

window.addEventListener('appinstalled', () => {
  deferredInstall = null;
  const btn = document.getElementById('install-btn');
  if (btn) btn.hidden = true;
});

// 把元素内所有 $...$ 包裹的内容用 KaTeX 渲染成真公式
function renderMath(root) {
  if (!root || typeof katex === 'undefined') return;

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  let node;

  while ((node = walker.nextNode())) {
    if (node.nodeValue.indexOf('$') === -1) continue;
    const parent = node.parentElement;
    if (!parent || parent.closest('script, style, .katex')) continue;
    textNodes.push(node);
  }

  textNodes.forEach((textNode) => {
    const text = textNode.nodeValue;
    const regex = /\$([^$]+)\$/g;
    const fragment = document.createDocumentFragment();
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      fragment.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));

      const mathEl = document.createElement('span');
      try {
        katex.render(match[1], mathEl, { throwOnError: false });
      } catch {
        mathEl.textContent = match[0];
      }
      fragment.appendChild(mathEl);
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex === 0) return;
    if (lastIndex < text.length) {
      fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
    }
    textNode.parentNode.replaceChild(fragment, textNode);
  });
}

function renderHome() {
  const cards = SUBJECTS.map(
    (s) => `
      <a class="subject-card" href="#/subject/${s.id}">
        <span class="name">${s.name}</span>
        <span class="en">${s.en}</span>
      </a>`
  ).join('');

  const topicCount = SUBJECTS.reduce(
    (sum, s) => sum + getSubjectBank(s.id).length,
    0
  );
  const learnedCount = typeof Knowledge !== 'undefined' ? Knowledge.count() : 0;

  app.innerHTML = `
    <header class="home-head">
      <h1>智学探索</h1>
      <p class="home-subtitle">AI 驱动的全学科学习工具</p>
      <p class="home-tagline">选择一个学科，开始你的探索</p>
      <p class="home-stat">${SUBJECTS.length} 个学科 · ${topicCount} 个知识点 · 支持离线与共享</p>
    </header>
    <main class="subject-grid">
      ${cards}
    </main>
    <div class="home-actions">
      <button id="random-btn" class="home-random has-tip" type="button"
        data-tip="从全部学科里随机抽一道题，帮你快速开始">随机来一道题</button>
      <a class="home-knowledge has-tip" href="#/knowledge"
        data-tip="查看你学过的内容，也能看别人分享的知识">
        知识库${learnedCount ? ` · ${learnedCount}` : ''}
      </a>
      <button id="install-btn" class="home-install has-tip" type="button" hidden
        data-tip="把智学探索装到桌面，下次像普通软件一样打开">安装到桌面</button>
    </div>
    <p class="home-actions-hint">
      随机来一道题：从全科题库抽一题练习<br>
      知识库：查看学过的内容，也能看别人的分享
    </p>
  `;

  document.getElementById('random-btn').addEventListener('click', () => {
    const pool = [];
    SUBJECTS.forEach((s) => {
      getSubjectBank(s.id).forEach((item) => pool.push({ subjectId: s.id, item }));
    });
    if (!pool.length) return;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    pendingQuestion = {
      subjectId: pick.subjectId,
      text: getBankItemLabel(pick.subjectId, pick.item)
    };
    location.hash = `#/subject/${pick.subjectId}`;
  });

  const installBtn = document.getElementById('install-btn');
  if (installBtn) {
    if (deferredInstall) installBtn.hidden = false;
    installBtn.addEventListener('click', async () => {
      if (!deferredInstall) return;
      deferredInstall.prompt();
      try {
        await deferredInstall.userChoice;
      } catch {
        /* 用户取消安装，忽略即可 */
      }
      deferredInstall = null;
      installBtn.hidden = true;
    });
  }

  // 回首页清空所有科目的输入和回答
  for (const k in answers) delete answers[k];
  currentSubjectId = null;
}

/* ---------------- 我的知识（联网自动积累的内容） ---------------- */

function renderKnowledge() {
  const total = typeof Knowledge !== 'undefined' ? Knowledge.count() : 0;
  const counts = typeof Knowledge !== 'undefined' ? Knowledge.countBySubject() : {};

  app.innerHTML = `
    <div class="topbar">
      <button id="knowledge-back" class="back-btn" type="button">← 返回</button>
    </div>
    <header class="knowledge-head">
      <h1>知识库</h1>
      <p class="knowledge-sub">你学过的内容，都会存在这里</p>
      <p class="knowledge-stat" id="knowledge-stat">本机 <strong>${total}</strong> 条 · 共享 <strong id="shared-total">—</strong> 条</p>
    </header>
    <div class="knowledge-tabs" role="tablist" aria-label="知识库分类">
      <button class="knowledge-tab is-active" type="button" role="tab" data-tab="local" aria-selected="true">本机知识</button>
      <button class="knowledge-tab" type="button" role="tab" data-tab="shared" aria-selected="false">共享知识</button>
    </div>
    <p class="knowledge-tip" id="knowledge-tip">只有你自己能看到，断网也能查</p>
    <div id="local-panel">
      <div class="knowledge-toolbar">
        <input id="knowledge-search" class="knowledge-search" type="search"
          placeholder="搜索已学内容" aria-label="搜索已学内容">
        <button id="knowledge-export" class="ghost-btn" type="button">导出</button>
        <button id="knowledge-import" class="ghost-btn" type="button">导入</button>
        <input id="knowledge-file" type="file" accept="application/json,.json" hidden>
      </div>
      <nav class="knowledge-filters" id="knowledge-filters">
        <button class="filter-chip is-active" type="button" data-subject="">全部</button>
        ${SUBJECTS.map(
          (s) =>
            `<button class="filter-chip" type="button" data-subject="${s.id}">${s.name}${
              counts[s.id] ? ` ${counts[s.id]}` : ''
            }</button>`
        ).join('')}
      </nav>
      <section id="knowledge-list" class="knowledge-list"></section>
    </div>
    <div id="shared-panel" hidden>
      <div class="knowledge-toolbar">
        <input id="shared-search" class="knowledge-search" type="search"
          placeholder="搜索共享内容" aria-label="搜索共享内容">
        <button id="shared-refresh" class="ghost-btn" type="button">刷新</button>
        <button id="shared-add" class="ghost-btn is-primary" type="button">＋ 添加</button>
      </div>
      <nav class="knowledge-filters" id="shared-filters">
        <button class="filter-chip is-active" type="button" data-shared-subject="">全部</button>
        ${SUBJECTS.map(
          (s) =>
            `<button class="filter-chip" type="button" data-shared-subject="${s.id}">${s.name}</button>`
        ).join('')}
      </nav>
      <section id="shared-list" class="knowledge-list"></section>
    </div>
  `;

  document.getElementById('knowledge-back').addEventListener('click', () => {
    if (hasInternalHistory) history.back();
    else location.hash = '#/';
  });

  let subjectFilter = '';
  let keyword = '';
  const listEl = document.getElementById('knowledge-list');

  function buildCard(entry) {
    const card = document.createElement('article');
    card.className = 'knowledge-card' + (entry.pinned ? ' is-pinned' : '');

    const head = document.createElement('div');
    head.className = 'knowledge-card-head';
    const subjectName = (SUBJECTS.find((s) => s.id === entry.subject) || {}).name || entry.subject;
    const tag = document.createElement('span');
    tag.className = 'knowledge-subject';
    tag.textContent = subjectName;
    const time = document.createElement('span');
    time.className = 'knowledge-time';
    time.textContent = relativeTime(entry.updatedAt);
    head.appendChild(tag);
    head.appendChild(time);

    const title = document.createElement('h3');
    title.textContent = entry.title || entry.question;
    title.className = 'knowledge-card-title';

    const body = document.createElement('p');
    body.className = 'knowledge-card-text';
    const plain = entry.answer.replace(/\s+/g, ' ').trim();
    body.textContent = plain.length > 160 ? plain.slice(0, 160) + '…' : plain;

    const foot = document.createElement('div');
    foot.className = 'knowledge-card-foot';

    const source = document.createElement('span');
    source.className = 'knowledge-source';
    source.textContent = entry.source ? `来源：${entry.source}` : '来源：本地学习';
    foot.appendChild(source);

    const actions = document.createElement('div');
    actions.className = 'knowledge-card-actions';

    const pin = document.createElement('button');
    pin.type = 'button';
    pin.className = 'knowledge-mini-btn';
    pin.textContent = entry.pinned ? '★' : '☆';
    pin.title = entry.pinned ? '取消置顶' : '置顶';
    pin.addEventListener('click', async () => {
      await Knowledge.togglePin(entry.id);
      renderCards();
    });

    const open = document.createElement('button');
    open.type = 'button';
    open.className = 'knowledge-mini-btn';
    open.textContent = '查看';
    open.addEventListener('click', () => {
      pendingQuestion = { subjectId: entry.subject, text: entry.question };
      location.hash = `#/subject/${entry.subject}`;
    });

    const del = document.createElement('button');
    del.type = 'button';
    del.className = 'knowledge-mini-btn is-danger';
    del.textContent = '删除';
    del.addEventListener('click', async () => {
      if (!confirm('删除这条已学内容？')) return;
      await Knowledge.remove(entry.id);
      renderCards();
    });

    actions.appendChild(pin);
    actions.appendChild(open);
    actions.appendChild(del);
    foot.appendChild(actions);

    card.appendChild(head);
    card.appendChild(title);
    card.appendChild(body);
    card.appendChild(foot);
    return card;
  }

  function renderCards() {
    if (typeof Knowledge === 'undefined') {
      listEl.innerHTML = '<p class="knowledge-empty">当前环境不支持本地存储</p>';
      return;
    }

    let items = Knowledge.list(subjectFilter || undefined);
    if (keyword) {
      const q = keyword.toLowerCase();
      items = items.filter((entry) =>
        [entry.title, entry.question, entry.answer, (entry.keywords || []).join(' ')]
          .join(' ')
          .toLowerCase()
          .includes(q)
      );
    }

    listEl.innerHTML = '';
    if (!items.length) {
      const empty = document.createElement('p');
      empty.className = 'knowledge-empty';
      empty.textContent = Knowledge.count()
        ? '没有匹配的内容'
        : '还没有学到的内容。去学科里提问，联网搜到的结果会自动存到这里。';
      listEl.appendChild(empty);
      return;
    }

    items.forEach((entry) => listEl.appendChild(buildCard(entry)));
  }

  document.getElementById('knowledge-search').addEventListener('input', (e) => {
    keyword = e.target.value.trim();
    renderCards();
  });

  document.querySelectorAll('#knowledge-filters .filter-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      document
        .querySelectorAll('#knowledge-filters .filter-chip')
        .forEach((c) => c.classList.remove('is-active'));
      chip.classList.add('is-active');
      subjectFilter = chip.dataset.subject || '';
      renderCards();
    });
  });

  document.getElementById('knowledge-export').addEventListener('click', () => {
    if (!Knowledge.count()) {
      alert('知识库还是空的，先去提问吧。');
      return;
    }
    const blob = new Blob([Knowledge.exportJSON()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const d = new Date();
    const stamp = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(
      d.getDate()
    ).padStart(2, '0')}`;
    a.href = url;
    a.download = `zhixue-knowledge-${stamp}.json`;
    a.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  });

  const fileInput = document.getElementById('knowledge-file');
  document.getElementById('knowledge-import').addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', () => {
    const file = fileInput.files && fileInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const result = await Knowledge.importJSON(String(reader.result || ''));
        renderKnowledge();
        alert(`导入完成：新增 ${result.added} 条，更新 ${result.updated} 条`);
      } catch (err) {
        console.error('[knowledge] 导入失败：', err);
        alert('导入失败：文件不是有效的知识库 JSON');
      }
    };
    reader.readAsText(file, 'utf-8');
    fileInput.value = '';
  });

  /* ---------------- 共享知识 ---------------- */
  const localPanel = document.getElementById('local-panel');
  const sharedPanel = document.getElementById('shared-panel');
  const sharedListEl = document.getElementById('shared-list');
  const sharedTotalEl = document.getElementById('shared-total');
  let sharedSubject = '';
  let sharedKeyword = '';
  let sharedStarted = false;

  function subjectName(id) {
    return (SUBJECTS.find((s) => s.id === id) || {}).name || id;
  }

  function switchTab(tab) {
    document.querySelectorAll('.knowledge-tab').forEach((btn) => {
      const active = btn.dataset.tab === tab;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-selected', String(active));
    });
    localPanel.hidden = tab !== 'local';
    sharedPanel.hidden = tab !== 'shared';
    const tip = document.getElementById('knowledge-tip');
    if (tip) {
      tip.textContent =
        tab === 'shared'
          ? '发布后，所有打开这个网站的人都能看到'
          : '只有你自己能看到，断网也能查';
    }
    if (tab === 'shared' && !sharedStarted) loadShared(false);
  }

  document.querySelectorAll('.knowledge-tab').forEach((btn) => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  function buildSharedCard(entry) {
    const card = document.createElement('article');
    card.className = 'knowledge-card';

    const head = document.createElement('div');
    head.className = 'knowledge-card-head';
    const tag = document.createElement('span');
    tag.className = 'knowledge-subject';
    tag.textContent = subjectName(entry.subject);
    const meta = document.createElement('span');
    meta.className = 'knowledge-time';
    meta.textContent = `${entry.author ? entry.author + ' · ' : ''}${relativeTime(entry.createdAt)}`;
    head.appendChild(tag);
    head.appendChild(meta);

    const title = document.createElement('h3');
    title.className = 'knowledge-card-title';
    title.textContent = entry.title;

    const body = document.createElement('p');
    body.className = 'knowledge-card-text';
    const plain = String(entry.content || '').replace(/\s+/g, ' ').trim();
    body.textContent = plain.length > 180 ? plain.slice(0, 180) + '…' : plain;

    const foot = document.createElement('div');
    foot.className = 'knowledge-card-foot';
    const source = document.createElement('span');
    source.className = 'knowledge-source';
    source.textContent = `来源：${entry.source || '共享'}`;
    foot.appendChild(source);

    const actions = document.createElement('div');
    actions.className = 'knowledge-card-actions';

    const quiz = Array.isArray(entry.quiz) ? entry.quiz.filter((q) => q && q.q && q.a) : [];
    if (quiz.length) {
      const practice = document.createElement('button');
      practice.type = 'button';
      practice.className = 'knowledge-mini-btn is-quiz';
      practice.textContent = `做练习 · ${quiz.length}`;
      practice.addEventListener('click', () => openPracticeModal(entry));
      actions.appendChild(practice);
    }

    const open = document.createElement('button');
    open.type = 'button';
    open.className = 'knowledge-mini-btn';
    open.textContent = '查看';
    open.addEventListener('click', () => {
      location.hash = `#/shared/${entry.id}`;
    });
    actions.appendChild(open);

    if (typeof SharedKnowledge !== 'undefined' && SharedKnowledge.canDelete(entry.id)) {
      const del = document.createElement('button');
      del.type = 'button';
      del.className = 'knowledge-mini-btn is-danger';
      del.textContent = '删除';
      del.addEventListener('click', async () => {
        if (!confirm('删除这条共享内容？其他人也将看不到它。')) return;
        try {
          await SharedKnowledge.remove(entry.id);
          renderShared(currentSharedError);
        } catch (err) {
          alert(`删除失败：${err.message || '请稍后再试'}`);
        }
      });
      actions.appendChild(del);
    }

    foot.appendChild(actions);
    card.appendChild(head);
    card.appendChild(title);
    card.appendChild(body);
    card.appendChild(foot);
    return card;
  }

  let currentSharedError = '';

  function renderShared(errorText) {
    if (typeof SharedKnowledge === 'undefined') {
      sharedListEl.innerHTML = '<p class="knowledge-empty">共享知识服务未加载</p>';
      return;
    }
    currentSharedError = errorText || '';

    let list = SharedKnowledge.cached();
    if (sharedSubject) list = list.filter((entry) => entry.subject === sharedSubject);
    if (sharedKeyword) {
      const q = sharedKeyword.toLowerCase();
      list = list.filter((entry) =>
        `${entry.title} ${entry.content} ${entry.author} ${subjectName(entry.subject)}`
          .toLowerCase()
          .includes(q)
      );
    }

    sharedListEl.innerHTML = '';
    if (errorText) {
      const box = document.createElement('div');
      box.className = 'knowledge-error-box';

      const warn = document.createElement('p');
      warn.className = 'knowledge-error';
      warn.textContent = `⚠ ${errorText}${list.length ? '，下面是已缓存的内容' : ''}`;
      box.appendChild(warn);

      const hint = document.createElement('p');
      hint.className = 'knowledge-error-hint';
      hint.textContent = SharedKnowledge.isLocalPage()
        ? '共享功能需要后端服务：在电脑上运行 node server.js，然后打开 http://localhost:3000。手机访问时需和电脑连同一个网络。'
        : '请检查网络后重试；本机知识和离线功能不受影响。';
      box.appendChild(hint);

      const retry = document.createElement('button');
      retry.type = 'button';
      retry.className = 'ghost-btn';
      retry.textContent = '重试';
      retry.addEventListener('click', () => loadShared(true));
      box.appendChild(retry);

      sharedListEl.appendChild(box);
    }

    if (!list.length) {
      const empty = document.createElement('p');
      empty.className = 'knowledge-empty';
      empty.textContent = errorText
        ? '共享知识库暂时不可用，请稍后重试'
        : '还没有共享内容，点右上角「＋ 添加」发布第一条';
      sharedListEl.appendChild(empty);
      return;
    }

    list.forEach((entry) => sharedListEl.appendChild(buildSharedCard(entry)));
  }

  async function loadShared(force) {
    sharedStarted = true;
    if (typeof SharedKnowledge === 'undefined') {
      renderShared('共享知识服务未加载');
      return;
    }
    sharedListEl.innerHTML = '<p class="knowledge-empty">正在连接共享知识库…</p>';
    const result = await SharedKnowledge.fetchItems(Boolean(force));
    if (sharedTotalEl) {
      sharedTotalEl.textContent = result.ok || result.items.length
        ? String(result.total || result.items.length)
        : '—';
    }
    renderShared(result.ok ? '' : result.error);
  }

  document.querySelectorAll('#shared-filters .filter-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      document
        .querySelectorAll('#shared-filters .filter-chip')
        .forEach((c) => c.classList.remove('is-active'));
      chip.classList.add('is-active');
      sharedSubject = chip.dataset.sharedSubject || '';
      renderShared(currentSharedError);
    });
  });

  document.getElementById('shared-search').addEventListener('input', (e) => {
    sharedKeyword = e.target.value.trim();
    renderShared(currentSharedError);
  });

  document.getElementById('shared-refresh').addEventListener('click', () => loadShared(true));

  document.getElementById('shared-add').addEventListener('click', () => {
    openAddEntryModal(() => {
      switchTab('shared');
      loadShared(true);
    });
  });

  // 进入页面时先取一次共享条数（失败不影响本机功能）
  if (typeof SharedKnowledge !== 'undefined') {
    SharedKnowledge.fetchItems(false).then((result) => {
      if (sharedTotalEl) {
        sharedTotalEl.textContent = result.ok || result.items.length
          ? String(result.total || result.items.length)
          : '—';
      }
    });
  }

  renderCards();
}

/* ---------------- 添加学习内容（手动 / 拍照识别） ---------------- */

let addModalEl = null;
let addModalCleanup = null;

function closeAddEntryModal() {
  if (addModalEl) {
    addModalEl.remove();
    addModalEl = null;
  }
  document.body.classList.remove('modal-open');
  if (addModalCleanup) {
    addModalCleanup();
    addModalCleanup = null;
  }
}

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('读取图片失败'));
    reader.readAsDataURL(file);
  });
}

function waitForImage(img) {
  return new Promise((resolve) => {
    if (img.complete && img.naturalWidth) {
      resolve();
      return;
    }
    img.onload = () => resolve();
    img.onerror = () => resolve();
  });
}

/**
 * 本地图片质检：分辨率、亮度、对比度、模糊度（拉普拉斯方差）。
 * 只拦截明显不合格的照片，阈值偏宽松，避免误伤。
 */
function analyzePhoto(img) {
  const width = img.naturalWidth || img.width || 0;
  const height = img.naturalHeight || img.height || 0;
  const issues = [];

  if (!width || !height) return { issues: ['图片无法读取'] };
  if (Math.min(width, height) < 600) issues.push('分辨率偏低');

  const maxSide = 640;
  const scale = Math.min(1, maxSide / Math.max(width, height));
  const w = Math.max(1, Math.round(width * scale));
  const h = Math.max(1, Math.round(height * scale));

  try {
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return { issues };
    ctx.drawImage(img, 0, 0, w, h);
    const pixels = ctx.getImageData(0, 0, w, h).data;
    const gray = new Float32Array(w * h);

    let sum = 0;
    for (let i = 0; i < w * h; i += 1) {
      const g = 0.299 * pixels[i * 4] + 0.587 * pixels[i * 4 + 1] + 0.114 * pixels[i * 4 + 2];
      gray[i] = g;
      sum += g;
    }
    const mean = sum / (w * h);

    let variance = 0;
    for (let i = 0; i < w * h; i += 1) variance += (gray[i] - mean) ** 2;
    variance /= w * h;
    const std = Math.sqrt(variance);

    let lapSum = 0;
    let lapSquare = 0;
    let count = 0;
    for (let y = 1; y < h - 1; y += 1) {
      for (let x = 1; x < w - 1; x += 1) {
        const idx = y * w + x;
        const v = 4 * gray[idx] - gray[idx - 1] - gray[idx + 1] - gray[idx - w] - gray[idx + w];
        lapSum += v;
        lapSquare += v * v;
        count += 1;
      }
    }
    const lapVar = count ? lapSquare / count - (lapSum / count) ** 2 : 0;

    if (mean < 45) issues.push('画面太暗');
    else if (mean > 228) issues.push('画面过曝');
    if (std < 16) issues.push('对比度太低');
    if (lapVar < 60) issues.push('照片偏模糊');

    return { issues, mean, std, lapVar };
  } catch {
    return { issues };
  }
}

let tesseractLoading = null;

function loadTesseractScript() {
  if (window.Tesseract) return Promise.resolve();
  if (tesseractLoading) return tesseractLoading;

  tesseractLoading = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
    script.async = true;
    const timer = setTimeout(() => reject(new Error('识别引擎加载超时，请检查网络')), 30000);
    script.onload = () => {
      clearTimeout(timer);
      if (window.Tesseract) resolve();
      else reject(new Error('识别引擎加载失败'));
    };
    script.onerror = () => {
      clearTimeout(timer);
      reject(new Error('识别引擎加载失败，请检查网络'));
    };
    document.head.appendChild(script);
  }).catch((err) => {
    tesseractLoading = null;
    throw err;
  });

  return tesseractLoading;
}

function guessSubjectFromText(text) {
  const source = String(text || '');
  if (!source) return '';
  let bestId = '';
  let bestScore = 0;

  SUBJECTS.forEach((subject) => {
    let score = 0;
    (getSubjectBank(subject.id) || []).forEach((item) => {
      const words = [item.title, ...(item.keywords || [])].filter(Boolean);
      words.forEach((word) => {
        const w = String(word).trim();
        if (w.length >= 2 && source.includes(w)) score += w.length >= 4 ? 2 : 1;
      });
    });
    if (score > bestScore) {
      bestScore = score;
      bestId = subject.id;
    }
  });

  return bestScore >= 2 ? bestId : '';
}

function openAddEntryModal(onSaved, prefill) {
  closeAddEntryModal();

  const modal = document.createElement('div');
  modal.className = 'entry-modal';
  modal.innerHTML = `
    <div class="entry-mask" data-close="1"></div>
    <div class="entry-panel" role="dialog" aria-modal="true" aria-label="添加学习内容">
      <header class="entry-head">
        <h2>添加学习内容</h2>
        <button class="entry-close" type="button" aria-label="关闭">×</button>
      </header>
      <div class="entry-tabs" role="tablist">
        <button class="entry-tab is-active" type="button" role="tab" data-mode="manual" aria-selected="true">手动输入</button>
        <button class="entry-tab" type="button" role="tab" data-mode="photo" aria-selected="false">拍照识别</button>
      </div>
      <div class="entry-body">
        <label class="entry-field">
          <span>学科</span>
          <select id="entry-subject"></select>
        </label>
        <label class="entry-field">
          <span>标题</span>
          <input id="entry-title" type="text" maxlength="60" placeholder="例如：欧姆定律">
        </label>
        <div class="entry-photo" id="entry-photo" hidden>
          <input id="entry-photo-input" type="file" accept="image/*" capture="environment" hidden>
          <div class="entry-photo-row">
            <button id="entry-photo-pick" class="ghost-btn" type="button">拍照 / 选图</button>
            <span id="entry-photo-name" class="entry-photo-name">未选择图片</span>
          </div>
          <div id="entry-preview" class="entry-preview" hidden>
            <img id="entry-preview-img" alt="待识别的照片">
          </div>
          <button id="entry-ocr" class="ghost-btn is-primary" type="button" hidden>开始识别</button>
          <p class="entry-photo-tip">拍摄建议：文字占满画面、光线均匀、镜头拿稳。首次识别需联网下载中文模型。</p>
        </div>
        <label class="entry-field">
          <span>内容</span>
          <textarea id="entry-content" rows="7" maxlength="5000"
            placeholder="输入要分享的学习内容，识别结果也会填到这里"></textarea>
        </label>
        <div class="entry-field">
          <span>练习题（选填）</span>
          <div id="entry-quiz-list" class="entry-quiz-list"></div>
          <div class="entry-quiz-ops">
            <button id="entry-quiz-add" class="ghost-btn" type="button">＋ 加一题</button>
            <button id="entry-quiz-auto" class="ghost-btn" type="button">根据内容自动出题</button>
          </div>
          <p class="entry-quiz-tip">发布后，别人打开这条内容就能直接做这些题。</p>
        </div>
        <label class="entry-field">
          <span>署名（选填）</span>
          <input id="entry-author" type="text" maxlength="20" placeholder="留空则匿名">
        </label>
        <p class="entry-tip">发布后，所有访问本网站的人都能看到这条内容。</p>
        <p id="entry-status" class="entry-status" role="status"></p>
      </div>
      <footer class="entry-actions">
        <button id="entry-cancel" class="ghost-btn" type="button">取消</button>
        <button id="entry-save" class="ghost-btn is-primary" type="button">发布到共享知识库</button>
      </footer>
    </div>
  `;
  document.body.appendChild(modal);
  document.body.classList.add('modal-open');
  addModalEl = modal;

  const state = { mode: 'manual', dataUrl: '', issues: [], busy: false, source: '' };

  const subjectSelect = modal.querySelector('#entry-subject');
  subjectSelect.innerHTML = SUBJECTS.map(
    (s) => `<option value="${s.id}">${s.name}</option>`
  ).join('');

  const titleInput = modal.querySelector('#entry-title');
  const contentInput = modal.querySelector('#entry-content');
  const authorInput = modal.querySelector('#entry-author');
  const photoBox = modal.querySelector('#entry-photo');
  const photoInput = modal.querySelector('#entry-photo-input');
  const photoPick = modal.querySelector('#entry-photo-pick');
  const photoName = modal.querySelector('#entry-photo-name');
  const preview = modal.querySelector('#entry-preview');
  const previewImg = modal.querySelector('#entry-preview-img');
  const ocrBtn = modal.querySelector('#entry-ocr');
  const saveBtn = modal.querySelector('#entry-save');
  const statusEl = modal.querySelector('#entry-status');
  const quizList = modal.querySelector('#entry-quiz-list');
  const quizRows = [];

  function renderQuizRows() {
    quizList.innerHTML = '';
    if (!quizRows.length) {
      const empty = document.createElement('p');
      empty.className = 'entry-quiz-empty';
      empty.textContent = '还没有题目，可手动添加，或点下方自动出题。';
      quizList.appendChild(empty);
      return;
    }

    quizRows.forEach((row, index) => {
      const item = document.createElement('div');
      item.className = 'quiz-edit-row';

      const top = document.createElement('div');
      top.className = 'quiz-edit-top';
      const typeSel = document.createElement('select');
      typeSel.className = 'quiz-type';
      typeSel.setAttribute('aria-label', '题型');
      typeSel.innerHTML = '<option value="fill">填空</option><option value="short">简答</option>';
      typeSel.value = row.type === 'short' ? 'short' : 'fill';
      typeSel.addEventListener('change', () => {
        row.type = typeSel.value;
      });

      const del = document.createElement('button');
      del.type = 'button';
      del.className = 'quiz-remove';
      del.setAttribute('aria-label', '删除这题');
      del.textContent = '×';
      del.addEventListener('click', () => {
        quizRows.splice(index, 1);
        renderQuizRows();
      });
      top.appendChild(typeSel);
      top.appendChild(del);

      const qInput = document.createElement('input');
      qInput.type = 'text';
      qInput.maxLength = 200;
      qInput.className = 'quiz-q';
      qInput.placeholder = '题目，例如：欧姆定律的公式是 ____';
      qInput.value = row.q || '';
      qInput.addEventListener('input', () => {
        row.q = qInput.value;
      });

      const aInput = document.createElement('input');
      aInput.type = 'text';
      aInput.maxLength = 500;
      aInput.className = 'quiz-a';
      aInput.placeholder = '参考答案';
      aInput.value = row.a || '';
      aInput.addEventListener('input', () => {
        row.a = aInput.value;
      });

      item.appendChild(top);
      item.appendChild(qInput);
      item.appendChild(aInput);
      quizList.appendChild(item);
    });
  }

  function setStatus(text, type) {
    statusEl.textContent = text || '';
    statusEl.className = 'entry-status' + (type ? ` is-${type}` : '');
  }

  if (prefill) {
    if (prefill.subject) subjectSelect.value = prefill.subject;
    if (prefill.title) titleInput.value = prefill.title;
    if (prefill.content) contentInput.value = prefill.content;
    state.source = prefill.source || '';
    if (Array.isArray(prefill.quiz)) {
      prefill.quiz.slice(0, 8).forEach((row) => {
        if (!row || !row.q || !row.a) return;
        quizRows.push({
          type: row.type === 'short' ? 'short' : 'fill',
          q: String(row.q),
          a: String(row.a)
        });
      });
    }
    if (prefill.title) {
      setStatus(
        quizRows.length ? `内容已预填，并自动生成了 ${quizRows.length} 道题` : '内容已预填，可直接发布或修改',
        ''
      );
    }
  }
  renderQuizRows();

  modal.querySelector('#entry-quiz-add').addEventListener('click', () => {
    if (quizRows.length >= 8) {
      setStatus('最多添加 8 道题', 'error');
      return;
    }
    quizRows.push({ type: 'fill', q: '', a: '' });
    renderQuizRows();
    const inputs = quizList.querySelectorAll('.quiz-q');
    if (inputs.length) inputs[inputs.length - 1].focus();
    setStatus('');
  });

  modal.querySelector('#entry-quiz-auto').addEventListener('click', () => {
    const content = contentInput.value.trim();
    if (content.length < 12) {
      setStatus('内容太短，先多写几句再自动出题', 'error');
      contentInput.focus();
      return;
    }
    const hasInput = quizRows.some((row) => String(row.q || '').trim() || String(row.a || '').trim());
    if (hasInput && !confirm('自动出题会替换当前题目，是否继续？')) return;

    const generated = generateQuiz(titleInput.value.trim(), content);
    if (!generated.length) {
      setStatus('这段内容暂时没能自动出题，可以手动添加', 'warn');
      return;
    }
    quizRows.length = 0;
    generated.forEach((row) => quizRows.push({ ...row }));
    renderQuizRows();
    setStatus(`已生成 ${generated.length} 道题，可以直接修改`, 'ok');
  });

  function close() {
    closeAddEntryModal();
  }

  modal.querySelector('.entry-close').addEventListener('click', close);
  modal.querySelector('#entry-cancel').addEventListener('click', close);
  modal.querySelector('.entry-mask').addEventListener('click', close);

  const onKey = (e) => {
    if (e.key === 'Escape') close();
  };
  document.addEventListener('keydown', onKey);
  addModalCleanup = () => document.removeEventListener('keydown', onKey);

  document.querySelectorAll('.entry-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      state.mode = tab.dataset.mode;
      document.querySelectorAll('.entry-tab').forEach((t) => {
        const active = t === tab;
        t.classList.toggle('is-active', active);
        t.setAttribute('aria-selected', String(active));
      });
      photoBox.hidden = state.mode !== 'photo';
      contentInput.placeholder =
        state.mode === 'photo'
          ? '识别出的文字会填到这里，也可以直接手动修改'
          : '输入要分享的学习内容，识别结果也会填到这里';
      setStatus('');
    });
  });

  photoPick.addEventListener('click', () => photoInput.click());

  photoInput.addEventListener('change', async () => {
    const file = photoInput.files && photoInput.files[0];
    if (!file) return;
    setStatus('正在检查图片…', 'busy');
    try {
      state.dataUrl = await readFileAsDataURL(file);
      preview.hidden = false;
      previewImg.src = state.dataUrl;
      await waitForImage(previewImg);
      photoName.textContent = file.name || '已选择图片';

      const report = analyzePhoto(previewImg);
      state.issues = report.issues || [];
      ocrBtn.hidden = false;

      if (state.issues.length) {
        ocrBtn.textContent = '仍要尝试识别';
        setStatus(`⚠ ${state.issues.join('、')}，建议重拍，或改用手动输入。`, 'warn');
      } else {
        ocrBtn.textContent = '开始识别';
        setStatus('✓ 图片清晰度基本合格，可以开始识别', 'ok');
      }
    } catch (err) {
      setStatus(err.message || '读取图片失败，请重试', 'error');
    } finally {
      photoInput.value = '';
    }
  });

  ocrBtn.addEventListener('click', async () => {
    if (!state.dataUrl || state.busy) return;
    state.busy = true;
    ocrBtn.disabled = true;
    photoPick.disabled = true;
    saveBtn.disabled = true;
    setStatus('正在加载识别引擎…首次使用需联网下载中文模型（约 15MB）', 'busy');

    let worker = null;
    try {
      await loadTesseractScript();
      worker = await window.Tesseract.createWorker('chi_sim+eng', 1, {
        logger: (msg) => {
          if (msg && typeof msg.progress === 'number') {
            setStatus(`正在识别… ${Math.round(msg.progress * 100)}%`, 'busy');
          }
        }
      });
      const { data } = await worker.recognize(state.dataUrl);
      const text = String((data && data.text) || '')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
      const confidence = Math.round((data && data.confidence) || 0);

      if (text.replace(/\s/g, '').length < 20) {
        setStatus('没有识别到足够文字。请重拍（对准文字、拿稳、光线均匀）或改用手动输入。', 'error');
        return;
      }

      if (contentInput.value.trim() && !confirm('识别结果将覆盖当前内容，是否继续？')) {
        return;
      }

      contentInput.value = text;

      if (!titleInput.value.trim()) {
        const firstLine =
          text.split('\n').map((line) => line.trim()).find((line) => line.length >= 2) || text;
        titleInput.value = firstLine.slice(0, 30);
      }

      const guessed = guessSubjectFromText(text);
      if (guessed) {
        subjectSelect.value = guessed;
        const name = (SUBJECTS.find((s) => s.id === guessed) || {}).name || '';
        setStatus(
          `识别完成（置信度 ${confidence}%），已推测学科：${name}。请核对内容后发布。`,
          confidence >= 55 ? 'ok' : 'warn'
        );
      } else {
        setStatus(
          `识别完成（置信度 ${confidence}%），请核对内容、选择学科后发布。`,
          confidence >= 55 ? 'ok' : 'warn'
        );
      }
      photoName.textContent = '识别完成';
    } catch (err) {
      setStatus(`识别失败：${err.message || '请检查网络后重试'}。可改用手动输入。`, 'error');
    } finally {
      if (worker) {
        try {
          await worker.terminate();
        } catch {
          /* 忽略终止异常 */
        }
      }
      state.busy = false;
      ocrBtn.disabled = false;
      photoPick.disabled = false;
      saveBtn.disabled = false;
    }
  });

  saveBtn.addEventListener('click', async () => {
    const subject = subjectSelect.value;
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();
    const author = authorInput.value.trim();
    const incomplete = quizRows.some(
      (row) => Boolean(String(row.q || '').trim()) !== Boolean(String(row.a || '').trim())
    );
    const quiz = quizRows
      .map((row) => ({
        type: row.type === 'short' ? 'short' : 'fill',
        q: String(row.q || '').trim(),
        a: String(row.a || '').trim()
      }))
      .filter((row) => row.q && row.a)
      .slice(0, 8);

    if (!title) {
      titleInput.focus();
      setStatus('请填写标题', 'error');
      return;
    }
    if (content.length < 5) {
      contentInput.focus();
      setStatus('内容至少 5 个字', 'error');
      return;
    }
    if (incomplete) {
      setStatus('有的题只填了题干或答案，请补全或删掉这道题', 'error');
      return;
    }
    if (typeof SharedKnowledge === 'undefined') {
      setStatus('共享服务未加载，无法发布', 'error');
      return;
    }

    saveBtn.disabled = true;
    saveBtn.textContent = '发布中…';
    try {
      const result = await SharedKnowledge.create({
        subject,
        title,
        content,
        author,
        source: state.source || (state.mode === 'photo' ? '拍照识别' : '手动录入'),
        quiz
      });
      if (!result.ok) throw new Error(result.error || '发布失败');

      // 发布者本机也存一份，断网后自己仍能查到
      if (typeof Knowledge !== 'undefined' && Knowledge.saveLearned) {
        try {
          await Knowledge.saveLearned({
            subject,
            question: title,
            answer: content,
            source: '共享知识库'
          });
        } catch {
          /* 本地保存失败不影响发布 */
        }
      }

      close();
      if (typeof onSaved === 'function') onSaved();
      alert('已发布到共享知识库，其他人现在也能看到。');
    } catch (err) {
      saveBtn.disabled = false;
      saveBtn.textContent = '发布到共享知识库';
      setStatus(`发布失败：${err.message || '无法连接共享服务器'}`, 'error');
    }
  });
}

async function renderSharedDetail(id) {
  let entry = typeof SharedKnowledge !== 'undefined' ? SharedKnowledge.get(id) : null;
  if (!entry && typeof SharedKnowledge !== 'undefined') {
    await SharedKnowledge.fetchItems(true);
    entry = SharedKnowledge.get(id);
  }

  if (location.hash !== `#/shared/${id}`) return;

  app.innerHTML = `
    <div class="topbar">
      <button id="shared-detail-back" class="back-btn" type="button">← 返回</button>
    </div>
    <article class="shared-detail" id="shared-detail"></article>
  `;

  document.getElementById('shared-detail-back').addEventListener('click', () => {
    if (hasInternalHistory) history.back();
    else location.hash = '#/knowledge';
  });

  const container = document.getElementById('shared-detail');
  if (!entry) {
    const empty = document.createElement('p');
    empty.className = 'knowledge-empty';
    empty.textContent = '这条内容不存在或已被删除。';
    container.appendChild(empty);
    return;
  }

  const meta = document.createElement('div');
  meta.className = 'shared-detail-meta';
  const tag = document.createElement('span');
  tag.className = 'knowledge-subject';
  tag.textContent = (SUBJECTS.find((s) => s.id === entry.subject) || {}).name || entry.subject;
  const author = document.createElement('span');
  author.textContent = entry.author ? `作者：${entry.author}` : '匿名作者';
  const time = document.createElement('span');
  time.textContent = new Date(entry.createdAt).toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
  meta.appendChild(tag);
  meta.appendChild(author);
  meta.appendChild(time);

  const heading = document.createElement('h1');
  heading.className = 'detail-title';
  heading.textContent = entry.title;

  const body = document.createElement('p');
  body.className = 'shared-detail-text';
  body.textContent = entry.content;

  const source = document.createElement('p');
  source.className = 'knowledge-source';
  source.textContent = `来源：${entry.source || '共享知识库'}`;

  container.appendChild(meta);
  container.appendChild(heading);
  container.appendChild(body);

  const quiz = Array.isArray(entry.quiz) ? entry.quiz.filter((q) => q && q.q && q.a) : [];
  if (quiz.length) {
    const quizBox = document.createElement('section');
    quizBox.className = 'shared-quiz';
    const quizTitle = document.createElement('h3');
    quizTitle.textContent = `练习题 · ${quiz.length} 道`;
    const quizBtn = document.createElement('button');
    quizBtn.type = 'button';
    quizBtn.className = 'ghost-btn is-primary';
    quizBtn.textContent = '开始练习';
    quizBtn.addEventListener('click', () => openPracticeModal(entry));
    quizBox.appendChild(quizTitle);
    quizBox.appendChild(quizBtn);
    container.appendChild(quizBox);
  }

  container.appendChild(source);
  window.scrollTo(0, 0);
}

/**
 * 练习弹窗：逐题作答 → 看答案 → 自评对错 → 统计结果。
 */
function openPracticeModal(entry) {
  const quiz = (Array.isArray(entry.quiz) ? entry.quiz : []).filter((q) => q && q.q && q.a);
  if (!quiz.length) return;

  const modal = document.createElement('div');
  modal.className = 'entry-modal practice-modal';
  modal.innerHTML = `
    <div class="entry-mask" data-close="1"></div>
    <div class="entry-panel practice-panel" role="dialog" aria-modal="true" aria-label="练习题">
      <header class="entry-head">
        <h2>练习题</h2>
        <button class="entry-close" type="button" aria-label="关闭">×</button>
      </header>
      <div class="entry-body practice-body" id="practice-body"></div>
      <footer class="entry-actions">
        <span id="practice-progress" class="practice-progress"></span>
        <button id="practice-close" class="ghost-btn" type="button">关闭</button>
      </footer>
    </div>
  `;
  document.body.appendChild(modal);
  document.body.classList.add('modal-open');

  const bodyEl = modal.querySelector('#practice-body');
  const progressEl = modal.querySelector('#practice-progress');
  let index = 0;
  let right = 0;

  const onKey = (e) => {
    if (e.key === 'Escape') close();
  };
  const close = () => {
    modal.remove();
    if (!document.querySelector('.entry-modal')) document.body.classList.remove('modal-open');
    document.removeEventListener('keydown', onKey);
  };

  function renderQuestion() {
    bodyEl.innerHTML = '';

    if (index >= quiz.length) {
      progressEl.textContent = `答对 ${right} / ${quiz.length} 题`;
      const done = document.createElement('p');
      done.className = 'practice-done';
      done.textContent = `练习完成！你答对了 ${right} / ${quiz.length} 题。`;
      const again = document.createElement('button');
      again.type = 'button';
      again.className = 'ghost-btn is-primary';
      again.textContent = '再练一次';
      again.addEventListener('click', () => {
        index = 0;
        right = 0;
        renderQuestion();
      });
      bodyEl.appendChild(done);
      bodyEl.appendChild(again);
      return;
    }

    progressEl.textContent = `第 ${index + 1} / ${quiz.length} 题`;
    const item = quiz[index];

    const meta = document.createElement('p');
    meta.className = 'practice-meta';
    meta.textContent = item.type === 'short' ? '简答题' : '填空题';

    const question = document.createElement('p');
    question.className = 'practice-question';
    question.textContent = item.q;

    const input = document.createElement(item.type === 'short' ? 'textarea' : 'input');
    if (input.tagName === 'TEXTAREA') input.rows = 3;
    input.className = 'practice-input';
    input.placeholder = '在这里写你的答案，不会上传';

    const actions = document.createElement('div');
    actions.className = 'practice-actions';
    const showBtn = document.createElement('button');
    showBtn.type = 'button';
    showBtn.className = 'ghost-btn is-primary';
    showBtn.textContent = '看答案';
    actions.appendChild(showBtn);

    const answerBox = document.createElement('div');
    answerBox.className = 'practice-answer-box';
    answerBox.hidden = true;

    const answerLabel = document.createElement('p');
    answerLabel.className = 'practice-answer-label';
    answerLabel.textContent = '参考答案';
    const answerText = document.createElement('p');
    answerText.className = 'practice-answer';
    answerText.textContent = item.a;

    const judge = document.createElement('div');
    judge.className = 'practice-actions';
    const rightBtn = document.createElement('button');
    rightBtn.type = 'button';
    rightBtn.className = 'ghost-btn is-primary';
    rightBtn.textContent = '我答对了';
    const wrongBtn = document.createElement('button');
    wrongBtn.type = 'button';
    wrongBtn.className = 'ghost-btn';
    wrongBtn.textContent = '没答对';
    judge.appendChild(rightBtn);
    judge.appendChild(wrongBtn);

    answerBox.appendChild(answerLabel);
    answerBox.appendChild(answerText);
    answerBox.appendChild(judge);

    showBtn.addEventListener('click', () => {
      answerBox.hidden = false;
      showBtn.hidden = true;
      input.disabled = true;
      rightBtn.focus();
    });
    rightBtn.addEventListener('click', () => {
      right += 1;
      index += 1;
      renderQuestion();
    });
    wrongBtn.addEventListener('click', () => {
      index += 1;
      renderQuestion();
    });

    bodyEl.appendChild(meta);
    bodyEl.appendChild(question);
    bodyEl.appendChild(input);
    bodyEl.appendChild(actions);
    bodyEl.appendChild(answerBox);
    input.focus();
  }

  modal.querySelector('.entry-close').addEventListener('click', close);
  modal.querySelector('#practice-close').addEventListener('click', close);
  modal.querySelector('.entry-mask').addEventListener('click', close);
  document.addEventListener('keydown', onKey);

  renderQuestion();
}

function addNotice(answerBody, notice) {
  if (!notice) return;
  const note = document.createElement('p');
  note.className = 'answer-notice';
  note.textContent = notice;
  answerBody.prepend(note);
}

function escapeHTML(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function addSource(answerBody, source) {
  if (!source) return;
  const s = document.createElement('p');
  s.className = 'answer-source';
  s.textContent = source;
  answerBody.appendChild(s);
}

function addLearnBadge(answerBody, result) {
  if (!result.learned && !result.learnedFrom) return;

  const from = String(result.learnedFrom || '');
  if (from.indexOf('shared:') === 0) {
    const link = document.createElement('a');
    link.className = 'learn-badge is-shared';
    link.href = `#/shared/${from.slice(7)}`;
    link.textContent = '✓ 来自共享知识库 · 点击查看原文';
    answerBody.appendChild(link);
    return;
  }

  const badge = document.createElement('p');
  badge.className = 'learn-badge';
  badge.textContent = result.learned
    ? '✓ 已加入我的知识库 · 以后离线也能查'
    : '✓ 来自我的知识库 · 离线可用';
  answerBody.appendChild(badge);
}

// ---- Web Speech API ----
let ttsUtterance = null;
let ttsSpeaking = false;

function stopTTS() {
  if (typeof speechSynthesis !== 'undefined') {
    speechSynthesis.cancel();
  }
  ttsSpeaking = false;
}

function speakText(text, onEnd) {
  if (typeof speechSynthesis === 'undefined') {
    return false;
  }
  stopTTS();
  ttsUtterance = new SpeechSynthesisUtterance(text);
  ttsUtterance.lang = 'zh-CN';
  ttsUtterance.rate = 0.95;
  ttsUtterance.onend = () => {
    ttsSpeaking = false;
    if (onEnd) onEnd();
  };
  ttsUtterance.onerror = () => {
    ttsSpeaking = false;
    if (onEnd) onEnd();
  };
  speechSynthesis.speak(ttsUtterance);
  ttsSpeaking = true;
  return true;
}

function buildPoemWithAudio(poem) {
  const hasPinyin = Array.isArray(poem.pinyin) && poem.pinyin.length === poem.poem.length;
  return `
    <h2 class="poem-title-row">
      <span class="poem-title">《${poem.title}》</span>
      <button class="poem-read-btn" type="button" aria-label="朗读">
        <span class="poem-read-ico">▶</span><span class="poem-read-label">朗读</span>
      </button>
      ${hasPinyin ? `<button class="poem-pinyin-btn" type="button" aria-label="显示拼音">拼音</button>` : ''}
    </h2>
    <p class="poem-meta">${poem.dynasty} · <a class="author-link" href="#/detail/chinese/author/${poem.id}">${poem.author}</a></p>
    <div class="poem-lines">
      ${poem.poem
        .map(
          (line, i) =>
            `<p class="poem-line">${
              hasPinyin ? `<span class="poem-pinyin" hidden>${poem.pinyin[i]}</span>` : ''
            }<span class="poem-text">${line}</span></p>`
        )
        .join('')}
    </div>
  `;
}

function bindPoemAudio(answerBody, poem) {
  const btn = answerBody.querySelector('.poem-read-btn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const poemText = poem.poem.join('');
    if (ttsSpeaking) {
      stopTTS();
      btn.classList.remove('is-active');
      btn.querySelector('.poem-read-ico').textContent = '▶';
      btn.querySelector('.poem-read-label').textContent = '朗读';
    } else {
      const ok = speakText(poemText, () => {
        btn.classList.remove('is-active');
        btn.querySelector('.poem-read-ico').textContent = '▶';
        btn.querySelector('.poem-read-label').textContent = '朗读';
      });
      if (ok) {
        btn.classList.add('is-active');
        btn.querySelector('.poem-read-ico').textContent = '⏸';
        btn.querySelector('.poem-read-label').textContent = '停止';
      }
    }
  });

  // 拼音开关
  const pyBtn = answerBody.querySelector('.poem-pinyin-btn');
  if (pyBtn) {
    pyBtn.addEventListener('click', () => {
      const show = pyBtn.classList.toggle('is-active');
      answerBody.querySelectorAll('.poem-pinyin').forEach((el) => {
        el.hidden = !show;
      });
      pyBtn.textContent = show ? '隐藏拼音' : '拼音';
    });
  }
}

/**
 * 保证给出的内容一定是字符串。
 * 数据异常（例如误传了 {type, answer} 这种对象）时，取出其中的正文，避免页面显示 [object Object]。
 */
function normalizeBrief(value) {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object') {
    if (typeof value.answer === 'string') return value.answer;
    if (typeof value.brief === 'string') return value.brief;
    if (typeof value.content === 'string') return value.content;
    if (typeof value.text === 'string') return value.text;
    try {
      return JSON.stringify(value);
    } catch {
      return '';
    }
  }
  return String(value);
}

function renderAnswer(answerBody, result) {  answerBody.classList.remove('muted', 'poem-answer', 'is-dictation');

  if (result.type === 'poem') {
    const poem = result.poem;
    answerBody.classList.add('poem-answer');
    answerBody.innerHTML = buildPoemWithAudio(poem);
    renderMath(answerBody);
    addNotice(answerBody, result.notice);
    addSource(answerBody, result.source);
    addLearnBadge(answerBody, result);
    bindPoemAudio(answerBody, poem);
    bindDictationToggle(answerBody, poem);
    addRelated(answerBody, result);
    return;
  }

  const brief = result.problem
    ? result.problem.brief
    : result.topic
      ? result.topic.brief || result.topic.title || ''
      : normalizeBrief(result.answer);

  renderBriefAnswer(answerBody, brief);
  addNotice(answerBody, result.notice);
  addSource(answerBody, result.source);
  addLearnBadge(answerBody, result);
  addShareButton(answerBody, result);
  addRelated(answerBody, result);
}

/**
 * 根据一段学习内容自动生成练习题（填空 / 简答），不需要联网或 AI 接口。
 * 规则：标题填空 → 数字填空 → 定义式简答 → 公式填空，去重后最多 4 道。
 */
function generateQuiz(title, content) {
  const text = String(content || '').replace(/\r\n?/g, '\n').trim();
  if (text.length < 12) return [];

  const sentences = text
    .split(/[。！？!?；;\n]+/)
    .map((s) => s.trim())
    .filter((s) => s.length >= 6);

  const out = [];
  const seen = new Set();
  const push = (type, q, a) => {
    const question = String(q || '').trim();
    const answer = String(a || '').trim();
    if (!question || !answer) return;
    const key = question.replace(/\s/g, '');
    if (seen.has(key)) return;
    seen.add(key);
    out.push({ type, q: question, a: answer });
  };

  const cleanTitle = String(title || '').trim();
  if (cleanTitle.length >= 2 && cleanTitle.length <= 20) {
    const hit = sentences.find(
      (s) => s.includes(cleanTitle) && s.length > cleanTitle.length + 4
    );
    if (hit) push('fill', `填空：${hit.replace(cleanTitle, '____')}`, cleanTitle);
  }

  if (out.length < 3) {
    for (const s of sentences) {
      const match = s.match(
        /\d+(?:\.\d+)?\s*(?:%|℃|°C|km\/s|km|m\/s|kg|mol|mL|L|m|g|s|元|年|个|种|次|倍)?/
      );
      if (!match) continue;
      const token = match[0].trim();
      const blanked = s.replace(token, '____');
      if (token.length < 1 || !blanked.includes('____')) continue;
      push('fill', `填空：${blanked}`, token);
      break;
    }
  }

  if (out.length < 3) {
    for (const s of sentences) {
      const match = s.match(/^(.{2,20}?)(?:是|指|称为|叫做|被誉为)(.{4,})$/);
      if (!match) continue;
      const term = match[1].replace(/^(?:所谓|其中|它|这|那|其)/, '').trim();
      if (term.length < 2 || /^(?:什么|怎么|如何|我们|他们|人们)$/.test(term)) continue;
      push('short', `简答：什么是「${term}」？`, s);
      break;
    }
  }

  if (out.length < 3) {
    const formula = text.match(/\$([^$]{2,40})\$/);
    if (formula) push('fill', '填空：请写出文中出现的公式 ____', formula[1].trim());
  }

  return out.slice(0, 4);
}

/**
 * 把当前回答一键分享到共享知识库（预填标题、内容和自动生成的练习题）。
 */
function addShareButton(answerBody, result) {
  const text = result.answer || '';
  const from = String(result.learnedFrom || '');
  if (!text || from.indexOf('shared:') === 0) return;

  const subjectId = (location.hash.match(/^#\/subject\/([^/]+)/) || [])[1] || '';
  if (!subjectId) return;

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'share-answer-btn';
  btn.textContent = '分享到共享知识库';
  btn.addEventListener('click', () => {
    const saved = answers[subjectId];
    const question = (saved && saved.question) || '';
    const fallbackTitle = text.replace(/\s+/g, ' ').trim().slice(0, 30);
    const title = (question || fallbackTitle).slice(0, 60);
    openAddEntryModal(
      () => {},
      {
        subject: subjectId,
        title,
        content: text,
        source: 'AI 学习助手',
        quiz: generateQuiz(title, text)
      }
    );
  });
  answerBody.appendChild(btn);
}

/**
 * 学科联动：显示"相关学科"标签，点击后跳到对应学科并自动提问。
 */
function addRelated(answerBody, result) {
  const related =
    (result.poem && result.poem.related) ||
    (result.problem && result.problem.related) ||
    (result.topic && result.topic.related) ||
    [];
  if (!related.length) return;

  const wrap = document.createElement('div');
  wrap.className = 'related-block';
  wrap.innerHTML = `<span class="related-label">相关学科</span>`;
  related.forEach((item) => {
    const name = (SUBJECTS.find((s) => s.id === item.subject) || {}).name || item.subject;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'related-chip';
    btn.textContent = `${name} · ${item.keyword}`;
    btn.addEventListener('click', () => {
      pendingQuestion = { subjectId: item.subject, text: item.keyword };
      location.hash = `#/subject/${item.subject}`;
    });
    wrap.appendChild(btn);
  });
  answerBody.appendChild(wrap);
}

// 跨学科跳转时带过去的待提问内容
let pendingQuestion = null;

// ---- 默写 ----
let dictationActive = false;

function bindDictationToggle(answerBody, poem) {
  // 触发在 SUBJECT_ACTIONS 的 dictation 按钮，这里只负责把 poem 挂到 answerBody.dataset 上
  answerBody.dataset.dictationPoem = JSON.stringify(poem.poem);
  answerBody.dataset.dictationActive = 'false';
}

function toggleDictation(answerBody, enable) {
  const poemLines = JSON.parse(answerBody.dataset.dictationPoem || '[]');
  if (!poemLines.length) return;

  if (enable) {
    dictationActive = true;
    answerBody.dataset.dictationActive = 'true';
    answerBody.classList.add('is-dictation');
    // 存原文用于对照
    answerBody.dataset.dictationAnswer = JSON.stringify(poemLines);

    const linesInputs = poemLines
      .map(
        (_, i) => `
      <div class="dictation-row" data-line="${i}">
        <input class="dictation-input" type="text" placeholder="第${i + 1}句">
        <span class="dictation-result"></span>
      </div>`
      )
      .join('');

    answerBody.innerHTML = `
      <h2 class="poem-title">默写：请写出《${JSON.parse(answerBody.dataset.dictationPoem).join('').substring(0, 4)}》…</h2>
      <div class="dictation-area">${linesInputs}</div>
      <div class="dictation-actions">
        <button id="dictation-submit" class="dictation-submit" type="button">提交默写</button>
        <button id="dictation-quit" class="dictation-quit" type="button">退出默写</button>
      </div>
    `;

    answerBody.querySelectorAll('.dictation-input').forEach((input) => {
      input.focus();
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const row = input.closest('.dictation-row');
          const next = row.nextElementSibling?.querySelector('.dictation-input');
          if (next) next.focus();
          else document.getElementById('dictation-submit')?.click();
        }
      });
    });

    document.getElementById('dictation-submit').addEventListener('click', () => {
      const answers = JSON.parse(answerBody.dataset.dictationAnswer);
      let correct = 0;
      answerBody.querySelectorAll('.dictation-row').forEach((row) => {
        const i = Number(row.dataset.line);
        const input = row.querySelector('.dictation-input');
        const result = row.querySelector('.dictation-result');
        const user = input.value.trim();
        const expected = answers[i];
        // 去掉标点和空格做宽松比对
        const norm = (s) => s.replace(/[\s，。？！、；：""''（）\[\]…—]/g, '');
        if (norm(user) === norm(expected)) {
          result.textContent = '✓';
          result.className = 'dictation-result ok';
          row.classList.add('is-ok');
          correct++;
        } else {
          result.textContent = `✗ 正确：${expected}`;
          result.className = 'dictation-result err';
          row.classList.add('is-err');
        }
      });
      const summary = document.createElement('p');
      summary.className = 'dictation-summary';
      summary.textContent = `共 ${answers.length} 句，答对 ${correct} 句。${correct === answers.length ? '全部正确，太棒了！' : '加油，再试一次吧。'}`;
      answerBody.querySelector('.dictation-actions').before(summary);
    });

    document.getElementById('dictation-quit').addEventListener('click', () => {
      restorePoemFromAnswer(answerBody);
    });
  } else {
    restorePoemFromAnswer(answerBody);
  }
}

function restorePoemFromAnswer(answerBody) {
  const savedPoem = answers[currentSubjectId];
  if (savedPoem && savedPoem.result.type === 'poem') {
    answerBody.classList.remove('is-dictation');
    answerBody.dataset.dictationActive = 'false';
    dictationActive = false;
    answerBody.innerHTML = buildPoemWithAudio(savedPoem.result.poem);
    bindPoemAudio(answerBody, savedPoem.result.poem);
    bindDictationToggle(answerBody, savedPoem.result.poem);
  }
}

function renderSubject(subject) {
  currentSubjectId = subject.id;
  const actions = SUBJECT_ACTIONS[subject.id] || [];

  // 关闭朗读和抽屉（并清理可能残留的遮罩，避免页面被锁死）
  stopTTS();
  dictationActive = false;
  closeHistoryDrawer();
  document.querySelectorAll('.history-drawer').forEach((el) => el.remove());
  document.body.classList.remove('history-drawer-open');

  app.innerHTML = `
    <header class="subject-head">
      <a class="back-link" href="#/" id="subject-back">← 返回</a>
      <div class="subject-head-title">
        <span class="subject-badge">${SUBJECT_ICONS[subject.id] || ''}</span>
        <div class="subject-head-text">
          <h1>${subject.name}</h1>
          <span class="subject-head-en">${subject.en}</span>
        </div>
      </div>
      <button id="history-btn" class="history-btn" type="button" aria-label="历史记录" title="历史记录">
        <span class="history-btn-ico">⏱</span>
        <span class="history-btn-label">历史</span>
      </button>
    </header>
    <section class="ask-area">
      <div class="ask-input-wrap">
        <input id="question-input" class="question-input" type="text"
          placeholder="输入你想问的问题，试试：${getSamplePlaceholder(subject.id)}"
          aria-label="输入问题" autocomplete="off" role="combobox" aria-expanded="false"
          aria-controls="suggest-list" aria-autocomplete="list">
        <button id="input-clear" class="input-clear" type="button" hidden aria-label="清空">×</button>
        <div id="suggest-list" class="suggest-list" role="listbox" hidden></div>
      </div>
      <button id="ask-btn" class="primary-btn" type="button">提问</button>
    </section>
    <section class="answer-card">
      <div id="answer-body" class="answer-body muted" aria-live="polite">回答将显示在这里</div>
    </section>
    <section id="diagram-area"></section>
    <section class="action-area">
      ${actions
        .map(
          (a) =>
            `<button class="action-btn" type="button" data-key="${a.key}" disabled>${a.label}</button>`
        )
        .join('')}
    </section>
  `;

  const input = document.getElementById('question-input');
  const clearBtn = document.getElementById('input-clear');
  const askBtn = document.getElementById('ask-btn');
  const answerBody = document.getElementById('answer-body');
  const suggestList = document.getElementById('suggest-list');
  const actionBtns = app.querySelectorAll('.action-btn');

  // ---- 输入联想 ----
  let suggestions = [];
  let activeSuggest = -1;

  function hideSuggestions() {
    suggestions = [];
    activeSuggest = -1;
    suggestList.hidden = true;
    suggestList.innerHTML = '';
    input.setAttribute('aria-expanded', 'false');
  }

  function updateSuggestActive() {
    suggestList.querySelectorAll('.suggest-item').forEach((el, i) => {
      el.classList.toggle('is-active', i === activeSuggest);
    });
  }

  function renderSuggestions() {
    const q = input.value.trim().toLowerCase();
    if (!q) {
      hideSuggestions();
      return;
    }

    const pool = [];
    getSubjectBank(subject.id).forEach((item) => {
      const label = getBankItemLabel(subject.id, item);
      pool.push({
        label,
        value: label,
        keys: [label, item.title || '', ...(item.keywords || []), ...(item.question || [])]
      });
    });
    if (typeof Knowledge !== 'undefined') {
      Knowledge.list(subject.id).forEach((entry) => {
        pool.push({
          label: entry.title || entry.question,
          value: entry.question,
          keys: [entry.title, entry.question, ...(entry.keywords || [])],
          learned: true
        });
      });
    }
    if (typeof SharedKnowledge !== 'undefined') {
      SharedKnowledge.cached(subject.id).forEach((entry) => {
        pool.push({
          label: entry.title,
          value: entry.title,
          keys: [entry.title, entry.author],
          shared: true
        });
      });
    }

    const scored = [];
    pool.forEach((item) => {
      let score = 0;
      item.keys.forEach((k) => {
        const nk = String(k || '').toLowerCase();
        if (!nk || nk === q) return;
        if (nk.startsWith(q)) score = Math.max(score, 2);
        else if (nk.includes(q)) score = Math.max(score, 1);
        // 用户输入了更长的问法（如“牛顿第二定律是什么”），也能联想出对应知识点
        else if (nk.length >= 2 && q.includes(nk)) score = Math.max(score, 1);
      });
      if (score > 0) scored.push({ ...item, score });
    });

    scored.sort((a, b) => b.score - a.score);
    suggestions = scored.slice(0, 6);
    activeSuggest = -1;

    if (!suggestions.length) {
      hideSuggestions();
      return;
    }

    suggestList.innerHTML = suggestions
      .map(
        (s, i) =>
          `<button class="suggest-item" type="button" role="option" data-index="${i}">${escapeHTML(
            s.label
          )}${
            s.learned
              ? '<span class="suggest-tag">已学</span>'
              : s.shared
                ? '<span class="suggest-tag">共享</span>'
                : ''
          }</button>`
      )
      .join('');
    suggestList.hidden = false;
    input.setAttribute('aria-expanded', 'true');
  }

  function pickSuggestion(index) {
    const picked = suggestions[index];
    if (!picked) return;
    input.value = picked.value || picked.label;
    clearBtn.hidden = false;
    hideSuggestions();
    handleAsk();
  }

  // 输入框 × 清空按钮
  input.addEventListener('input', () => {
    clearBtn.hidden = !input.value.trim();
    renderSuggestions();
  });
  input.addEventListener('focus', () => {
    if (input.value.trim()) renderSuggestions();
  });
  input.addEventListener('blur', () => {
    window.setTimeout(hideSuggestions, 120);
  });
  clearBtn.addEventListener('click', () => {
    input.value = '';
    clearBtn.hidden = true;
    hideSuggestions();
    input.focus();
  });

  suggestList.addEventListener('mousedown', (e) => {
    const btn = e.target.closest('.suggest-item');
    if (!btn) return;
    e.preventDefault();
    pickSuggestion(Number(btn.dataset.index));
  });

  function enableActions() {
    actionBtns.forEach((btn) => {
      btn.disabled = false;
    });
  }

  async function handleAsk() {
    const question = input.value.trim();
    if (!question) {
      input.classList.remove('is-shaking');
      void input.offsetWidth;
      input.classList.add('is-shaking');
      input.addEventListener(
        'animationend',
        () => input.classList.remove('is-shaking'),
        { once: true }
      );
      input.focus();
      return;
    }

    askBtn.disabled = true;
    askBtn.textContent = '提问中…';
    answerBody.classList.add('muted');
    answerBody.classList.remove('poem-answer', 'is-dictation');
    answerBody.innerHTML = `<span class="answer-loading">思考中<span class="loading-dots" aria-hidden="true"><span></span><span></span><span></span></span></span>`;
    renderDiagram(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      const result = await askAI(question, subject.id);
      answers[subject.id] = { question, result };
      saveHistory(subject.id, question, result);
      renderAnswer(answerBody, result);
      renderDiagram(result);
      enableActions();
      hideSuggestions();
      // 清空按钮在回答后保持显示（因为 input 还有值）
      clearBtn.hidden = false;
      // 手机端回答较长时，自动把回答区滚到视野内
      if (window.innerWidth <= 640) {
        answerBody.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    } finally {
      askBtn.disabled = false;
      askBtn.textContent = '提问';
    }
  }

  askBtn.addEventListener('click', handleAsk);
  input.addEventListener('keydown', (e) => {
    if (!suggestList.hidden && suggestions.length) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        activeSuggest = (activeSuggest + 1) % suggestions.length;
        updateSuggestActive();
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        activeSuggest = (activeSuggest - 1 + suggestions.length) % suggestions.length;
        updateSuggestActive();
        return;
      }
      if (e.key === 'Escape') {
        hideSuggestions();
        return;
      }
      if (e.key === 'Enter' && activeSuggest >= 0 && !e.isComposing) {
        e.preventDefault();
        pickSuggestion(activeSuggest);
        return;
      }
    }
    if (e.key === 'Enter' && !e.isComposing) {
      hideSuggestions();
      handleAsk();
    }
  });

  actionBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.key;
      if (key === 'dictation') {
        if (dictationActive) {
          toggleDictation(answerBody, false);
          btn.textContent = '默写';
        } else {
          toggleDictation(answerBody, true);
          btn.textContent = '退出';
        }
        return;
      }
      const entityId = getAnswerEntityId(subject.id);
      const base = `#/detail/${subject.id}/${key}`;
      location.hash = entityId ? `${base}/${entityId}` : base;
    });
  });

  // 返回：优先回到上一个页面（相关学科跳转后可回到原学科并保留内容），
  // 只有没有上一页时才回首页
  document.getElementById('subject-back').addEventListener('click', (e) => {
    e.preventDefault();
    if (history.length > 1) {
      history.back();
    } else {
      location.hash = '#/';
    }
  });

  // 历史抽屉按钮
  document.getElementById('history-btn').addEventListener('click', () => {
    openHistoryDrawer(subject);
  });

  // 恢复该学科之前保存的问答状态（从详情页 / 相关学科返回时不清空）
  const saved = answers[subject.id];
  if (saved) {
    try {
      input.value = saved.question;
      clearBtn.hidden = false;
      renderAnswer(answerBody, saved.result);
      renderDiagram(saved.result);
      enableActions();
    } catch (err) {
      console.error('[subject] 恢复上次回答失败：', err);
      delete answers[subject.id];
    }
  }

  // 跨学科联动：带着关键词跳转过来时自动提问
  if (pendingQuestion && pendingQuestion.subjectId === subject.id) {
    const q = pendingQuestion.text;
    pendingQuestion = null;
    input.value = q;
    clearBtn.hidden = false;
    handleAsk();
  }

  // 后台预热共享知识缓存，让输入联想与提问都能命中
  if (
    typeof SharedKnowledge !== 'undefined' &&
    typeof navigator !== 'undefined' &&
    navigator.onLine
  ) {
    SharedKnowledge.fetchItems(false);
  }
}

function getSamplePlaceholder(subjectId) {
  const samples = {
    chinese: '静夜思 / 沁园春·雪 / 天净沙·秋思',
    math: '勾股定理 / 三角形面积 / 概率',
    english: '现在完成时 / 被动语态 / 定语从句',
    physics: '牛顿第二定律 / 欧姆定律 / 浮力',
    chemistry: '酸碱中和 / 质量守恒 / 氧化还原',
    biology: '光合作用 / 细胞结构 / 遗传',
    geography: '黄河 / 长江 / 等高线 / 板块运动',
    history: '秦朝统一 / 辛亥革命 / 鸦片战争'
  };
  return samples[subjectId] || '输入你想问的问题';
}

function getAnswerEntityId(subjectId) {
  const current = answers[subjectId];
  if (!current) return '';

  if (current.result.type === 'poem') return current.result.poem.id;
  if (current.result.type === 'math') return current.result.problem.id;
  if (current.result.type === 'geo') return current.result.topic.id;
  if (
    ['physics', 'chemistry', 'biology', 'english', 'history'].includes(
      current.result.type
    )
  ) {
    return current.result.topic.id;
  }
  return '';
}

function renderBriefAnswer(answerBody, text) {
  answerBody.textContent = text;
  renderMath(answerBody);
}

function formulaListHtml(items) {
  return `
    <div class="formula-list">
      ${items
        .map(
          (item) => `
        <div class="formula-item">
          <div class="formula-latex">${item.latex ? `$${item.latex}$` : item.html}</div>
          <p class="formula-desc">${item.desc}</p>
        </div>`
        )
        .join('')}
    </div>
  `;
}

function numberedListHtml(items) {
  return `
    <ol class="numbered-list">
      ${items.map((item) => `<li>${item}</li>`).join('')}
    </ol>
  `;
}

const STEP_NUMERALS = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];

function deepStepsHtml(steps) {
  return steps
    .map(
      (item, index) => `
    <section class="step-item">
      <h3 class="step-title">第${STEP_NUMERALS[index] || index + 1}步：${item.step}</h3>
      <p class="step-content">${item.content}</p>
    </section>`
    )
    .join('');
}

function nodeMetrics(place) {
  const lines = place.lines || [place.name];
  return { lines, height: 5 + lines.length * 4.2 };
}

// 简化的中国轮廓示意路径（viewBox 100 × 60，仅作地理示意图底图）
const CHINA_OUTLINE =
  'M18,8 L26,5 L34,9 L42,6 L50,9 L58,6 L66,9 L74,7 L82,11 L86,17 L84,23 ' +
  'L90,27 L86,33 L82,31 L80,37 L74,36 L72,42 L64,41 L60,47 L52,45 L48,50 ' +
  'L40,48 L34,52 L26,49 L20,44 L16,38 L12,32 L14,26 L9,20 L13,15 Z';

function buildNodeDiagram(topic) {
  const NODE_W = 30;

  const edgePoint = (place, target) => {
    const dx = target.x - place.x;
    const dy = target.y - place.y;
    const halfW = NODE_W / 2 + 1;
    const halfH = nodeMetrics(place).height / 2 + 1;
    const t = Math.min(
      halfW / Math.max(Math.abs(dx), 0.001),
      halfH / Math.max(Math.abs(dy), 0.001)
    );
    return { x: place.x + dx * t, y: place.y + dy * t };
  };

  const links = topic.links
    .map(([from, to, label]) => {
      const start = edgePoint(topic.places[from], topic.places[to]);
      const end = edgePoint(topic.places[to], topic.places[from]);
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const len = Math.hypot(dx, dy) || 1;
      let nx = -dy / len;
      let ny = dx / len;
      if (ny > 0) {
        nx = -nx;
        ny = -ny;
      }

      return `
        <line class="geo-link" x1="${start.x}" y1="${start.y}" x2="${end.x}" y2="${end.y}"
          marker-end="url(#geo-arrow)"></line>
        <text class="geo-link-label" font-size="2.8" x="${(start.x + end.x) / 2 + nx * 7}"
          y="${(start.y + end.y) / 2 + ny * 7}">${label}</text>`;
    })
    .join('');

  const nodes = topic.places
    .map((place, index) => {
      const { lines, height } = nodeMetrics(place);
      const texts = lines
        .map((line, i) => {
          const offset = (i - (lines.length - 1) / 2) * 4.2 + 1.1;
          return `<text x="${place.x}" y="${place.y + offset}" text-anchor="middle" font-size="3.1">${line}</text>`;
        })
        .join('');

      return `
      <g class="geo-node" data-index="${index}" role="button" tabindex="0" aria-label="${place.name}">
        <rect x="${place.x - NODE_W / 2}" y="${place.y - height / 2}"
          width="${NODE_W}" height="${height}" rx="4.5"></rect>
        ${texts}
      </g>`;
    })
    .join('');

  const maxBottom = Math.max(
    ...topic.places.map((place) => place.y + nodeMetrics(place).height / 2)
  );
  const viewHeight = Math.ceil(maxBottom + 8);

  return `
    <svg class="geo-svg" viewBox="0 0 100 ${viewHeight}" role="img" aria-label="${topic.keywords[0]}关系图">
      <defs>
        <marker id="geo-arrow" viewBox="0 0 10 10" refX="9" refY="5"
          markerWidth="4" markerHeight="4" orient="auto-start-reverse" markerUnits="userSpaceOnUse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#2B6CB0"></path>
        </marker>
      </defs>
      ${topic.showMap ? `<path class="geo-map-bg" d="${CHINA_OUTLINE}"></path>` : ''}
      ${links}
      ${nodes}
    </svg>`;
}

function popupHtml() {
  return `
    <div id="geo-popup" class="geo-popup" hidden>
      <div class="geo-popup-card" role="dialog" aria-modal="true" aria-labelledby="geo-popup-name">
        <button id="geo-popup-close" class="geo-popup-close" type="button" aria-label="关闭">×</button>
        <h3 id="geo-popup-name"></h3>
        <p id="geo-popup-info"></p>
      </div>
    </div>
  `;
}

function bindDiagramEvents(topic) {
  const popup = document.getElementById('geo-popup');
  if (!popup) return;

  const popupName = document.getElementById('geo-popup-name');
  const popupInfo = document.getElementById('geo-popup-info');

  app.querySelectorAll('.geo-node').forEach((node) => {
    node.addEventListener('click', () => {
      const place = topic.places[Number(node.dataset.index)];
      popupName.textContent = place.name;
      popupInfo.textContent = place.info;
      popup.hidden = false;
    });
  });

  document.getElementById('geo-popup-close').addEventListener('click', () => {
    popup.hidden = true;
  });

  popup.addEventListener('click', (event) => {
    if (event.target === popup) {
      popup.hidden = true;
    }
  });
}

function renderDiagram(result) {
  const area = document.getElementById('diagram-area');
  if (!area) return;

  if (!result || result.type !== 'geo') {
    area.innerHTML = '';
    return;
  }

  const topic = result.topic;
  area.innerHTML = `
    <section class="diagram-card">
      <h2 class="diagram-title">关系图</h2>
      ${buildNodeDiagram(topic)}
      <p class="diagram-hint">点击节点查看地点信息</p>
    </section>
    ${popupHtml()}
  `;

  bindDiagramEvents(topic);
}

function detailShell(content) {
  return `
    <div class="topbar">
      <button id="detail-back" class="back-btn" type="button">← 返回</button>
    </div>
    <main class="detail-card">
      ${content}
    </main>
  `;
}

function detailEmptyHtml() {
  return `<p class="detail-empty">暂无内容</p>`;
}

function renderChineseDetail(action, poem) {
  let content;

  if (!poem) {
    content = detailEmptyHtml();
  } else if (action.key === 'translate') {
    content = `
      <h2 class="detail-title">${poem.title} · 翻译</h2>
      <p class="detail-meta">${poem.dynasty} · ${poem.author}</p>
      <div class="line-pairs">
        ${poem.poem
          .map(
            (line, i) => `
          <div class="line-pair">
            <p class="line-src">${line}</p>
            <p class="line-trans">${poem.translation[i] || ''}</p>
          </div>`
          )
          .join('')}
      </div>
    `;
  } else if (action.key === 'explain') {
    content = `
      <h2 class="detail-title">${poem.title} · 内容解释</h2>
      <p class="detail-meta">${poem.dynasty} · ${poem.author}</p>
      ${Object.entries(poem.appreciation)
        .map(
          ([label, text]) => `
        <section class="detail-section">
          <h3>${label}</h3>
          <p>${text}</p>
        </section>`
        )
        .join('')}
    `;
  } else {
    content = `
      <h2 class="detail-title">${poem.author}</h2>
      <div class="info-list">
        ${Object.entries(poem.authorIntro)
          .map(
            ([label, text]) => `
          <div class="info-row">
            <span class="info-label">${label}</span>
            <span class="info-value">${text}</span>
          </div>`
          )
          .join('')}
      </div>
    `;
  }

  mountDetail(content);
}

function renderMathDetail(action, problem) {
  if (!problem) {
    mountDetail(detailEmptyHtml());
    return;
  }

  const body =
    action.key === 'formula'
      ? formulaListHtml(problem.formulas)
      : deepStepsHtml(problem.deepSteps);

  mountDetail(`
    <h2 class="detail-title">${problem.question[0]} · ${action.label}</h2>
    ${body}
  `);
}

function renderGeoDetail(action, topic) {
  if (!topic) {
    mountDetail(detailEmptyHtml());
    return;
  }

  const items = action.key === 'structure' ? topic.structure : topic.localInfo;
  mountDetail(`
    <h2 class="detail-title">${topic.keywords[0]} · ${action.label}</h2>
    ${numberedListHtml(items)}
  `);
}

function renderTopicDetail(action, topic) {
  if (!topic) {
    mountDetail(detailEmptyHtml());
    return;
  }

  const body =
    action.key === 'formula' || action.key === 'equation'
      ? formulaListHtml(topic.formulas || topic.equations)
      : action.key === 'structure'
        ? numberedListHtml(topic.structure)
        : deepStepsHtml(topic.deepSteps);

  mountDetail(`
    <h2 class="detail-title">${topic.keywords[0]} · ${action.label}</h2>
    ${body}
  `);
}

function renderEnglishDetail(action, topic) {
  if (!topic) {
    mountDetail(detailEmptyHtml());
    return;
  }

  mountDetail(`
    <h2 class="detail-title">${topic.title} · ${action.label}</h2>
    <section class="detail-section">
      <h3>结构</h3>
      <div class="pattern-lines">
        ${topic.structures.map((line) => `<p class="pattern-line">${line}</p>`).join('')}
      </div>
    </section>
    <section class="detail-section">
      <h3>用法</h3>
      ${numberedListHtml(topic.usages)}
    </section>
    <section class="detail-section">
      <h3>例句</h3>
      <div class="example-list">
        ${topic.examples
          .map(
            (item) => `
          <div class="example-item">
            <p class="example-en">${item.en}</p>
            <p class="example-zh">${item.zh}</p>
          </div>`
          )
          .join('')}
      </div>
    </section>
    <section class="detail-section">
      <h3>易错点</h3>
      <p>${topic.mistake}</p>
    </section>
  `);
}

function renderHistoryDetail(action, topic) {
  if (!topic) {
    mountDetail(detailEmptyHtml());
    return;
  }

  mountDetail(`
    <h2 class="detail-title">${topic.title} · ${action.label}</h2>
    <section class="detail-section">
      <h3>时间与人物</h3>
      <div class="info-list">
        <div class="info-row">
          <span class="info-label">时间</span>
          <span class="info-value">${topic.time}</span>
        </div>
        <div class="info-row">
          <span class="info-label">人物</span>
          <span class="info-value">${topic.people}</span>
        </div>
      </div>
    </section>
    <section class="detail-section">
      <h3>统一措施</h3>
      ${numberedListHtml(topic.measures)}
    </section>
    <section class="detail-section">
      <h3>影响</h3>
      ${numberedListHtml(topic.impacts)}
    </section>
    <section class="detail-section">
      <h3>一句话记忆口诀</h3>
      <p class="mnemonic">${topic.mnemonic}</p>
    </section>
  `);
}

function renderBiologyDetail(action, topic) {
  if (!topic) {
    mountDetail(detailEmptyHtml());
    return;
  }

  if (action.key === 'diagram') {
    mountDetail(`
      <h2 class="detail-title">${topic.keywords[0]} · 结构图解</h2>
      ${buildNodeDiagram(topic)}
      <p class="diagram-hint">点击节点查看说明</p>
      ${popupHtml()}
    `);
    bindDiagramEvents(topic);
    return;
  }

  mountDetail(`
    <h2 class="detail-title">${topic.keywords[0]} · ${action.label}</h2>
    ${deepStepsHtml(topic.deepSteps)}
  `);
}

function renderGenericDetail(action) {
  mountDetail(`
    <h2 class="detail-title">${action.label}</h2>
    <p class="detail-text">${action.label}内容将显示在这里</p>
  `);
}

function resolveCurrentEntityId(subjectId, entityId) {
  if (entityId) return entityId;
  const saved = answers[subjectId];
  if (!saved || !saved.result) return '';
  const r = saved.result;
  if (r.type === 'poem' && r.poem) return r.poem.id;
  if (r.type === 'math' && r.problem) return r.problem.id;
  if (r.topic && r.topic.id) return r.topic.id;
  return '';
}

function buildDetailNav() {
  const parts = location.hash.replace(/^#\/?/, '').split('/');
  const [view, subjectId, actionKey, rawEntityId] = parts;
  if (view !== 'detail') return '';

  const bank = getSubjectBank(subjectId);
  const entityId = resolveCurrentEntityId(subjectId, rawEntityId);
  const index = bank.findIndex((item) => item.id === entityId);
  if (index < 0) return '';

  const prev = index > 0 ? bank[index - 1] : null;
  const next = index < bank.length - 1 ? bank[index + 1] : null;
  const link = (item) => `#/detail/${subjectId}/${actionKey}/${item.id}`;

  return `
    <nav class="detail-nav" aria-label="知识点翻页">
      ${
        prev
          ? `<a class="detail-nav-btn" href="${link(prev)}">← ${getBankItemLabel(subjectId, prev)}</a>`
          : '<span class="detail-nav-btn is-disabled">已是第一篇</span>'
      }
      <span class="detail-nav-index">${index + 1} / ${bank.length}</span>
      ${
        next
          ? `<a class="detail-nav-btn" href="${link(next)}">${getBankItemLabel(subjectId, next)} →</a>`
          : '<span class="detail-nav-btn is-disabled">已是最后一篇</span>'
      }
    </nav>
  `;
}

function mountDetail(content) {
  app.innerHTML = detailShell(content);
  const navHtml = buildDetailNav();
  if (navHtml) app.insertAdjacentHTML('beforeend', navHtml);
  document.getElementById('detail-back').addEventListener('click', () => {
    if (hasInternalHistory) {
      history.back();
    } else {
      location.hash = '#/';
    }
  });
  renderMath(app);
  window.scrollTo(0, 0);
  stopTTS();
}

function render() {
  const [view, subjectId, actionKey, entityId] = location.hash
    .replace(/^#\/?/, '')
    .split('/');
  const subject = SUBJECTS.find((s) => s.id === subjectId);

  // 路由切换时关闭可能还开着的抽屉和弹窗
  closeHistoryDrawer();
  closeAddEntryModal();

  if (view === 'knowledge') {
    renderKnowledge();
    return;
  }

  if (view === 'shared' && subjectId) {
    renderSharedDetail(subjectId);
    return;
  }

  if (view === 'subject' && subject) {
    renderSubject(subject);
    return;
  }

  if (view === 'detail' && subject) {
    const action = (SUBJECT_ACTIONS[subject.id] || []).find((a) => a.key === actionKey);
    if (!action) {
      renderHome();
      return;
    }

    if (subject.id === 'chinese') {
      const saved = answers.chinese;
      const savedPoem = saved && saved.result.type === 'poem' ? saved.result.poem : null;
      renderChineseDetail(action, getPoemById(entityId) || savedPoem);
    } else if (subject.id === 'math') {
      const saved = answers.math;
      const savedProblem = saved && saved.result.type === 'math' ? saved.result.problem : null;
      renderMathDetail(action, getMathProblemById(entityId) || savedProblem);
    } else if (subject.id === 'geography') {
      const saved = answers.geography;
      const savedTopic = saved && saved.result.type === 'geo' ? saved.result.topic : null;
      renderGeoDetail(action, getGeoTopicById(entityId) || savedTopic);
    } else if (subject.id === 'physics') {
      const saved = answers.physics;
      const savedTopic = saved && saved.result.type === 'physics' ? saved.result.topic : null;
      renderTopicDetail(action, getPhysicsTopicById(entityId) || savedTopic);
    } else if (subject.id === 'chemistry') {
      const saved = answers.chemistry;
      const savedTopic =
        saved && saved.result.type === 'chemistry' ? saved.result.topic : null;
      renderTopicDetail(action, getChemistryTopicById(entityId) || savedTopic);
    } else if (subject.id === 'biology') {
      const saved = answers.biology;
      const savedTopic = saved && saved.result.type === 'biology' ? saved.result.topic : null;
      renderBiologyDetail(action, getBiologyTopicById(entityId) || savedTopic);
    } else if (subject.id === 'english') {
      const saved = answers.english;
      const savedTopic = saved && saved.result.type === 'english' ? saved.result.topic : null;
      renderEnglishDetail(action, getEnglishTopicById(entityId) || savedTopic);
    } else if (subject.id === 'history') {
      const saved = answers.history;
      const savedTopic = saved && saved.result.type === 'history' ? saved.result.topic : null;
      renderHistoryDetail(action, getHistoryTopicById(entityId) || savedTopic);
    } else {
      renderGenericDetail(action);
    }
    return;
  }

  renderHome();
}

window.addEventListener('hashchange', () => {
  hasInternalHistory = true;
  render();
});

// 联网状态提示
function updateNetBanner() {
  const existing = document.getElementById('net-banner');
  if (typeof navigator === 'undefined' || navigator.onLine) {
    if (existing) existing.remove();
    return;
  }
  if (existing) return;
  const banner = document.createElement('div');
  banner.id = 'net-banner';
  banner.className = 'net-banner';
  banner.textContent = '当前离线 · 使用本地题库和我的知识库';
  document.body.appendChild(banner);
}

window.addEventListener('online', updateNetBanner);
window.addEventListener('offline', updateNetBanner);
updateNetBanner();

// 初始化本地知识库；加载完成后刷新页面以显示已学内容
if (typeof Knowledge !== 'undefined') {
  Knowledge.init().then(() => {
    const view = location.hash.replace(/^#\/?/, '').split('/')[0];
    if (!view || view === 'knowledge') render();
  });
}

render();

/* ---------------- 历史记录抽屉 ---------------- */

function openHistoryDrawer(subject) {
  closeHistoryDrawer();

  historyDrawerEl = document.createElement('div');
  historyDrawerEl.className = 'history-drawer';
  historyDrawerEl.innerHTML = `
    <div class="history-drawer-mask"></div>
    <aside class="history-drawer-panel" role="dialog" aria-modal="true" aria-label="历史记录">
      <header class="history-drawer-head">
        <span>${subject.name} · 历史记录</span>
        <button class="history-drawer-close" type="button" aria-label="关闭">×</button>
      </header>
      <div class="history-drawer-body"></div>
    </aside>
  `;
  document.body.appendChild(historyDrawerEl);

  const body = historyDrawerEl.querySelector('.history-drawer-body');
  const mask = historyDrawerEl.querySelector('.history-drawer-mask');
  const closeBtn = historyDrawerEl.querySelector('.history-drawer-close');

  function buildHistoryRow(item) {
    const row = document.createElement('div');
    row.className = 'history-item' + (item.pinned ? ' is-pinned' : '');
    row.innerHTML = `
      <div class="history-item-main">
        <p class="history-item-q"></p>
        <p class="history-item-preview"></p>
        <span class="history-item-time"></span>
      </div>
      <button class="history-item-pin" type="button"></button>
      <button class="history-item-del" type="button" aria-label="删除">×</button>
    `;
    row.querySelector('.history-item-q').textContent = item.question;
    row.querySelector('.history-item-preview').textContent = historyItemPreview(item.result);
    row.querySelector('.history-item-time').textContent = relativeTime(item.timestamp);

    const pinBtn = row.querySelector('.history-item-pin');
    pinBtn.textContent = item.pinned ? '★' : '☆';
    pinBtn.setAttribute('aria-label', item.pinned ? '取消置顶' : '置顶');
    pinBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleHistoryPin(subject.id, item.question);
      renderList();
    });

    row.addEventListener('click', (e) => {
      if (e.target.classList.contains('history-item-del')) return;
      // 先关闭抽屉并解除遮罩，避免恢复过程出错时整页被锁死
      closeHistoryDrawer();
      try {
        restoreFromHistory(subject.id, item);
      } catch (err) {
        console.error('[history] 恢复记录失败：', err);
        deleteHistoryItem(subject.id, item.question);
        const answerBody = document.getElementById('answer-body');
        if (answerBody) {
          answerBody.classList.remove('muted', 'poem-answer', 'is-dictation');
          answerBody.textContent = '这条历史记录已失效，已自动清除，请重新提问。';
        }
      }
    });

    row.querySelector('.history-item-del').addEventListener('click', (e) => {
      e.stopPropagation();
      deleteHistoryItem(subject.id, item.question);
      renderList();
    });

    return row;
  }

  function renderList() {
    body.innerHTML = '';
    const items = getHistory(subject.id)
      .slice()
      .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    if (!items.length) {
      body.innerHTML = '<p class="history-empty">还没有搜索记录</p>';
      return;
    }

    const pinned = items.filter((item) => item.pinned);
    const rest = items.filter((item) => !item.pinned);
    const listEl = document.createElement('div');
    listEl.className = 'history-list';

    const addGroup = (title, groupItems) => {
      if (!groupItems.length) return;
      const heading = document.createElement('p');
      heading.className = 'history-group-title';
      heading.textContent = title;
      listEl.appendChild(heading);
      groupItems.forEach((item) => listEl.appendChild(buildHistoryRow(item)));
    };

    addGroup('置顶', pinned);
    ['今天', '昨天', '本周', '更早'].forEach((label) => {
      addGroup(
        label,
        rest.filter((item) => historyGroupLabel(item.timestamp) === label)
      );
    });

    body.appendChild(listEl);

    const clearBtn = document.createElement('button');
    clearBtn.className = 'history-clear';
    clearBtn.type = 'button';
    clearBtn.textContent = '清空历史';
    clearBtn.addEventListener('click', () => {
      if (confirm('确定清空该学科的所有搜索历史？')) {
        clearHistory(subject.id);
        renderList();
      }
    });
    body.appendChild(clearBtn);
  }

  try {
    renderList();
  } catch (err) {
    console.error('[history] 渲染历史列表失败：', err);
    body.innerHTML = '<p class="history-empty">历史记录已损坏，请清空后重试</p>';
  }

  mask.addEventListener('click', closeHistoryDrawer);
  closeBtn.addEventListener('click', closeHistoryDrawer);
  document.addEventListener('keydown', onHistoryDrawerKeydown);

  historyDrawerEl.hidden = false;
  requestAnimationFrame(() => historyDrawerEl.classList.add('is-open'));
  document.body.classList.add('history-drawer-open');
}

function onHistoryDrawerKeydown(e) {
  if (e.key === 'Escape') closeHistoryDrawer();
}

function closeHistoryDrawer() {
  if (!historyDrawerEl) return;
  historyDrawerEl.classList.remove('is-open');
  document.body.classList.remove('history-drawer-open');
  document.removeEventListener('keydown', onHistoryDrawerKeydown);
  if (historyCloseTimer) clearTimeout(historyCloseTimer);
  const el = historyDrawerEl;
  historyCloseTimer = window.setTimeout(() => {
    if (el.parentNode) el.parentNode.removeChild(el);
  }, 220);
  historyDrawerEl = null;
}

function restoreFromHistory(subjectId, item) {
  const raw = item.result !== undefined ? item.result : item.answer;
  const result = normalizeStoredResult(subjectId, raw);
  if (!result) throw new Error('历史记录格式已失效');

  answers[subjectId] = { question: item.question, result };
  dictationActive = false;

  const input = document.getElementById('question-input');
  const answerBody = document.getElementById('answer-body');
  const clearBtn = document.getElementById('input-clear');

  if (input) {
    input.value = item.question;
    if (clearBtn) clearBtn.hidden = false;
  }

  if (answerBody) {
    answerBody.classList.remove('muted', 'is-dictation');
    renderAnswer(answerBody, result);
    renderDiagram(result);
    // 重新点亮按钮
    const actionBtns = app.querySelectorAll('.action-btn');
    actionBtns.forEach((btn) => {
      btn.disabled = false;
      if (btn.dataset.key === 'dictation') btn.textContent = '默写';
    });
  }
}

/* ---------------- AI 抽屉 ---------------- */

function buildAgentUrl() {
  return `${AI_CONFIG.chatUrl}?unitId=${encodeURIComponent(AI_CONFIG.unitId)}&robotId=${encodeURIComponent(AI_CONFIG.robotId)}`;
}

function sendToAgent(text) {
  const frame = document.getElementById('ai-frame');
  if (!frame || !frame.contentWindow) {
    console.warn('[AI] 智能体 iframe 尚未就绪');
    return false;
  }
  frame.contentWindow.postMessage({ type: 'CXBOT:send', data: { text } }, '*');
  return true;
}

window.addEventListener('message', (event) => {
  console.log('[AI] 收到智能体消息：', event.data);
});

const aiFab = document.getElementById('ai-fab');
const aiDrawer = document.getElementById('ai-drawer');
const aiMask = document.getElementById('ai-drawer-mask');
const aiFrame = document.getElementById('ai-frame');
const aiClose = document.getElementById('ai-drawer-close');
let aiCloseTimer = null;

function openAiDrawer() {
  // 未配置远程 AI 地址时不打开空抽屉，避免点开一片空白
  if (!AI_CONFIG || !AI_CONFIG.chatUrl) return;
  if (!aiFrame.getAttribute('src')) {
    aiFrame.src = buildAgentUrl();
  }
  if (aiCloseTimer) {
    clearTimeout(aiCloseTimer);
    aiCloseTimer = null;
  }
  aiDrawer.hidden = false;
  requestAnimationFrame(() => aiDrawer.classList.add('is-open'));
  document.body.classList.add('ai-drawer-open');
}

function closeAiDrawer() {
  aiDrawer.classList.remove('is-open');
  document.body.classList.remove('ai-drawer-open');
  aiCloseTimer = window.setTimeout(() => {
    if (!aiDrawer.classList.contains('is-open')) {
      aiDrawer.hidden = true;
    }
  }, 220);
}

aiFab.addEventListener('click', openAiDrawer);
aiClose.addEventListener('click', closeAiDrawer);
aiMask.addEventListener('click', closeAiDrawer);
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !aiDrawer.hidden) {
    closeAiDrawer();
  }
});

// 没有配置远程 AI 地址时隐藏入口，避免出现点了没反应的按钮
if (!AI_CONFIG || !AI_CONFIG.chatUrl) {
  aiFab.hidden = true;
}
