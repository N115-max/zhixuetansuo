const AI_CONFIG = {
  enabled: false,
  unitId: '',
  robotId: '',
  chatUrl: ''
};

// 共享知识库后端地址。
// 留空表示自动判断：同源部署直接用当前域名；本地 file:// 或 8000 端口预览时连 localhost:3000。
// 部署到公网且前后端不同域名时，填写完整地址，例如 https://api.example.com
const SHARE_CONFIG = {
  apiBase: ''
};
