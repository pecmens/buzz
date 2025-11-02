# Buzz 博客系统 - 详细项目文档

## 1. 项目概览

### 1.1 项目名称
Buzz - 现代化个人博客系统

### 1.2 项目简介
Buzz 是一个现代化、高性能的个人博客系统，采用最新的全栈技术栈构建。该系统实现了内容管理、用户互动和自动部署功能，为创作者提供一个简洁而强大的平台，让他们能够专注于内容创作，同时享受流畅的用户体验和便捷的管理功能。

### 1.3 项目状态
- **当前状态**：开发进行中
- **已完成功能**：
  - Next.js 前端项目初始化
  - 基础布局与首页实现
  - Supabase 客户端配置
  - 数据库表结构设计与实现
  - 用户认证功能（登录、注册、密码重置、第三方登录）
- **开发中功能**：
  - 文章详情页开发
  - Vercel 自动部署设置
  - 文章管理后台基础功能
  - 评论系统基础功能

### 1.4 项目特点
- 📝 **Markdown 文章编辑** - 支持完整的 Markdown 语法，提供文章预览和草稿保存功能
- 🔐 **安全的用户认证** - 集成 Supabase Auth，支持邮箱/密码和第三方登录
- 💬 **互动评论系统** - 支持嵌套回复、评论审核和通知功能
- 📊 **访问统计分析** - 实时跟踪文章阅读量和用户互动数据
- 🏷️ **分类与标签管理** - 灵活的内容组织方式，支持多标签筛选
- 🌓 **响应式设计** - 完美适配各种屏幕尺寸，提供优质的移动端体验
- 🚀 **自动部署与CI/CD** - 基于 GitHub + Vercel 的无缝部署流程
- 🔍 **全文搜索功能** - 快速查找感兴趣的内容
- 🛡️ **企业级安全保障** - 实现行级安全控制和数据加密存储

## 2. 技术架构

### 2.1 整体架构
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

### 2.2 技术栈
- **前端框架**：Next.js 14+ with App Router
- **样式方案**：Tailwind CSS
- **内容存储**：Supabase PostgreSQL 数据库
- **身份验证**：Supabase Auth
- **部署平台**：Vercel
- **代码仓库**：GitHub
- **Markdown 处理**：gray-matter + remark
- **ORM 工具**：Prisma（可选）
- **开发语言**：TypeScript

### 2.3 依赖包
```json
{
  "dependencies": {
    "@supabase/auth-helpers-nextjs": "^0.9.0",
    "@supabase/supabase-js": "^2.39.0",
    "next": "14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/node": "^20.9.0",
    "@types/react": "^18.2.37",
    "@types/react-dom": "^18.2.15",
    "@typescript-eslint/eslint-plugin": "^6.10.0",
    "@typescript-eslint/parser": "^6.10.0",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.53.0",
    "eslint-config-next": "14.0.0",
    "postcss": "^8.4.31",
    "tailwindcss": "^3.3.5",
    "typescript": "^5.2.2"
  }
}
```

## 3. 项目结构

### 3.1 项目根目录
```
/home/pecmen/git/github/pecmens/buzz/
├───.env.example
├───.eslintrc.json
├───.gitignore
├───order.md
├───package.json
├───postcss.config.js
├───project.md
├───QWEN.md
├───README.md
├───REC.md
├───supabase-init.sql
├───tailwind.config.ts
├───todo.md
├───tsconfig.json
├───.git/...
├───app/
│   ├───globals.css
│   ├───layout.tsx
│   ├───page.tsx
│   └───auth/
│       ├───forgot-password/
│       ├───login/
│       └───register/
├───lib/
│   ├───auth.ts
│   └───supabase.ts
└───temp/
```

### 3.2 详细目录说明

#### 3.2.1 根目录文件
- **.env.example** - 环境变量配置示例文件
- **.eslintrc.json** - ESLint 配置文件
- **.gitignore** - Git 忽略文件配置
- **order.md** - 项目进度与 Git 版本管理文件
- **package.json** - 项目依赖和脚本配置
- **postcss.config.js** - PostCSS 配置文件
- **project.md** - 项目前期规划文档
- **QWEN.md** - Qwen Code 上下文文档
- **README.md** - 项目说明文档
- **REC.md** - 项目开发记录文档
- **supabase-init.sql** - Supabase 数据库初始化脚本
- **tailwind.config.ts** - Tailwind CSS 配置文件
- **todo.md** - 任务列表文档
- **tsconfig.json** - TypeScript 配置文件

