import { NextResponse } from 'next/server';

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://buzz-blog.vercel.app';
  
  const robots = `User-agent: *
Allow: /

# 禁止爬取管理页面
Disallow: /admin/
Disallow: /auth/

# 禁止爬取API路由
Disallow: /api/

# 允许爬取搜索页面
Allow: /search

# Sitemap
Sitemap: ${siteUrl}/sitemap.xml

# 爬取延迟
Crawl-delay: 1`;

  return new NextResponse(robots, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400', // 缓存24小时
    },
  });
}