#!/bin/bash
# 江湖挂机录 - 桌面宠物启动脚本
# 使用方法: ./start.sh

DIR="$(cd "$(dirname "$0")" && pwd)"
ELECTRON="$DIR/electron-bin/Electron.app/Contents/MacOS/Electron"

if [ ! -f "$ELECTRON" ]; then
    echo "❌ Electron 未找到，请先运行: npm install"
    exit 1
fi

echo "🎮 启动 江湖挂机录 - 桌面宠物..."
"$ELECTRON" "$DIR" --enable-transparent-visuals &
echo "✅ 已启动！按 Ctrl+Shift+J 显示/隐藏宠物"