#### 3.2.2 app/ 目录
- **app/globals.css** - 全局样式文件
- **app/layout.tsx** - 应用布局组件
- **app/page.tsx** - 首页组件
- **app/auth/** - 认证模块目录
  - **app/auth/forgot-password/** - 密码重置页面相关组件
  - **app/auth/login/** - 登录页面相关组件
  - **app/auth/register/** - 注册页面相关组件

#### 3.2.3 lib/ 目录
- **lib/auth.ts** - 认证相关函数和类型定义
- **lib/supabase.ts** - Supabase 客户端配置和数据访问函数

#### 3.2.4 temp/ 目录
- 临时文件存放目录

## 4. 数据库设计

### 4.1 数据库初始化脚本 (supabase-init.sql)

```sql
-- Supabase数据库初始化脚本
-- 按照依赖关系顺序创建表

-- 1. 创建users表
CREATE TABLE users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(50) UNIQUE,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);

-- 2. 创建categories表
CREATE TABLE categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. 创建tags表
CREATE TABLE tags (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. 创建posts表（依赖于users和categories）
CREATE TABLE posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  cover_image_url TEXT,
  author_id UUID REFERENCES users(id),
  category_id UUID REFERENCES categories(id),
  status VARCHAR(20) DEFAULT 'draft',
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  published_at TIMESTAMP
);

-- 5. 创建comments表（依赖于posts和users）
CREATE TABLE comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  content TEXT NOT NULL,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  author_id UUID REFERENCES users(id),
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. 创建post_tags表（依赖于posts和tags）
CREATE TABLE post_tags (
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- 创建索引以提高查询性能
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_author_id ON posts(author_id);
CREATE INDEX idx_posts_category_id ON posts(category_id);
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_status ON comments(status);
CREATE INDEX idx_comments_created_at ON comments(created_at);

-- 添加一些基础数据
-- 插入默认分类
INSERT INTO categories (name, slug, description) VALUES 
('未分类', 'uncategorized', '默认分类'),
('前端开发', 'frontend', '前端开发相关文章'),
('后端开发', 'backend', '后端开发相关文章'),
('DevOps', 'devops', '开发运维相关文章');

-- 插入默认标签
INSERT INTO tags (name, slug) VALUES 
('JavaScript', 'javascript'),
('React', 'react'),
('Next.js', 'nextjs'),
('TypeScript', 'typescript'),
('Tailwind CSS', 'tailwindcss'),
('Supabase', 'supabase');
```

### 4.2 数据库表关系
- **users** 表 - 用户信息管理
- **categories** 表 - 文章分类管理
- **tags** 表 - 文章标签管理
- **posts** 表 - 文章内容存储（关联 users 和 categories）
- **comments** 表 - 用户评论数据（关联 posts 和 users）
- **post_tags** 表 - 文章与标签的关联关系（关联 posts 和 tags）

### 4.3 表结构详细说明

#### 4.3.1 users 表
| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | 用户唯一标识 |
| email | VARCHAR(255) | UNIQUE, NOT NULL | 用户邮箱 |
| username | VARCHAR(50) | UNIQUE | 用户名 |
| avatar_url | TEXT | | 头像链接 |
| bio | TEXT | | 个人简介 |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 更新时间 |
| last_login | TIMESTAMP | | 最后登录时间 |

#### 4.3.2 posts 表
| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | 文章唯一标识 |
| title | VARCHAR(255) | NOT NULL | 文章标题 |
| slug | VARCHAR(255) | UNIQUE, NOT NULL | 文章URL标识 |
| content | TEXT | NOT NULL | 文章内容 |
| excerpt | TEXT | | 文章摘要 |
| cover_image_url | TEXT | | 封面图片链接 |
| author_id | UUID | REFERENCES users(id) | 作者ID |
| category_id | UUID | REFERENCES categories(id) | 分类ID |
| status | VARCHAR(20) | DEFAULT 'draft' | 文章状态（draft, published） |
| view_count | INTEGER | DEFAULT 0 | 阅读次数 |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 更新时间 |
| published_at | TIMESTAMP | | 发布时间 |

#### 4.3.3 categories 表
| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | 分类唯一标识 |
| name | VARCHAR(100) | NOT NULL | 分类名称 |
| slug | VARCHAR(100) | UNIQUE, NOT NULL | 分类URL标识 |
| description | TEXT | | 分类描述 |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 创建时间 |

#### 4.3.4 tags 表
| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | 标签唯一标识 |
| name | VARCHAR(50) | NOT NULL | 标签名称 |
| slug | VARCHAR(50) | UNIQUE, NOT NULL | 标签URL标识 |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 创建时间 |

#### 4.3.5 comments 表
| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | 评论唯一标识 |
| content | TEXT | NOT NULL | 评论内容 |
| post_id | UUID | REFERENCES posts(id) ON DELETE CASCADE | 文章ID |
| author_id | UUID | REFERENCES users(id) | 作者ID |
| parent_id | UUID | REFERENCES comments(id) ON DELETE CASCADE | 父评论ID（用于嵌套评论） |
| status | VARCHAR(20) | DEFAULT 'pending' | 评论状态（pending, approved, spam） |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 更新时间 |

#### 4.3.6 post_tags 表
| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| post_id | UUID | REFERENCES posts(id) ON DELETE CASCADE | 文章ID |
| tag_id | UUID | REFERENCES tags(id) ON DELETE CASCADE | 标签ID |
| - | - | PRIMARY KEY (post_id, tag_id) | 复合主键 |

## 5. 前端架构

### 5.1 应用布局 (app/layout.tsx)

应用使用根布局组件，包含以下结构：
- HTML 头部（包含元数据和字体）
- 导航头部（包含 Logo、导航菜单和登录注册按钮）
- 主内容区域（children）
- 页脚

```tsx
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '个人博客',
  description: '技术分享与个人思考的博客',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        {/* 导航头部组件 */}
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            {/* Logo 和标题 */}
            <div className="flex items-center space-x-2">
              <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              <span className="text-xl font-bold text-dark">Buzz Blog</span>
            </div>
            
            {/* 导航菜单 */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="/" className="nav-link active">首页</a>
              <a href="/about" className="nav-link">关于</a>
              <a href="/categories" className="nav-link">分类</a>
              <a href="/tags" className="nav-link">标签</a>
              <a href="/contact" className="nav-link">联系</a>
              
              {/* 登录/注册按钮 */}
              <div className="ml-4 flex items-center space-x-3">
                <a href="/auth/login" className="text-sm font-medium text-gray-700 hover:text-blue-600">登录</a>
                <a href="/auth/register" className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                  注册
                </a>
              </div>
            </nav>
            
            {/* 移动端菜单按钮 */}
            <div className="md:hidden">
              <button className="p-2">
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              </button>
            </div>
          </div>
        </header>
        
        {/* 主内容区域 */}
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
        
        {/* 页脚 */}
        <footer className="bg-dark text-white py-8 mt-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <p className="text-gray-400">© 2025 Buzz Blog. 保留所有权利。</p>
              </div>
              <div className="flex space-x-4">
                {/* 社交媒体链接 */}
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.105 4.105 0 003.292 4.022 4.095 4.095 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.123-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
```

### 5.2 首页组件 (app/page.tsx)

首页组件实现博客的主页功能，包含以下部分：

```tsx
import Link from 'next/link';

export default function HomePage() {
  // 模拟文章数据，后续将从Supabase获取
  const posts = [
    {
      id: '1',
      title: 'Next.js 14 新特性详解',
      excerpt: '探索Next.js 14带来的服务器组件、增量静态再生等新功能，提升你的React应用性能。',
      author: '作者名称',
      publishDate: '2025-10-30',
      readTime: '8 分钟',
      category: '前端开发',
      imageUrl: 'https://picsum.photos/id/1/800/450',
    },
    {
      id: '2',
      title: 'Tailwind CSS 最佳实践',
      excerpt: '学习如何在项目中高效使用Tailwind CSS，包括自定义配置、性能优化和组件封装。',
      author: '作者名称',
      publishDate: '2025-10-28',
      readTime: '6 分钟',
      category: 'CSS',
      imageUrl: 'https://picsum.photos/id/20/800/450',
    },
    {
      id: '3',
      title: 'Supabase 入门指南',
      excerpt: '从零开始学习Supabase，包括数据库设计、认证系统和实时功能的实现。',
      author: '作者名称',
      publishDate: '2025-10-25',
      readTime: '10 分钟',
      category: '后端开发',
      imageUrl: 'https://picsum.photos/id/30/800/450',
    },
  ];

  return (
    <div className="space-y-12">
      {/* 英雄区域 */}
      <section className="relative rounded-xl overflow-hidden h-80 bg-gradient-to-r from-primary to-secondary">
        <div className="absolute inset-0 bg-black/40" />
        <div className="container mx-auto px-4 h-full flex flex-col justify-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">欢迎来到我的个人博客</h1>
          <p className="text-xl text-white/90 max-w-2xl">分享技术见解、开发经验和个人成长的地方</p>
        </div>
      </section>

      {/* 文章列表 */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-dark">最新文章</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article key={post.id} className="card">
              <div className="relative h-48 mb-4 overflow-hidden rounded-md">
                <img 
                  src={post.imageUrl} 
                  alt={post.title} 
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
                <div className="absolute top-3 left-3">
                  <span className="bg-primary/90 text-white text-xs px-2 py-1 rounded-full">
                    {post.category}
                  </span>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2 line-clamp-2 hover:text-primary transition-colors">
                <Link href={`/posts/${post.id}`}>{post.title}</Link>
              </h3>
              <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{post.readTime}</span>
                </div>
                <span>{post.publishDate}</span>
              </div>
            </article>
          ))}
        </div>
        
        {/* 加载更多按钮 */}
        <div className="mt-10 text-center">
          <button className="btn-primary">
            加载更多文章
          </button>
        </div>
      </section>

      {/* 特色分类 */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-dark">热门分类</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: '前端开发', count: 24, color: 'bg-blue-100 text-blue-800' },
            { name: '后端开发', count: 18, color: 'bg-green-100 text-green-800' },
            { name: 'DevOps', count: 12, color: 'bg-purple-100 text-purple-800' },
            { name: '工具推荐', count: 9, color: 'bg-orange-100 text-orange-800' },
          ].map((category) => (
            <Link 
              key={category.name} 
              href={`/categories/${category.name}`}
              className={`${category.color} rounded-lg p-4 text-center hover:shadow-md transition-shadow`}
            >
              <h3 className="font-medium mb-1">{category.name}</h3>
              <p className="text-sm">{category.count} 篇文章</p>
            </Link>
          ))}
        </div>
      </section>

      {/* 订阅区域 */}
      <section className="bg-gray-100 rounded-xl p-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-dark">订阅我的博客</h2>
          <p className="text-gray-600 mb-6">获取最新文章更新和技术资讯</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <input 
              type="email" 
              placeholder="输入你的邮箱地址" 
              className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50 min-w-[280px]"
            />
            <button className="btn-primary whitespace-nowrap">
              立即订阅
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
```

### 5.3 认证模块

#### 5.3.1 认证函数库 (lib/auth.ts)

该模块包含完整的用户认证功能，包括：

```ts
import { supabase } from './supabase';

