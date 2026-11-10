#!/bin/bash
# 看门狗：检测 Node 服务 3000 是否存活，挂了自动拉起来
PORT=3000
DIR=/workspace
cd "$DIR"

while true; do
  if ! curl -s -o /dev/null --max-time 3 "http://localhost:${PORT}/api/health"; then
    echo "[$(date '+%H:%M:%S')] 健康检查失败，重启 node server.js ..."
    fuser -k ${PORT}/tcp 2>/dev/null
    sleep 1
    setsid node server.js >> /tmp/zhixue-server.log 2>&1 < /dev/null &
  fi
  sleep 10
done
