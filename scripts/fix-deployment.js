#!/usr/bin/env node

/**
 * 部署修复脚本
 * 解决常见的 Vercel 部署问题
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 开始修复部署问题...\n');

// 1. 检查 package.json 中的依赖版本
function checkDependencies() {
  console.log('📦 检查依赖版本...');
  
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  const requiredDeps = {
    '@supabase/auth-helpers-nextjs': '^0.10.0',
    '@supabase/supabase-js': '^2.45.0',
    'next': '14.0.0'
  };
  
  let needsUpdate = false;
  
  for (const [dep, version] of Object.entries(requiredDeps)) {
    if (packageJson.dependencies[dep] !== version) {
      console.log(`  ⚠️  ${dep}: ${packageJson.dependencies[dep]} -> ${version}`);
      packageJson.dependencies[dep] = version;
      needsUpdate = true;
    } else {
      console.log(`  ✅ ${dep}: ${version}`);
    }
  }
  
  if (needsUpdate) {
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log('  📝 已更新 package.json');
  }
  
  console.log('');
}

// 2. 检查 Next.js 配置
function checkNextConfig() {
  console.log('⚙️  检查 Next.js 配置...');
  
  const nextConfigPath = path.join(process.cwd(), 'next.config.js');
  
  if (!fs.existsSync(nextConfigPath)) {
    console.log('  ❌ next.config.js 不存在');
    return;
  }
  
  const content = fs.readFileSync(nextConfigPath, 'utf8');
  
  if (!content.includes('webpack:')) {
    console.log('  ⚠️  缺少 webpack 配置');
  } else {
    console.log('  ✅ webpack 配置正确');
  }
  
  console.log('');
}

// 3. 检查中间件配置
function checkMiddleware() {
  console.log('🛡️  检查中间件配置...');
  
  const middlewarePath = path.join(process.cwd(), 'middleware.ts');
  
  if (!fs.existsSync(middlewarePath)) {
    console.log('  ❌ middleware.ts 不存在');
    return;
  }
  
  const content = fs.readFileSync(middlewarePath, 'utf8');
  
  if (!content.includes('runtime: \'nodejs\'')) {
    console.log('  ⚠️  缺少 runtime 配置');
  } else {
    console.log('  ✅ runtime 配置正确');
  }
  
  console.log('');
}

// 4. 检查环境变量示例
function checkEnvExample() {
  console.log('🔐 检查环境变量配置...');
  
  const envExamplePath = path.join(process.cwd(), '.env.example');
  
  if (!fs.existsSync(envExamplePath)) {
    console.log('  ⚠️  .env.example 不存在，正在创建...');
    
    const envExample = `# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# 站点配置
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=Buzz Blog
NEXT_PUBLIC_SITE_DESCRIPTION=现代化博客系统`;
    
    fs.writeFileSync(envExamplePath, envExample);
    console.log('  ✅ 已创建 .env.example');
  } else {
    console.log('  ✅ .env.example 存在');
  }
  
  console.log('');
}

// 5. 检查 Vercel 配置
function checkVercelConfig() {
  console.log('🚀 检查 Vercel 配置...');
  
  const vercelConfigPath = path.join(process.cwd(), 'vercel.json');
  
  if (!fs.existsSync(vercelConfigPath)) {
    console.log('  ⚠️  vercel.json 不存在，正在创建...');
    
    const vercelConfig = {
      "buildCommand": "npm run build",
      "outputDirectory": ".next",
      "framework": "nextjs",
      "functions": {
        "app/api/**/*.ts": {
          "runtime": "nodejs18.x"
        }
      }
    };
    
    fs.writeFileSync(vercelConfigPath, JSON.stringify(vercelConfig, null, 2));
    console.log('  ✅ 已创建 vercel.json');
  } else {
    console.log('  ✅ vercel.json 存在');
  }
  
  console.log('');
}

// 主函数
function main() {
  try {
    checkDependencies();
    checkNextConfig();
    checkMiddleware();
    checkEnvExample();
    checkVercelConfig();
    
    console.log('🎉 部署修复完成！');
    console.log('\n📋 下一步：');
    console.log('1. 运行 npm install 更新依赖');
    console.log('2. 提交更改到 Git');
    console.log('3. 重新部署到 Vercel');
    console.log('4. 在 Vercel 项目设置中配置环境变量');
    
  } catch (error) {
    console.error('❌ 修复过程中出现错误:', error.message);
    process.exit(1);
  }
}

main();