// 用户类型定义
export type User = {
  id: string;
  email: string;
  username?: string;
  avatar_url?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
  last_login?: string;
};

// 用户登录函数
export async function login(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Login error:', error);
      throw new Error(error.message);
    }

    // 更新用户最后登录时间
    if (data.user) {
      await updateLastLogin(data.user.id);
    }

    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

// 用户注册函数
export async function register(email: string, password: string, username?: string) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
      },
    });

    if (error) {
      console.error('Registration error:', error);
      throw new Error(error.message);
    }

    // 如果需要在users表中创建用户记录
    if (data.user && !error) {
      await createUserProfile(data.user.id, email, username);
    }

    return data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}

// 获取当前登录用户
export async function getCurrentUser() {
  try {
    const { data } = await supabase.auth.getUser();
    return data.user;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
}

// 获取用户资料
export async function getUserProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Get user profile error:', error);
      return null;
    }

    return data as User;
  } catch (error) {
    console.error('Get user profile error:', error);
    return null;
  }
}

// 更新用户资料
export async function updateUserProfile(userId: string, updates: Partial<User>) {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Update user profile error:', error);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Update user profile error:', error);
    throw error;
  }
}

// 用户登出
export async function logout() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout error:', error);
      throw new Error(error.message);
    }
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
}

