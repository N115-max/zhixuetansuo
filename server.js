/**
 * 智学探索后端：静态站点 + 共享知识库 API
 * 启动：node server.js   （默认端口 3000，可用 PORT 环境变量修改）
 * 数据：data/knowledge.json
 */
const http = require('http');
const fs = require('fs');
const fsp = fs.promises;
const path = require('path');
const crypto = require('crypto');

const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, 'data');
const DATA_FILE = path.join(DATA_DIR, 'knowledge.json');
const PORT = Number(process.env.PORT || 3000);

const SUBJECT_IDS = new Set([
  'chinese', 'math', 'english', 'physics',
  'chemistry', 'biology', 'geography', 'history'
]);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf'
};

let items = [];
let writeChain = Promise.resolve();

async function loadData() {
  try {
    const raw = await fsp.readFile(DATA_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    items = Array.isArray(parsed.items) ? parsed.items : [];
  } catch (err) {
    if (err.code !== 'ENOENT') console.error('[data] 读取失败：', err.message);
    items = [];
  }
  console.log(`[data] 已加载共享知识 ${items.length} 条`);
}

function persist() {
  writeChain = writeChain
    .then(async () => {
      await fsp.mkdir(DATA_DIR, { recursive: true });
      const tmp = `${DATA_FILE}.tmp`;
      await fsp.writeFile(tmp, JSON.stringify({ version: 1, items }, null, 2), 'utf8');
      await fsp.rename(tmp, DATA_FILE);
    })
    .catch((err) => console.error('[data] 写入失败：', err.message));
  return writeChain;
}

function sendJSON(res, status, data) {
  const body = JSON.stringify(data);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    'Cache-Control': 'no-store'
  });
  res.end(body);
}

function publicItem(item) {
  return {
    id: item.id,
    subject: item.subject,
    title: item.title,
    content: item.content,
    author: item.author || '',
    source: item.source || '手动录入',
    quiz: Array.isArray(item.quiz) ? item.quiz : [],
    createdAt: item.createdAt,
    updatedAt: item.updatedAt
  };
}

