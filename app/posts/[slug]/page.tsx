import { notFound } from 'next/navigation';
import { getPost, supabase } from '@/lib/supabase';
import { markdownToHtml } from '@/lib/markdown';
import { getCommentsByPostId, Comment } from '@/lib/comments';
import { getRelatedPosts, Post } from '@/lib/posts';

interface PostPageProps {
  params: {
    slug: string;
  };
}

interface PostData {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  cover_image_url?: string;
  author?: string;
  category?: string;
  status: string;
  view_count: number;
  created_at: string;
  updated_at: string;
  published_at?: string;
  readTime?: string;
}

// 生成静态路径
export async function generateStaticParams() {
  try {
    const { data: posts } = await supabase
      .from('posts')
      .select('slug')
      .eq('status', 'published')
      .limit(100); // 限制数量以避免构建时间过长

    return posts?.map((post) => ({
      slug: post.slug,
    })) || [];
  } catch (error) {
    console.error('生成静态路径失败:', error);
    return [];
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const post: PostData | null = await getPost(params.slug);
  
  if (!post) {
    notFound();
  }

  // 将Markdown内容转换为HTML
  const contentHtml = await markdownToHtml(post.content);

  // 获取评论和相关文章
  const comments: Comment[] = await getCommentsByPostId(post.id);
  const relatedPosts: Post[] = await getRelatedPosts(post.id);

  return (
    <>
      {/* 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: post.title,
            description: post.excerpt || post.content.substring(0, 160),
            image: post.cover_image_url,
            url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://buzz-blog.vercel.app'}/posts/${post.slug}`,
            datePublished: post.published_at || post.created_at,
            dateModified: post.updated_at,
            author: {
              '@type': 'Person',
              name: post.author,
            },
            publisher: {
              '@type': 'Organization',
              name: 'Buzz Blog',
            },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://buzz-blog.vercel.app'}/posts/${post.slug}`,
            },
          }),
        }}
      />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
      <article className="prose prose-lg dark:prose-invert mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-dark mb-4">{post.title}</h1>
          <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-4">
            <span>作者: {post.author}</span>
            <span className="mx-2">•</span>
            <time dateTime={post.created_at}>
              {new Date(post.created_at).toLocaleDateString('zh-CN')}
            </time>
            <span className="mx-2">•</span>
            <span>{post.readTime} 读完</span>
          </div>
          {post.category && (
            <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm mb-4">
              {post.category}
            </span>
          )}
        </header>

        <div className="mb-8">
          {post.cover_image_url && (
            <img 
              src={post.cover_image_url} 
              alt={post.title} 
              className="w-full h-64 object-cover rounded-lg"
            />
          )}
        </div>

        <div className="content mb-12">
          {/* 渲染转换后的Markdown内容 */}
          <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
        </div>
      </article>

      {/* 评论区域 */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-dark">评论</h2>
        {/* 评论列表将在这里显示 */}
        <div className="mb-8">
          {comments.length > 0 ? (
            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment.id} className="border-b border-gray-200 pb-6">
                  <div className="flex items-start">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10 mr-3" />
                    <div>
                      <h4 className="font-bold">{comment.author_name}</h4>
                      <p className="text-gray-600 text-sm mb-2">
                        {new Date(comment.created_at).toLocaleString('zh-CN')}
                      </p>
                      <p>{comment.content}</p>
                    </div>
                  </div>
                  
                  {/* 回复评论 */}
                  <div className="mt-4 ml-12">
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="space-y-4">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="border-t border-gray-100 pt-4">
                            <div className="flex items-start">
                              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-8 mr-3" />
                              <div>
                                <h5 className="font-bold">{reply.author_name}</h5>
                                <p className="text-gray-600 text-sm mb-2">
                                  {new Date(reply.created_at).toLocaleString('zh-CN')}
                                </p>
                                <p>{reply.content}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">暂无评论，快来发表第一个评论吧！</p>
          )}
        </div>

        {/* 评论表单 */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="font-bold text-lg mb-4">发表评论</h3>
          <form className="space-y-4">
            <div>
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                评论内容
              </label>
              <textarea
                id="comment"
                name="content"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="写下你的评论..."
              ></textarea>
              <input type="hidden" name="postId" value={post.id} />
              <input type="hidden" name="parentId" value="" />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              >
                提交评论
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* 相关文章推荐 */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-dark">相关文章</h2>
        {relatedPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relatedPosts.map((relatedPost) => (
              <div key={relatedPost.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2 line-clamp-2">
                    <a href={`/posts/${relatedPost.slug}`} className="hover:text-primary">
                      {relatedPost.title}
                    </a>
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                    {relatedPost.excerpt || '暂无摘要'}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {new Date(relatedPost.created_at).toLocaleDateString('zh-CN')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">暂无相关文章推荐</p>
        )}
      </section>
    </div>
    </>
  );
}

// 生成页面元数据
export async function generateMetadata({ params }: PostPageProps) {
  const post = await getPost(params.slug);
  
  if (!post) {
    return {
      title: '文章不存在',
    };
  }

  return {
    title: `${post.title} | Buzz Blog`,
    description: post.excerpt || post.content.substring(0, 160),
    keywords: [post.category, '博客', '技术文章'].filter(Boolean),
    openGraph: {
      title: post.title,
      description: post.excerpt || post.content.substring(0, 160),
      type: 'article',
      publishedTime: post.published_at || post.created_at,
      modifiedTime: post.updated_at,
      authors: [post.author || 'Buzz Blog'],
      images: post.cover_image_url ? [
        {
          url: post.cover_image_url,
          width: 1200,
          height: 630,
          alt: post.title,
        }
      ] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || post.content.substring(0, 160),
      images: post.cover_image_url ? [post.cover_image_url] : undefined,
    },
  };
}