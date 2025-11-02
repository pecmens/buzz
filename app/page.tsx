import Link from 'next/link';
import { getPosts } from '@/lib/supabase';
import LazyImage from '@/components/LazyImage';

export default async function HomePage() {
  // 从Supabase获取文章数据
  const posts = await getPosts();

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
                <LazyImage
                  src={post.cover_image_url || 'https://picsum.photos/800/450'} 
                  alt={post.title} 
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                  width={800}
                  height={450}
                />
                <div className="absolute top-3 left-3">
                  <span className="bg-primary/90 text-white text-xs px-2 py-1 rounded-full">
                    {post.category}
                  </span>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2 line-clamp-2 hover:text-primary transition-colors">
                <Link href={`/posts/${post.slug}`}>{post.title}</Link>
              </h3>
              <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{post.readTime}</span>
                </div>
                <span>{new Date(post.created_at).toLocaleDateString('zh-CN')}</span>
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