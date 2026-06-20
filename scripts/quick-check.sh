#!/bin/bash

# Vercel 构建状态检查工具（无需 Token）
# 使用方法：./scripts/quick-check.sh

echo "🔍 正在检查 Vercel 构建状态..."
echo ""
echo "📋 你需要执行以下步骤："
echo ""
echo "1️⃣ 首先登录 Vercel（如果还没登录）："
echo "   vercel login"
echo ""
echo "2️⃣ 然后查看项目列表："
echo "   vercel list"
echo ""
echo "3️⃣ 查看最新部署的详细信息："
echo "   vercel inspect inspirationsun"
echo ""
echo "4️⃣ 查看构建日志（如果有错误）："
echo "   vercel logs [deployment-url]"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "💡 快速检查命令："
echo "   vercel list inspirationsun"
echo ""
echo "这将显示最新的部署状态（BUILDING/READY/ERROR）"
echo ""
