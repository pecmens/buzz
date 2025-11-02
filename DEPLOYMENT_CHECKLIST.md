# 🚀 部署检查清单

## 部署前准备

### ✅ 代码质量检查
- [ ] 运行 `npm run lint` 无错误
- [ ] 运行 `npm run build` 成功
- [ ] 所有 TypeScript 错误已修复
- [ ] 所有测试通过（如有）

### ✅ 配置文件检查
- [ ] `next.config.js` 包含 webpack 配置
- [ ] `middleware.ts` 指定 Node.js runtime
- [ ] `vercel.json` 配置正确
- [ ] `.env.example` 文件存在

### ✅ 依赖版本检查
- [ ] `@supabase/auth-helpers-nextjs`: ^0.10.0
- [ ] `@supabase/supabase-js`: ^2.45.0
- [ ] `next`: 14.0.0

## Vercel 部署配置

### ✅ 环境变量设置
在 Vercel 项目设置中配置：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
NEXT_PUBLIC_SITE_NAME=Buzz Blog
NEXT_PUBLIC_SITE_DESCRIPTION=现代化博客系统
```

### ✅ 构建设置
- [ ] Framework Preset: Next.js
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `.next`
- [ ] Install Command: `npm install`
- [ ] Node.js Version: 18.x

## Supabase 配置

### ✅ 数据库设置
- [ ] 执行 `supabase-init.sql` 初始化脚本
- [ ] 启用 Row Level Security (RLS)
- [ ] 配置用户表和权限
- [ ] 设置文章、分类、标签表

### ✅ 认证设置
- [ ] 配置认证提供商
- [ ] 设置重定向 URL
- [ ] 配置邮箱模板（可选）

### ✅ 存储设置
- [ ] 创建存储桶
- [ ] 配置存储权限
- [ ] 设置文件上传策略

## 部署后验证

### ✅ 功能测试
- [ ] 首页加载正常
- [ ] 文章页面显示正确
- [ ] 搜索功能工作
- [ ] 分类和标签页面可访问
- [ ] 用户认证流程正常
- [ ] 管理后台可访问
- [ ] 移动端响应式正常

### ✅ 性能测试
- [ ] Lighthouse 性能评分 > 90
- [ ] 首屏加载时间 < 3秒
- [ ] 图片懒加载正常
- [ ] 静态资源缓存正确

### ✅ SEO 检查
- [ ] 页面标题和描述正确
- [ ] Open Graph 标签存在
- [ ] 结构化数据正确
- [ ] Sitemap 可访问

## 常见问题解决

### 🔧 Edge Runtime 警告
如果看到 Supabase realtime-js 警告：
```bash
# 运行修复脚本
npm run fix-deployment

# 或手动检查配置
- next.config.js 包含 webpack 配置
- middleware.ts 指定 runtime: 'nodejs'
- 更新 Supabase 依赖版本
```

### 🔧 环境变量问题
```bash
# 检查环境变量
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY

# 在 Vercel 中重新设置环境变量
# 重新部署项目
```

### 🔧 数据库连接问题
```bash
# 检查 Supabase 项目状态
# 验证数据库表结构
# 检查 RLS 策略
```

## 部署命令

```bash
# 1. 运行修复脚本
npm run fix-deployment

# 2. 安装依赖
npm install

# 3. 构建测试
npm run build

# 4. 提交代码
git add .
git commit -m "fix: resolve Vercel deployment issues"
git push origin main

# 5. 在 Vercel 中重新部署
```

## 监控和维护

### ✅ 部署后监控
- [ ] 设置 Vercel Analytics
- [ ] 配置错误监控
- [ ] 监控 Supabase 使用量
- [ ] 定期检查性能指标

### ✅ 定期维护
- [ ] 更新依赖包
- [ ] 优化数据库查询
- [ ] 清理未使用资源
- [ ] 备份重要数据

---

## 🎉 部署成功！

完成所有检查项后，你的 Buzz Blog 应该能够成功部署到 Vercel。

如果遇到问题，请参考 `DEPLOYMENT.md` 中的详细故障排除指南。