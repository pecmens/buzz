# Buzz 🚀

[![GitHub stars](https://img.shields.io/github/stars/pecmens/buzz.svg)](https://github.com/pecmens/buzz/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/pecmens/buzz.svg)](https://github.com/pecmens/buzz/network)
[![GitHub license](https://img.shields.io/github/license/pecmens/buzz.svg)](https://github.com/pecmens/buzz/blob/main/LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-14.0+-0070f3.svg)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-1.0+-3ECF8E.svg)](https://supabase.io/)
[![Vercel](https://img.shields.io/badge/Vercel-Deploy-000000.svg)](https://vercel.com/)

## 项目介绍

Buzz 是一个现代化、高性能的个人博客系统，采用最新的全栈技术栈构建，实现内容管理、用户互动和自动部署功能。该项目旨在提供一个简洁而强大的平台，让创作者能够专注于内容创作，同时享受流畅的用户体验和便捷的管理功能。

## 核心特性

- 📝 **Markdown 文章编辑** - 支持完整的 Markdown 语法，提供文章预览和草稿保存功能
- 🔐 **安全的用户认证** - 集成 Supabase Auth，支持邮箱/密码和第三方登录
- 💬 **互动评论系统** - 支持嵌套回复、评论审核和通知功能
- 📊 **访问统计分析** - 实时跟踪文章阅读量和用户互动数据
- 🏷️ **分类与标签管理** - 灵活的内容组织方式，支持多标签筛选
- 🌓 **响应式设计** - 完美适配各种屏幕尺寸，提供优质的移动端体验
- 🚀 **自动部署与CI/CD** - 基于 GitHub + Vercel 的无缝部署流程
- 🔍 **全文搜索功能** - 快速查找感兴趣的内容
- 🛡️ **企业级安全保障** - 实现行级安全控制和数据加密存储

## 技术架构

Buzz 采用现代化的技术架构，确保高性能、可扩展性和开发效率：

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   GitHub    │────▶│    Vercel   │────▶│    用户     │
│  代码仓库   │◀────│  部署平台   │◀────│    浏览器   │
└─────────────┘     └──────┬──────┘     └─────────────┘
                           │
                           ▼
                     ┌─────────────┐
                     │  Supabase   │
                     │ 数据库 & Auth│
                     └─────────────┘
```

### 技术栈

- **前端框架**：Next.js 14+ with App Router
- **样式方案**：Tailwind CSS
- **内容存储**：Supabase PostgreSQL 数据库
- **身份验证**：Supabase Auth
- **部署平台**：Vercel
- **代码仓库**：GitHub
- **Markdown 处理**：gray-matter + remark
- **ORM 工具**：Prisma（可选）

## 系统架构

### 数据库设计

Buzz 采用关系型数据库设计，包含以下核心表：

- **users** - 用户信息管理
- **posts** - 文章内容存储
- **categories** - 文章分类
- **tags** - 文章标签
- **post_tags** - 文章与标签的关联关系
- **comments** - 用户评论数据

所有表均实现了完整的关系映射和行级安全控制，确保数据的完整性和安全性。

### 页面结构

#### 前台页面
- `/` - 博客首页，展示最新文章列表
- `/posts/:slug` - 文章详情页
- `/categories/:slug` - 分类文章列表
- `/tags/:slug` - 标签文章列表
- `/about` - 关于页面
- `/contact` - 联系页面
- `/search` - 搜索结果页面

#### 后台管理
- `/admin` - 管理仪表盘
- `/admin/posts` - 文章管理
- `/admin/categories` - 分类管理
- `/admin/tags` - 标签管理
- `/admin/comments` - 评论管理
- `/admin/profile` - 用户设置

## 开始使用

### 前提条件

- Node.js 18+
- npm 或 yarn
- Supabase 账户
- Vercel 账户
- GitHub 账户

### 本地开发

1. **克隆仓库**

```bash
git clone https://github.com/pecmens/buzz.git
cd buzz
```

2. **安装依赖**

```bash
npm install
# 或
yarn install
```

3. **配置环境变量**

复制 `.env.example` 文件为 `.env.local` 并填入相应的环境变量：

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

4. **启动开发服务器**

```bash
npm run dev
# 或
yarn dev
```

5. **访问应用**

打开浏览器访问 `http://localhost:3000`

### 部署到 Vercel

1. 将代码推送到 GitHub 仓库
2. 在 Vercel 中导入该仓库
3. 配置环境变量（与本地开发相同）
4. 点击部署按钮

## 性能优化

Buzz 采用多项性能优化策略，确保网站快速加载和平滑运行：

- **静态生成（SSG）和增量静态再生（ISR）** - 预渲染页面，提升加载速度
- **图片优化和懒加载** - 减少初始加载时间
- **代码分割** - 按需加载 JavaScript，减小打包体积
- **数据库索引优化** - 提升查询性能
- **CDN 集成** - 全球内容分发，降低延迟

## 安全措施

- **Row Level Security (RLS)** - 精细化的数据访问控制
- **XSS 防护** - 自动转义和内容安全策略
- **CSRF 保护** - 防止跨站请求伪造
- **输入验证** - 严格的数据校验和清洗
- **API 限流** - 防止恶意请求和资源滥用
- **敏感数据加密** - 保护用户隐私信息

## 未来规划

Buzz 项目计划在未来迭代中实现以下功能：

- 🌙 暗黑模式支持
- 📤 文章导出功能（PDF、Markdown）
- 📧 订阅通知系统
- 🌐 多语言支持
- 📑 文章系列功能
- 🎨 自定义主题系统
- 📊 增强的分析仪表盘
- 📱 专用移动应用

## 开发记录

项目使用 `REC.md` 文件记录开发过程中的重要决策、技术选型理由和实现细节，确保开发过程的透明度和可追溯性。

## 许可证

本项目采用 MIT 许可证 - 详情请查看 [LICENSE](LICENSE) 文件

## 鸣谢

感谢以下技术社区和工具提供的支持：

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.io/)
- [Vercel](https://vercel.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React](https://reactjs.org/)

---

**Buzz** - 为创作者打造的现代化博客平台 🌟
Kassen Buzz Project
