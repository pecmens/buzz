// 博客文章类型定义
export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  author: string;
  tags: string[];
  featured: boolean;
  image?: string;
}

// 博客文章数据
export const blogPosts: BlogPost[] = [
  {
    id: 1,
    slug: "hello-astro-world",
    title: "欢迎来到 Astro 世界！",
    excerpt: "Astro 是一个全新的前端框架，它允许你使用自己喜欢的 JavaScript 框架构建快速、以内容为中心的网站。",
    content: `# 欢迎来到 Astro 世界！

Astro 是一个全新的前端框架，它允许你使用自己喜欢的 JavaScript 框架构建快速、以内容为中心的网站。

## Astro 的核心特性

- **零运行时 JavaScript**：默认情况下，Astro 不会在客户端发送任何 JavaScript。
- **混合框架支持**：你可以在同一个项目中使用 React、Vue、Svelte 等框架。
- **快速的开发体验**：支持热模块替换（HMR）和快速的构建时间。
- **内容优先**：专为博客、文档和营销网站等内容驱动型网站设计。`,
    category: "技术",
    date: "2023-06-15",
    author: "Astro 团队",
    tags: ["Astro", "前端", "框架"],
    featured: true,
    image: "https://picsum.photos/seed/blog1/800/600"
  },
  {
    id: 2,
    slug: "astro-performance-tips",
    title: "Astro 性能优化技巧",
    excerpt: "了解如何优化你的 Astro 网站，使其加载更快，运行更流畅。",
    content: `# Astro 性能优化技巧

Astro 已经为性能进行了优化，但有一些技巧可以帮助你进一步提升网站的性能。

## 1. 利用组件懒加载

使用 Astro.island 组件可以实现组件的懒加载，只有当用户需要时才会加载组件的 JavaScript。

## 2. 优化图片

使用 Astro 的 Image 组件可以自动优化图片，包括调整大小、压缩和格式转换。

## 3. 减少客户端 JavaScript

尽量减少客户端 JavaScript 的使用，只在必要时才使用交互性组件。

## 4. 使用静态站点生成

Astro 默认使用静态站点生成（SSG），这可以提供最佳的性能体验。`,
    category: "性能",
    date: "2023-06-10",
    author: "性能专家",
    tags: ["性能", "Astro", "优化"],
    featured: false,
    image: "https://picsum.photos/seed/blog2/800/600"
  },
  {
    id: 3,
    slug: "astro-components-guide",
    title: "Astro 组件指南",
    excerpt: "深入了解 Astro 组件的工作原理和最佳实践。",
    content: `# Astro 组件指南

Astro 组件是构建 Astro 网站的基本单位，它们类似于其他框架的组件，但有一些独特的特性。

## Astro 组件的类型

Astro 支持三种类型的组件：

1. **.astro 组件**：Astro 特有的组件格式，类似于 HTML 但具有额外的功能。
2. **框架组件**：React、Vue、Svelte 等框架的组件。
3. **Web Components**：标准的 Web Components。

## 创建 .astro 组件

.astro 组件是 Astro 特有的组件格式，它们使用 HTML 语法，但可以包含 JavaScript 和 TypeScript 代码。

## 组件传值

你可以通过 props 向组件传递数据。`,
    category: "开发",
    date: "2023-06-05",
    author: "开发专家",
    tags: ["Astro", "组件", "开发"],
    featured: false,
    image: "https://picsum.photos/seed/blog3/800/600"
  },
  {
    id: 4,
    slug: "astro-ssg-ssr",
    title: "Astro 的 SSG 和 SSR",
    excerpt: "了解 Astro 的静态站点生成（SSG）和服务器端渲染（SSR）模式。",
    content: `# Astro 的 SSG 和 SSR

Astro 支持两种渲染模式：静态站点生成（SSG）和服务器端渲染（SSR）。

## 静态站点生成（SSG）

默认情况下，Astro 使用静态站点生成模式。在这种模式下，Astro 会在构建时生成所有页面的 HTML、CSS 和 JavaScript。

### SSG 的优点

- **性能**：静态页面加载速度快，不需要服务器处理。
- **安全性**：没有服务器端代码需要保护。
- **成本**：可以部署到任何静态托管服务，通常成本较低。

### 何时使用 SSG

SSG 适合内容不经常变化的网站，如博客、文档和营销网站。

## 服务器端渲染（SSR）

Astro 也支持服务器端渲染模式。在这种模式下，Astro 会在服务器上为每个请求生成 HTML。`,
    category: "技术",
    date: "2023-05-30",
    author: "技术专家",
    tags: ["Astro", "SSG", "SSR"],
    featured: true,
    image: "https://picsum.photos/seed/blog4/800/600"
  },
  {
    id: 5,
    slug: "astro-tailwind-css",
    title: "在 Astro 中使用 Tailwind CSS",
    excerpt: "了解如何在 Astro 项目中集成和使用 Tailwind CSS。",
    content: `# 在 Astro 中使用 Tailwind CSS

Tailwind CSS 是一个流行的实用优先 CSS 框架，它可以帮助你快速构建现代化的网站。在 Astro 项目中使用 Tailwind CSS 非常简单。

## 安装 Tailwind CSS

首先，安装 Tailwind CSS 和相关依赖。

## 配置 Tailwind CSS

编辑 tailwind.config.js 文件，配置内容如下。

## 创建 Tailwind CSS 文件

在 src/styles 目录下创建一个 global.css 文件。

## 在 Astro 项目中使用

在 src/layouts/Layout.astro 文件中导入 global.css。`,
    category: "开发",
    date: "2023-05-25",
    author: "开发专家",
    tags: ["Astro", "Tailwind CSS", "开发"],
    featured: false,
    image: "https://picsum.photos/seed/blog5/800/600"
  },
  {
    id: 6,
    slug: "astro-seo-best-practices",
    title: "Astro 的 SEO 最佳实践",
    excerpt: "了解如何优化你的 Astro 网站以提高搜索引擎排名。",
    content: `# Astro 的 SEO 最佳实践

搜索引擎优化（SEO）是提高网站在搜索引擎结果页面（SERP）中排名的过程。Astro 是一个 SEO 友好的框架，但仍有一些最佳实践可以帮助你进一步提高网站的 SEO。

## 1. 使用语义化 HTML

Astro 鼓励使用语义化 HTML，这对 SEO 非常重要。使用适当的 HTML 标签可以帮助搜索引擎理解你的内容结构。

## 2. 优化标题和元描述

为每个页面设置独特的标题和元描述，这可以帮助搜索引擎和用户了解页面的内容。

## 3. 优化 URL 结构

使用清晰、描述性的 URL 结构，避免使用随机字符或数字。

## 4. 使用结构化数据

结构化数据（也称为 Schema.org）可以帮助搜索引擎理解你的内容，并在搜索结果中显示丰富的摘要。

## 5. 优化图片

使用适当的图片格式，压缩图片，并为每个图片添加描述性的 alt 属性。

## 6. 提高页面速度

页面速度是 SEO 的一个重要因素。Astro 已经为性能进行了优化，但你可以通过减少 JavaScript、优化图片和使用 CDN 等方式进一步提高页面速度。`,
    category: "SEO",
    date: "2023-05-20",
    author: "SEO 专家",
    tags: ["Astro", "SEO", "优化"],
    featured: true,
    image: "https://picsum.photos/seed/blog6/800/600"
  }
];

