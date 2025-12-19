# 现代商业企业型Astro网站

## 项目简介
这是一个基于Astro框架开发的现代商业企业型综合网站，采用天蓝色和白色为主色调，旨在展示企业形象、产品和服务，并提供用户交互功能。

## 技术栈
- **框架**：Astro 5.16.6
- **样式**：Tailwind CSS
- **部署**：Vercel
- **版本控制**：GitHub

## 功能特性
- 🎨 现代简约的企业风格设计
- 📱 完全响应式布局，适配各种设备
- 🚀 高性能，快速加载
- 🔍 优化的SEO配置
- 💡 丰富的交互效果
- 📝 内容管理系统集成支持
- 📧 联系表单功能

## 快速开始

### 安装依赖
```bash
npm install
```

### 开发服务器
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

### 本地预览生产版本
```bash
npm run preview
```

## 项目结构
```
├── public/              # 静态资源
├── src/                 # 源代码
│   ├── assets/          # 组件内使用的静态资源
│   ├── components/      # 通用组件
│   ├── layouts/         # 页面布局模板
│   ├── pages/           # 页面路由
│   └── styles/          # 全局样式
├── project/             # 项目文档和工程文件
│   ├── astroflow_requirements.md  # AstroFlow需求报告
│   ├── design.md        # 设计模型与工程需求文档
│   ├── project.md       # 项目总览文档
│   ├── requirements.md  # 项目需求文档
│   ├── task.md          # 任务文档
│   ├── todo.md          # 工程进度记录和工序文档
│   └── REC.md           # 项目开发记录
├── astro.config.mjs     # Astro配置
├── package.json         # 依赖配置
└── vercel.json          # Vercel配置
```

## 页面结构
- **首页**：展示企业核心信息和主要功能入口
- **关于我们**：介绍企业背景、历史、团队等
- **产品中心**：展示企业产品列表和详情
- **服务中心**：展示企业服务和解决方案
- **案例研究**：展示企业成功案例
- **新闻中心**：发布企业新闻和动态
- **联系我们**：提供企业联系方式和咨询表单

## 部署
项目已配置为在Vercel平台部署。

### 自动部署
每次推送到`main`分支时，Vercel会自动构建和部署最新版本。

### 手动部署
```bash
npm run build
```
然后将`dist`目录部署到任何静态网站托管服务。

## 贡献指南
欢迎提交Issue和Pull Request来帮助改进这个项目。

### 开发流程
1. Fork仓库
2. 创建特性分支：`git checkout -b feature/your-feature`
3. 提交更改：`git commit -m 'Add some feature'`
4. 推送到分支：`git push origin feature/your-feature`
5. 提交Pull Request

## 许可证
本项目采用MIT许可证。详见LICENSE文件。

## 联系方式
如有问题或建议，请通过以下方式联系我们：
- 邮箱：[your-email@example.com]
- GitHub：[pecmens/buzz](https://github.com/pecmens/buzz)

## 致谢
感谢所有为这个项目做出贡献的开发者和设计师。

---

**最后更新时间**：2025-12-22