// 第三方登录 - GitHub
export async function loginWithGitHub() {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
    });

    if (error) {
      console.error('GitHub login error:', error);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('GitHub login error:', error);
    throw error;
  }
}

// 第三方登录 - Google
export async function loginWithGoogle() {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });

    if (error) {
      console.error('Google login error:', error);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Google login error:', error);
    throw error;
  }
}

// 发送密码重置邮件
export async function resetPassword(email: string) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      console.error('Reset password error:', error);
      throw new Error(error.message);
    }
    return true;
  } catch (error) {
    console.error('Reset password error:', error);
    throw error;
  }
}

// 创建用户资料
async function createUserProfile(userId: string, email: string, username?: string) {
  try {
    const { error } = await supabase.from('users').insert({
      id: userId,
      email,
      username: username || email.split('@')[0],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_login: new Date().toISOString(),
    });

    if (error) {
      console.error('Create user profile error:', error);
      // 静默处理，不影响主流程
    }
  } catch (error) {
    console.error('Create user profile error:', error);
  }
}

// 更新用户最后登录时间
async function updateLastLogin(userId: string) {
  try {
    await supabase
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', userId);
  } catch (error) {
    console.error('Update last login error:', error);
  }
}
```

#### 5.3.2 Supabase 客户端配置 (lib/supabase.ts)

该模块配置 Supabase 客户端并提供数据访问函数：

```ts
import { createClient } from '@supabase/supabase-js';

