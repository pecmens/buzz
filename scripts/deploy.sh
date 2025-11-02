#!/bin/bash

# 🚀 Buzz Blog 部署脚本
# 自动化部署到 Vercel 的完整流程

set -e  # 遇到错误时退出

echo "🚀 开始部署 Buzz Blog..."
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 1. 检查 Node.js 版本
echo -e "${BLUE}📋 检查环境...${NC}"
node_version=$(node -v)
echo "Node.js 版本: $node_version"

if [[ ! "$node_version" =~ ^v1[8-9]\. ]] && [[ ! "$node_version" =~ ^v2[0-9]\. ]]; then
    echo -e "${RED}❌ 需要 Node.js 18+ 版本${NC}"
    exit 1
fi

# 2. 运行修复脚本
echo ""
echo -e "${BLUE}🔧 运行部署修复脚本...${NC}"
npm run fix-deployment

# 3. 安装依赖
echo ""
echo -e "${BLUE}📦 安装依赖...${NC}"
npm install

# 4. 代码质量检查
echo ""
echo -e "${BLUE}🔍 代码质量检查...${NC}"

# ESLint 检查
echo "运行 ESLint..."
if npm run lint; then
    echo -e "${GREEN}✅ ESLint 检查通过${NC}"
else
    echo -e "${YELLOW}⚠️  ESLint 发现问题，但继续部署${NC}"
fi

# TypeScript 检查
echo "检查 TypeScript..."
if npx tsc --noEmit; then
    echo -e "${GREEN}✅ TypeScript 检查通过${NC}"
else
    echo -e "${RED}❌ TypeScript 检查失败${NC}"
    exit 1
fi

# 5. 构建测试
echo ""
echo -e "${BLUE}🏗️  构建测试...${NC}"
if npm run build; then
    echo -e "${GREEN}✅ 构建成功${NC}"
else
    echo -e "${RED}❌ 构建失败${NC}"
    exit 1
fi

# 6. 检查环境变量示例
echo ""
echo -e "${BLUE}🔐 检查环境变量配置...${NC}"
if [ -f ".env.example" ]; then
    echo -e "${GREEN}✅ .env.example 存在${NC}"
    echo "请确保在 Vercel 中配置以下环境变量："
    echo ""
    cat .env.example
    echo ""
else
    echo -e "${RED}❌ .env.example 不存在${NC}"
    exit 1
fi

# 7. Git 检查和提交
echo ""
echo -e "${BLUE}📝 Git 操作...${NC}"

# 检查是否有未提交的更改
if [ -n "$(git status --porcelain)" ]; then
    echo "发现未提交的更改，正在提交..."
    git add .
    git commit -m "fix: resolve deployment issues and optimize configuration"
    echo -e "${GREEN}✅ 代码已提交${NC}"
else
    echo -e "${GREEN}✅ 没有未提交的更改${NC}"
fi

# 推送到远程仓库
echo "推送到远程仓库..."
if git push origin main; then
    echo -e "${GREEN}✅ 代码已推送${NC}"
else
    echo -e "${RED}❌ 推送失败${NC}"
    exit 1
fi

# 8. 部署提示
echo ""
echo -e "${GREEN}🎉 准备工作完成！${NC}"
echo ""
echo -e "${BLUE}📋 下一步操作：${NC}"
echo "1. 登录 Vercel Dashboard: https://vercel.com/dashboard"
echo "2. 导入你的 GitHub 仓库"
echo "3. 配置环境变量（参考上面显示的 .env.example）"
echo "4. 点击部署"
echo ""
echo -e "${BLUE}🔗 有用链接：${NC}"
echo "- Vercel 文档: https://vercel.com/docs"
echo "- Supabase 文档: https://supabase.com/docs"
echo "- 项目 README: ./README.md"
echo "- 部署指南: ./DEPLOYMENT.md"
echo ""
echo -e "${GREEN}祝你部署成功！🚀${NC}"