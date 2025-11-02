import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://buzz-blog.vercel.app';
    
    // 获取所有已发布的文章
    const { data: posts } = await supabase
      .from('posts')
      .select('slug, updated_at, created_at')
      .eq('status', 'published')
      .order('updated_at', { ascending: false });

    // 获取所有分类
    const { data: categories } = await supabase
      .from('categories')
      .select('slug, created_at');

    // 获取所有标签
    const { data: tags } = await supabase
      .from('tags')
      .select('slug, created_at');

    // 生成sitemap XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- 首页 -->
  <url>
    <loc>${siteUrl}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- 搜索页面 -->
  <url>
    <loc>${siteUrl}/search</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <!-- 文章页面 -->
  ${posts?.map(post => `
  <url>
    <loc>${siteUrl}/posts/${post.slug}</loc>
    <lastmod>${new Date(post.updated_at).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>`).join('') || ''}

  <!-- 分类页面 -->
  ${categories?.map(category => `
  <url>
    <loc>${siteUrl}/categories/${category.slug}</loc>
    <lastmod>${new Date(category.created_at).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('') || ''}

  <!-- 标签页面 -->
  ${tags?.map(tag => `
  <url>
    <loc>${siteUrl}/tags/${tag.slug}</loc>
    <lastmod>${new Date(tag.created_at).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`).join('') || ''}
</urlset>`;

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600', // 缓存1小时
      },
    });
  } catch (error) {
    console.error('生成sitemap失败:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}