// 创建Supabase客户端实例
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 示例函数：获取文章列表
export async function getPosts() {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

// 示例函数：获取单篇文章
export async function getPost(slug: string) {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

// 示例函数：获取分类列表
export async function getCategories() {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}
```

## 6. 页面路由设计

### 6.1 前台页面
- `/` - 博客首页，展示最新文章列表
- `/posts/:slug` - 文章详情页（待实现）
- `/categories/:slug` - 分类文章列表
- `/tags/:slug` - 标签文章列表
- `/about` - 关于页面（待实现）
- `/contact` - 联系页面（待实现）
- `/search` - 搜索结果页面（待实现）

### 6.2 认证页面
- `/auth/login` - 登录页面
- `/auth/register` - 注册页面
- `/auth/forgot-password` - 密码重置页面

### 6.3 后台管理页面（待实现）
- `/admin` - 管理仪表盘
- `/admin/posts` - 文章管理
- `/admin/posts/new` - 创建新文章
- `/admin/posts/edit/:id` - 编辑文章
- `/admin/categories` - 分类管理
- `/admin/tags` - 标签管理
- `/admin/comments` - 评论管理
- `/admin/profile` - 用户资料设置

## 7. 功能模块详细设计

### 7.1 用户认证模块
- 邮箱/密码注册登录
- 第三方登录（GitHub、Google）
- 密码重置
- 用户资料管理
- 已实现功能：
  - 登录页面组件
  - 注册页面组件
  - 忘记密码页面组件
  - 基础认证函数库
  - 用户资料管理函数

### 7.2 文章管理模块（待实现）
- Markdown 编辑器
- 文章预览
- 保存草稿
- 定时发布
- 文章 SEO 设置
- 自定义 slug
- 预计实现：
  - 文章列表页面
  - 文章创建/编辑页面
  - 文章详情页面

### 7.3 评论模块（待实现）
- 匿名评论（可选）
- 嵌套回复
- 评论审核
- 通知功能
- 预计实现：
  - 评论提交功能
  - 评论显示功能
  - 回复评论功能

### 7.4 统计分析模块（待实现）
- 文章访问量统计
- 热门文章排行
- 访客数据（可选接入 Google Analytics）

### 7.5 搜索功能（待实现）
- 全文搜索
- 按分类/标签搜索
- 按作者搜索

## 8. 部署与CI/CD

### 8.1 部署架构
- **代码仓库**：GitHub
- **部署平台**：Vercel
- **数据库**：Supabase
- **前端框架**：Next.js 14+

### 8.2 Vercel 部署配置
1. 环境变量设置：
   - `NEXT_PUBLIC_SUPABASE_URL` - Supabase 项目 URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase 匿名访问密钥
   - `SUPABASE_SERVICE_ROLE_KEY` - Supabase 服务角色密钥

2. 构建命令：`npm run build`
3. 输出目录：`.next`

### 8.3 自动部署流程
1. 推送到 GitHub 仓库
2. Vercel 自动检测代码变更
3. 执行构建流程
4. 部署到 Vercel 平台
5. 提供预览 URL 和生产 URL

### 8.4 环境变量配置示例 (.env.example)
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## 9. 安全措施

### 9.1 数据安全
- 使用 Supabase Row Level Security (RLS) 限制数据访问
- 敏感数据加密存储
- 定期数据备份

### 9.2 应用安全
- XSS 攻击防护
- CSRF 保护
- 输入验证和清洗
- API 请求限流

### 9.3 认证安全
- 使用 Supabase Auth 提供的安全认证
- 密码强度要求
- 登录尝试限制
- 会话管理

## 10. 性能优化策略

### 10.1 前端优化
- 静态生成（SSG）和增量静态再生（ISR）
- 图片优化和懒加载
- 代码分割
- 缓存策略
- 使用 Tailwind CSS 实现高效的样式处理

### 10.2 数据库优化
- 索引优化（已在数据库脚本中创建关键索引）
- 查询优化
- 连接池配置

### 10.3 缓存策略
- 利用 Next.js 的内置缓存机制
- CDN 集成（通过 Vercel 提供）

## 11. 项目开发流程

### 11.1 开发记录
- 项目使用 `REC.md` 文件记录开发过程中的重要决策、技术选型理由和实现细节，确保开发过程的透明度和可追溯性。

### 11.2 文档体系
- `project.md`：项目总体规划设计文档，包含架构、技术选型、功能规划等
- `order.md`：项目进度与 Git 版本管理文档，记录当前进展和下一步计划
- `REC.md`：开发记录文档，详细记录每次操作的时间、内容和原因
- `todo.md`：任务列表文档，记录当前和下一步的开发任务
- `QWEN.md`：AI 助手上下文文档，包含项目开发环境和规范信息
- `temp/error.md`：错误记录文档，用于记录部署或测试时的错误信息

### 11.3 Qwen Code 和 Trae 协同开发工作流
- Qwen Code 和 Trae 将作为主要开发工具，辅助完成代码编写、重构、调试和文档更新
- 每次 AI 操作前需要读取 `project.md`、`order.md`、`REC.md` 和 `todo.md` 获取最新项目状态
- 开发完成后需要更新 `REC.md` 记录详细开发过程，更新 `order.md` 反映项目进度，更新 `todo.md` 规划下一步任务

## 12. 未来发展规划

### 12.1 功能增强
- 暗黑模式支持
- 文章导出功能
- 订阅通知系统
- 多语言支持
- 文章系列功能
- 自定义主题

### 12.2 集成服务
- 邮件订阅
- 社交媒体分享
- 相关文章推荐
- 内容分发网络(CDN)集成

## 13. 开发指南

### 13.1 本地开发环境设置

1. **环境要求**
   - Node.js 18+
   - npm 或 yarn
   - Supabase 账户
   - Vercel 账户
   - GitHub 账户

2. **开始开发**
   ```bash
   # 克隆仓库
   git clone https://github.com/pecmens/buzz.git
   cd buzz
   
   # 安装依赖
   npm install
   # 或
   yarn install
   
   # 配置环境变量
   # 复制 .env.example 文件为 .env.local 并填入相应的环境变量
   
   # 启动开发服务器
   npm run dev
   # 或
   yarn dev
   
   # 访问应用
   # 打开浏览器访问 http://localhost:3000
   ```

### 13.2 Git 工作流程

1. **提交规范**
   ```
   git add .
   git commit -m "feat: [功能模块] 简要描述修改内容"
   git push origin main
   ```

2. **代码规范**
   - 遵循项目中已有的代码风格和规范
   - 确保代码的可读性和一致性
   - 所有敏感信息通过环境变量管理，不要硬编码在代码中
   - 确保代码中有适当的错误处理机制

### 13.3 错误处理与调试

1. **常见错误解决方法**
   - 如果遇到 RLS(行级安全性)未启用警告，需要在 Supabase 控制台中为所有表启用 RLS
   - 确保环境变量正确配置，特别是 NEXT_PUBLIC_SUPABASE_URL 和 NEXT_PUBLIC_SUPABASE_ANON_KEY
   - 检查 Supabase 数据库连接是否正常

2. **调试步骤**
   - 检查控制台日志
   - 验证 API 连接
   - 检查数据库查询是否正确

## 14. 许可证与贡献

### 14.1 许可证
本项目采用 MIT 许可证 - 详情请查看 LICENSE 文件

### 14.2 贡献指南
1. Fork 项目
2. 创建功能分支
3. 提交代码
4. 发起 Pull Request

## 15. 致谢

感谢以下技术社区和工具提供的支持：
- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.io/)
- [Vercel](https://vercel.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React](https://reactjs.org/)

---

**Buzz** - 为创作者打造的现代化博客平台 🌟