#!/bin/bash

echo "🚀 Vercel 构建状态快速检查"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 检查是否已登录
if ! vercel whoami &> /dev/null; then
    echo "❌ 你还没有登录 Vercel"
    echo ""
    echo "请运行以下命令登录："
    echo "  vercel login"
    echo ""
    echo "登录后，再次运行此脚本即可。"
    exit 1
fi

echo "✅ 已登录账户: $(vercel whoami)"
echo ""

echo "📊 最新部署状态："
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
vercel list inspirationsun --limit 3

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "💡 查看详细构建日志："
echo "  vercel logs [deployment-url]"
echo ""