// 获取所有博客文章
export function getAllPosts(): BlogPost[] {
  return blogPosts;
}

// 根据分类获取博客文章
export function getPostsByCategory(category: string): BlogPost[] {
  return blogPosts.filter(post => post.category.toLowerCase() === category.toLowerCase());
}

// 根据标签获取博客文章
export function getPostsByTag(tag: string): BlogPost[] {
  return blogPosts.filter(post => post.tags.some(t => t.toLowerCase() === tag.toLowerCase()));
}

// 根据 slug 获取博客文章
export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find(post => post.slug === slug);
}

// 获取所有分类
export function getAllCategories(): string[] {
  const categories = [...new Set(blogPosts.map(post => post.category))];
  return categories.sort();
}

// 获取所有标签
export function getAllTags(): string[] {
  const tags = [...new Set(blogPosts.flatMap(post => post.tags))];
  return tags.sort();
}

// 获取推荐文章
export function getRelatedPosts(currentPost: BlogPost, limit: number = 3): BlogPost[] {
  return blogPosts
    .filter(post => post.id !== currentPost.id && post.category === currentPost.category)
    .slice(0, limit);
}

// 获取特色文章
export function getFeaturedPosts(): BlogPost[] {
  return blogPosts.filter(post => post.featured);
}

// 根据日期排序
export function sortPostsByDate(posts: BlogPost[], order: 'asc' | 'desc' = 'desc'): BlogPost[] {
  return [...posts].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return order === 'asc' ? dateA - dateB : dateB - dateA;
  });
}