function readBody(req, limit = 1_000_000) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > limit) {
        reject(new Error('body too large'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

function cleanText(value, max) {
  return String(value == null ? '' : value).replace(/\r\n/g, '\n').trim().slice(0, max);
}

// 练习题：最多 8 道，题型只允许 填空 / 简答
function cleanQuiz(value) {
  if (!Array.isArray(value)) return [];
  return value
    .slice(0, 8)
    .map((row) => {
      if (!row || typeof row !== 'object') return null;
      const type = row.type === 'short' ? 'short' : 'fill';
      const q = cleanText(row.q, 200);
      const a = cleanText(row.a, 500);
      if (!q || !a) return null;
      return { type, q, a };
    })
    .filter(Boolean);
}

// 简单的写入频率限制：每 IP 每分钟最多 60 次
const rateMap = new Map();
function allowWrite(ip) {
  const now = Date.now();
  const record = rateMap.get(ip) || { start: now, count: 0 };
  if (now - record.start > 60_000) {
    record.start = now;
    record.count = 0;
  }
  record.count += 1;
  rateMap.set(ip, record);
  return record.count <= 60;
}

async function handleApi(req, res, url) {
  const { pathname, searchParams } = url;

  if (pathname === '/api/health' && req.method === 'GET') {
    sendJSON(res, 200, { ok: true, count: items.length });
    return true;
  }

  if (pathname === '/api/knowledge' && req.method === 'GET') {
    const subject = searchParams.get('subject') || '';
    const q = (searchParams.get('q') || '').trim().toLowerCase();
    let list = items.slice();
    if (subject && SUBJECT_IDS.has(subject)) {
      list = list.filter((item) => item.subject === subject);
    }
    if (q) {
      list = list.filter((item) =>
        `${item.title} ${item.content} ${item.author}`.toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => b.createdAt - a.createdAt);
    const limit = Math.min(Number(searchParams.get('limit')) || 300, 500);
    sendJSON(res, 200, { ok: true, total: items.length, items: list.slice(0, limit).map(publicItem) });
    return true;
  }

  if (pathname === '/api/knowledge' && req.method === 'POST') {
    const ip = req.socket.remoteAddress || 'unknown';
    if (!allowWrite(ip)) {
      sendJSON(res, 429, { ok: false, error: '操作太频繁，请稍后再试' });
      return true;
    }

    let payload;
    try {
      payload = JSON.parse(await readBody(req));
    } catch {
      sendJSON(res, 400, { ok: false, error: '请求内容不是合法 JSON' });
      return true;
    }

    const subject = cleanText(payload.subject, 20);
    const title = cleanText(payload.title, 60);
    const content = cleanText(payload.content, 5000);
    const author = cleanText(payload.author, 20);
    const source = cleanText(payload.source, 20) || '手动录入';
    const quiz = cleanQuiz(payload.quiz);

    if (!SUBJECT_IDS.has(subject)) {
      sendJSON(res, 400, { ok: false, error: '学科无效' });
      return true;
    }
    if (title.length < 1) {
      sendJSON(res, 400, { ok: false, error: '标题不能为空' });
      return true;
    }
    if (content.length < 5) {
      sendJSON(res, 400, { ok: false, error: '内容太短，至少 5 个字' });
      return true;
    }

    const now = Date.now();
    const item = {
      id: `k_${now.toString(36)}_${crypto.randomBytes(4).toString('hex')}`,
      subject,
      title,
      content,
      author,
      source,
      quiz,
      ownerToken: crypto.randomBytes(16).toString('hex'),
      createdAt: now,
      updatedAt: now
    };
    items.push(item);
    await persist();
    sendJSON(res, 201, { ok: true, item: publicItem(item), ownerToken: item.ownerToken });
    return true;
  }

  const deleteMatch = pathname.match(/^\/api\/knowledge\/([A-Za-z0-9_]+)$/);
  if (deleteMatch && req.method === 'DELETE') {
    const id = deleteMatch[1];
    const token = String(req.headers['x-owner-token'] || '');
    const index = items.findIndex((item) => item.id === id);

    if (index === -1) {
      sendJSON(res, 404, { ok: false, error: '内容不存在或已被删除' });
      return true;
    }
    if (!token || token !== items[index].ownerToken) {
      sendJSON(res, 403, { ok: false, error: '只有添加者本人可以删除' });
      return true;
    }

    items.splice(index, 1);
    await persist();
    sendJSON(res, 200, { ok: true });
    return true;
  }

  if (pathname.startsWith('/api/')) {
    sendJSON(res, 404, { ok: false, error: '接口不存在' });
    return true;
  }

  return false;
}

function serveStatic(req, res, url) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Method Not Allowed');
    return;
  }

  let pathname;
  try {
    pathname = decodeURIComponent(url.pathname);
  } catch {
    pathname = '/';
  }
  if (pathname === '/') pathname = '/index.html';

  const filePath = path.resolve(ROOT, `.${pathname}`);
  if (!filePath.startsWith(ROOT + path.sep) || filePath.includes(`${path.sep}data${path.sep}`)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const type = MIME[ext] || 'application/octet-stream';
    res.writeHead(200, {
      'Content-Type': type,
      'Content-Length': stat.size,
      'Cache-Control': ext === '.html' || ext === '.js' || ext === '.css' ? 'no-cache' : 'public, max-age=86400'
    });
    if (req.method === 'HEAD') {
      res.end();
      return;
    }
    fs.createReadStream(filePath).pipe(res);
  });
}

async function handleRequest(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Owner-Token');
  res.setHeader('Access-Control-Max-Age', '86400');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  let url;
  try {
    url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  } catch {
    sendJSON(res, 400, { ok: false, error: '请求地址无效' });
    return;
  }

  try {
    const handled = await handleApi(req, res, url);
    if (!handled) serveStatic(req, res, url);
  } catch (err) {
    console.error('[server] 未处理异常：', err);
    if (!res.headersSent) sendJSON(res, 500, { ok: false, error: '服务器内部错误' });
    else res.end();
  }
}

const EXTRA_PORTS = (process.env.EXTRA_PORTS == null ? '8000' : process.env.EXTRA_PORTS)
  .split(',')
  .map((value) => Number(value))
  .filter((value) => value > 0 && value !== PORT);

loadData().then(() => {
  [PORT, ...EXTRA_PORTS].forEach((port) => {
    http
      .createServer(handleRequest)
      .listen(port, () => {
        console.log(`智学探索已启动：http://localhost:${port}`);
      })
      .on('error', (err) => {
        console.error(`[server] 端口 ${port} 启动失败：`, err.message);
      });
  });
});
