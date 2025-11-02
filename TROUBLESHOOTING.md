# 🛠️ 故障排除指南

## Vercel 部署问题

### 问题 1: Supabase Edge Runtime 警告

**错误信息**:
```
A Node.js API is used (process.versions) which is not supported in the Edge Runtime
```

**解决方案**:
```bash
# 运行自动修复脚本
npm run fix-deployment

# 或手动修复：
# 1. 更新 next.config.js 添加 webpack 配置
# 2. 在 middleware.ts 中添加 runtime: 'nodejs'
# 3. 更新 Supabase 依赖版本
```

### 问题 2: 构建失败

**错误信息**:
```
Build failed with exit code 1
```

**解决步骤**:
1. 检查 TypeScript 错误: `npx tsc --noEmit`
2. 检查 ESLint 错误: `npm run lint`
3. 本地构建测试: `npm run build`
4. 检查环境变量配置

### 问题 3: 环境变量未定义

**错误信息**:
```
Missing Supabase environment variables
```

**解决方案**:
1. 在 Vercel 项目设置中添加环境变量
2. 确保变量名正确：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. 重新部署项目

## Supabase 连接问题

### 问题 1: 数据库连接失败

**可能原因**:
- Supabase 项目暂停
- 网络连接问题
- 环境变量错误

**解决步骤**:
1. 检查 Supabase 项目状态
2. 验证 URL 和密钥
3. 检查网络连接
4. 查看 Supabase 日志

### 问题 2: 认证失败

**可能原因**:
- 重定向 URL 配置错误
- 认证提供商设置问题
- 用户权限不足

**解决步骤**:
1. 检查 Supabase Auth 设置
2. 验证重定向 URL
3. 检查用户角色权限
4. 查看认证日志

## 性能问题

### 问题 1: 页面加载缓慢

**优化建议**:
1. 启用图片懒加载
2. 优化数据库查询
3. 使用静态生成 (SSG)
4. 配置 CDN 缓存

### 问题 2: 图片加载问题

**解决方案**:
1. 检查图片 URL 有效性
2. 配置 Next.js Image 域名
3. 优化图片格式和大小
4. 使用 WebP 格式

## 开发环境问题

### 问题 1: 本地开发服务器启动失败

**解决步骤**:
```bash
# 清理缓存
rm -rf .next
rm -rf node_modules
npm install

# 检查端口占用
lsof -ti:3000 | xargs kill -9

# 重新启动
npm run dev
```

### 问题 2: 热重载不工作

**解决方案**:
1. 检查文件监听限制
2. 重启开发服务器
3. 清理浏览器缓存
4. 检查防火墙设置

## 数据库问题

### 问题 1: RLS 策略错误

**错误信息**:
```
Row Level Security policy violation
```

**解决步骤**:
1. 检查 RLS 策略配置
2. 验证用户权限
3. 更新策略规则
4. 测试策略逻辑

### 问题 2: 数据迁移失败

**解决方案**:
1. 检查 SQL 语法
2. 验证表结构
3. 检查外键约束
4. 逐步执行迁移

## 常用调试命令

### 检查环境
```bash
# 检查 Node.js 版本
node -v

# 检查 npm 版本
npm -v

# 检查项目依赖
npm list

# 检查环境变量
env | grep NEXT_PUBLIC
```

### 构建和测试
```bash
# 清理构建
rm -rf .next

# 重新构建
npm run build

# 启动生产服务器
npm start

# 运行 linting
npm run lint
```

### Git 操作
```bash
# 检查状态
git status

# 查看最近提交
git log --oneline -5

# 重置到上一个提交
git reset --hard HEAD~1

# 强制推送
git push --force-with-lease
```

## 获取帮助

### 官方文档
- [Next.js 文档](https://nextjs.org/docs)
- [Vercel 文档](https://vercel.com/docs)
- [Supabase 文档](https://supabase.com/docs)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)

### 社区支持
- [Next.js GitHub](https://github.com/vercel/next.js)
- [Supabase Discord](https://discord.supabase.com/)
- [Vercel 社区](https://github.com/vercel/vercel/discussions)

### 日志和监控
- Vercel 部署日志
- Supabase 日志面板
- 浏览器开发者工具
- Lighthouse 性能报告

---

如果问题仍然存在，请提供详细的错误信息和复现步骤，以便获得更准确的帮助。