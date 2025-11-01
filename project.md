# 个人博客系统前期规划报告

## 1. 项目概述

### 1.1 项目目标
创建一个基于GitHub、Vercel和Supabase的个人博客系统，实现内容管理、用户互动和自动部署功能。

### 1.2 项目状态
- ✅ 前端项目初始化完成
- ✅ 基础布局与首页实现
- ✅ Supabase客户端配置
- 📝 进行中：数据库配置
- 📝 待实现：用户认证、文章管理功能

### 1.3 开发记录规范
REC.md文件用于记录项目开发过程中的重要决策、技术选型理由、设计变更及实现细节。该文档将作为项目的开发日志，确保开发过程的透明度和可追溯性，便于团队成员理解项目演进历程和技术考量。每次AI操作和项目每一步的操作，都要详细地写在rec.md文件中，做详细的开发记录。

### 1.4 技术栈
- **前端框架**：Next.js
- **内容存储**：Supabase PostgreSQL数据库
- **身份验证**：Supabase Auth
- **部署平台**：Vercel
- **代码仓库**：GitHub
- **样式方案**：Tailwind CSS
- **ORM工具**：Prisma（可选，用于数据库操作）
- **Markdown处理**：gray-matter + remark

## 2. 系统架构设计

### 2.1 架构图
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

### 2.2 组件划分
1. **前端应用**：
   - 博客主页（文章列表、分页）
   - 文章详情页
   - 管理后台
   - 用户认证页面
   - 评论系统

2. **后端API**：
   - 文章CRUD操作
   - 评论管理
   - 用户认证与授权
   - 标签/分类管理

## 3. 实施步骤

### 3.1 准备阶段

#### 3.1.1 GitHub仓库设置
1. 创建GitHub新仓库
2. 配置.gitignore文件
3. 初始化项目结构

#### 3.1.2 Supabase账户设置
1. 注册/登录Supabase账户
2. 创建新项目
3. 设计数据库表结构
4. 配置API密钥和JWT

#### 3.1.3 Vercel账户设置
1. 注册/登录Vercel账户
2. 连接GitHub账户

### 3.2 开发阶段

#### 3.2.1 前端项目初始化
1. 使用Next.js创建项目
2. 配置Tailwind CSS
3. 设置环境变量

#### 3.2.2 数据库设计与实现
1. 设计数据库表结构：
   - users（用户表）
   - posts（文章表）
   - categories（分类表）
   - tags（标签表）
   - comments（评论表）
   - post_tags（文章-标签关联表）

2. 在Supabase中创建表并配置关系

#### 3.2.3 功能实现
1. 用户认证系统（使用Supabase Auth）
2. 文章发布与管理功能
3. 文章展示与分页
4. 评论系统
5. 搜索功能
6. 标签与分类系统

### 3.3 部署阶段

#### 3.3.1 部署到Vercel
1. 连接GitHub仓库
2. 配置环境变量
3. 部署项目
4. 配置自定义域名（可选）

#### 3.3.2 设置CI/CD
1. 配置GitHub Actions（可选，用于代码检查）
2. 设置Vercel自动部署

## 4. 详细数据库设计

### 4.1 users表
```sql
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
```

### 4.2 posts表
```sql
CREATE TABLE posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  cover_image_url TEXT,
  author_id UUID REFERENCES users(id),
  category_id UUID REFERENCES categories(id),
  status VARCHAR(20) DEFAULT 'draft', -- draft, published
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  published_at TIMESTAMP
);
```

