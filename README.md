# 智学探索

全学科学习工具：本地题库 + 联网搜索 + 多人共享知识库 + 拍照识别录入。
纯 HTML / CSS / JavaScript 前端，Node.js 原生后端（无第三方依赖）。

## 启动

```bash
cd /workspace
node server.js
```

访问 http://localhost:3000 或 http://localhost:8000 均可（Node 同时监听两个端口）。

- 前端页面、共享知识 API、Service Worker 由同一个 Node 服务提供。
- 共享内容保存在 `data/knowledge.json`，重启不丢失。
- 单独用 `file://` 打开 index.html 时，共享功能需要本机已运行 `node server.js`。

## 安装成桌面应用

安装后桌面 / 手机会出现「智学探索」图标，打开时没有浏览器地址栏，和普通软件一样，也能离线使用。

- Windows / macOS：Chrome、Edge 打开站点，点首页的「安装到桌面」，或点地址栏右侧的安装图标。
- Android：Chrome 菜单 →「添加到主屏幕」。
- iPhone / iPad：Safari 分享按钮 →「添加到主屏幕」。

安装需要 http(s) 访问（localhost 也可以），并先运行 `node server.js`。

## 项目结构

```
/workspace
├── index.html          # 页面入口
├── server.js           # 静态站点 + 共享知识库 API
├── data/               # 共享知识数据（自动创建）
├── manifest.json       # PWA 清单
├── sw.js               # Service Worker：离线缓存
├── icons/              # 应用图标
├── css/style.css       # 全站样式
└── js/
    ├── config.js       # AI / 共享服务配置
    ├── store.js        # IndexedDB 存储层
    ├── knowledge.js    # 本机知识库：学习、去重、检索、导入导出
    ├── api.js          # 共享知识库客户端
    ├── ai.js           # 本地题库 + 联网搜索 + 兜底回答
    └── app.js          # 路由、页面渲染、拍照识别、交互
```

## 功能

- 8 个学科，70+ 内置知识点；输入联想、搜索历史（按学科独立）、朗读、默写。
- 提问流程：内置题库 → 本机知识库 → 共享知识库 → 联网搜索（百度百科 / 维基 / DuckDuckGo）→ 学科方法论兜底。
- 联网搜到的合格内容自动存入本机知识库，断网可继续查。
- 「知识库」页分两个标签：
  - **本机知识**：置顶、搜索、导出 / 导入 JSON。
  - **共享知识**：所有人可见；支持手动输入、拍照识别（本地 OCR + 模糊检测）后发布。
- 共享内容只有发布者本人（凭本机保存的口令）可以删除。
- PWA：安装到桌面 / 手机主屏后像个独立软件，可离线打开，已学内容离线可用。

## 共享知识库 API

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/api/knowledge?subject=&q=` | 列出共享内容 |
| POST | `/api/knowledge` | 新增（返回 `ownerToken`） |
| DELETE | `/api/knowledge/:id` | 删除，请求头需 `X-Owner-Token` |
| GET | `/api/health` | 健康检查与条数 |

- 写入字段：`subject`、`title`、`content`、`author`（选填）、`source`、`quiz`（选填）。
- `quiz` 为练习题数组，最多 8 道，每道 `{ type: 'fill' | 'short', q: '题干', a: '参考答案' }`。
- 限制：标题 ≤ 60 字，内容 ≤ 5000 字；每 IP 每分钟最多 60 次写入。
- 数据文件：`data/knowledge.json`，备份直接复制该文件。

## 部署到公网（比赛用）

1. 服务器安装 Node.js（建议 18+）。
2. 上传整个目录，执行 `node server.js`。
3. 用 Nginx 或云平台反向代理到 3000 端口，并开启 HTTPS（拍照 / PWA 需要安全上下文）。
4. 前后端同域时无需改配置；若 API 使用独立域名，在 `js/config.js` 中填写：

```js
const SHARE_CONFIG = { apiBase: 'https://api.example.com' };
```

建议用 `pm2` 或 systemd 守护进程，避免服务器重启后服务退出。

## 配置说明

`js/config.js`：

- `SHARE_CONFIG.apiBase`：共享后端地址，留空为自动判断。
- `AI_CONFIG`：预留的远程 AI 接口配置，默认关闭，不影响本地与共享功能。

## 隐私说明

- 本机知识、搜索历史、Web 搜索摘要均存放在用户浏览器本地。
- 共享内容由用户主动发布，内容与署名会存到服务器。
- 拍照识别默认在浏览器本地完成，图片不会上传；只有识别后的文字在发布时提交。
- 后端不记录个人身份信息，删除口令只保存在发布者浏览器中。