### 4.3 categories表
```sql
CREATE TABLE categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4.4 tags表
```sql
CREATE TABLE tags (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4.5 post_tags表
```sql
CREATE TABLE post_tags (
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);
```

### 4.6 comments表
```sql
CREATE TABLE comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  content TEXT NOT NULL,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  author_id UUID REFERENCES users(id),
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE, -- 用于嵌套评论
  status VARCHAR(20) DEFAULT 'pending', -- pending, approved, spam
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 5. 页面与路由设计

### 5.1 前台页面
- `/` - 博客首页，显示最新文章列表
- `/posts/:slug` - 文章详情页
- `/categories/:slug` - 分类文章列表
- `/tags/:slug` - 标签文章列表
- `/about` - 关于页面
- `/contact` - 联系页面
- `/search` - 搜索结果页面

### 5.2 后台页面
- `/admin` - 后台仪表盘
- `/admin/posts` - 文章管理
- `/admin/posts/new` - 创建新文章
- `/admin/posts/edit/:id` - 编辑文章
- `/admin/categories` - 分类管理
- `/admin/tags` - 标签管理
- `/admin/comments` - 评论管理
- `/admin/profile` - 用户资料设置

## 6. 功能模块详细设计

### 6.1 用户认证模块
- 邮箱/密码注册登录
- 第三方登录（GitHub、Google）
- 密码重置
- 用户资料管理

### 6.2 文章管理模块
- Markdown编辑器
- 文章预览
- 保存草稿
- 定时发布
- 文章SEO设置
- 自定义slug

### 6.3 评论模块
- 匿名评论（可选）
- 嵌套回复
- 评论审核
- 通知功能

### 6.4 统计分析模块
- 文章访问量统计
- 热门文章排行
- 访客数据（可选接入Google Analytics）

## 7. 项目部署与CI/CD

### 7.1 Vercel部署配置
1. 环境变量设置：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

2. 构建命令：`npm run build`
3. 输出目录：`.next`

### 7.2 自动部署流程
1. 推送到GitHub仓库
2. Vercel自动检测代码变更
3. 执行构建流程
4. 部署到Vercel平台
5. 提供预览URL和生产URL

## 8. 安全措施

### 8.1 数据安全
- 使用Supabase Row Level Security (RLS)限制数据访问
- 敏感数据加密存储
- 定期数据备份

### 8.2 应用安全
- XSS攻击防护
- CSRF保护
- 输入验证和清洗
- API请求限流

## 9. 性能优化策略

### 9.1 前端优化
- 静态生成（SSG）和增量静态再生（ISR）
- 图片优化和懒加载
- 代码分割
- 缓存策略

### 9.2 数据库优化
- 索引优化
- 查询优化
- 连接池配置

## 10. 项目时间规划

### 10.1 总体时间线
- **第1周**：项目准备与环境搭建
- **第2-3周**：前端框架搭建与基础页面开发
- **第4-5周**：数据库设计与API开发
- **第6-7周**：核心功能实现
- **第8周**：测试、优化与部署

### 10.2 里程碑
1. 项目初始化完成
2. 数据库设计与实现
3. 基础UI开发完成
4. 用户认证功能实现
5. 文章管理功能实现
6. 评论系统实现
7. 系统测试与部署

## 11. 扩展功能规划（后期迭代）

### 11.1 功能增强
- 暗黑模式支持
- 文章导出功能
- 订阅通知系统
- 多语言支持
- 文章系列功能
- 自定义主题

### 11.2 集成服务
- 邮件订阅
- 社交媒体分享
- 相关文章推荐
- 内容分发网络(CDN)集成

## 12. 项目管理说明

### 12.1 进度管理文档
项目使用`order.md`文件进行进度跟踪和Git版本管理，该文件包含以下内容：
- 当前项目进度状态
- Git版本提交记录
- 下一步工作计划
- 开发规范和注意事项

### 12.2 使用流程
每次AI协助开发时，将按照以下流程进行：
1. 首先读取`project.md`了解整体项目规划和架构
2. 然后读取`order.md`了解当前进度和下一步工作
3. 按照计划执行开发任务
4. 完成后更新`order.md`中的进度记录

### 12.3 Qwen Code和Trae协同开发工作流
自2025年11月1日起，项目将主要使用Qwen Code和Trae作为主要开发工具，建立AI协同开发工作流。具体规范如下：

1. **QWEN.md文件**：项目根目录下的QWEN.md文件将包含AI开发助手的上下文信息，包括项目信息、技术栈、开发规范等，确保AI助手在每次交互中都能获得完整的项目上下文。

2. **AI协同开发流程**：
   - Qwen Code和Trae将作为主要开发工具，辅助完成代码编写、重构、调试和文档更新
   - 每次AI操作前需要读取`project.md`、`order.md`、`REC.md`和`todo.md`获取最新项目状态
   - 开发完成后需要更新`REC.md`记录详细开发过程，更新`order.md`反映项目进度，更新`todo.md`规划下一步任务

3. **文档体系**：
   - `project.md`：项目总体规划设计文档，包含架构、技术选型、功能规划等（本文件）
   - `order.md`：项目进度与Git版本管理文档，记录当前进展和下一步计划
   - `REC.md`：开发记录文档，详细记录每次操作的时间、内容和原因
   - `todo.md`：任务列表文档，记录当前和下一步的开发任务
   - `QWEN.md`：AI助手上下文文档，包含项目开发环境和规范信息
   - `temp/error.md`：错误记录文档，用于记录部署或测试时的错误信息，便于AI识别

4. **AI工具使用规范**：
   - Qwen Code主要用于代码编写、重构、功能实现和文档生成
   - Trae用于代码分析、架构理解和性能优化
   - 两者协同工作，确保代码质量和开发效率

## 13. 结论

本规划报告详细描述了使用GitHub、Vercel和Supabase构建个人博客系统的完整流程。通过此方案，可以快速搭建一个功能完善、性能优良的个人博客，并实现自动化部署和管理。该架构具有良好的可扩展性，便于后续功能迭代和维护。

随着Qwen Code和Trae的引入，项目将进入AI协同开发的新阶段，利用AI技术提升开发效率和代码质量。