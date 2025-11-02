import { supabase } from './supabase';

// 文章类型定义
export type Post = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  cover_image_url?: string;
  author_id: string;
  author?: string; // 作者名称
  category_id?: string;
  category?: string; // 分类名称
  status: string; // 文章状态
  view_count: number;
  created_at: string;
  updated_at: string;
  published_at?: string;
  readTime?: string; // 阅读时间
};

// 获取相关文章
export async function getRelatedPosts(currentPostId: string, limit: number = 4): Promise<Post[]> {
  try {
    // 首先获取当前文章的分类
    const { data: currentPost, error: postError } = await supabase
      .from('posts')
      .select('category_id')
      .eq('id', currentPostId)
      .single();

    if (postError) {
      console.error('获取当前文章信息错误:', postError);
      return [];
    }

    // 获取相同分类的其他文章
    const { data: relatedPosts, error: relatedError } = await supabase
      .from('posts')
      .select(`
        id,
        title,
        slug,
        excerpt,
        created_at,
        updated_at,
        view_count,
        categories(name)
      `)
      .eq('category_id', currentPost.category_id)
      .neq('id', currentPostId) // 排除当前文章
      .eq('status', 'published') // 只获取已发布的文章
      .order('created_at', { ascending: false })
      .limit(limit);

    if (relatedError) {
      console.error('获取相关文章错误:', relatedError);
      return [];
    }

    // 格式化返回的数据
    return relatedPosts.map((post: any) => ({
      ...post,
      category: (post.categories as any)?.name,
    })) as Post[];
  } catch (error) {
    console.error('获取相关文章错误:', error);
    return [];
  }
}

// 获取文章列表
export async function getPostsList(
  limit: number = 10,
  offset: number = 0,
  category?: string,
  tag?: string
): Promise<{ posts: Post[]; count: number }> {
  try {
    let query = supabase
      .from('posts')
      .select(`
        id,
        title,
        slug,
        excerpt,
        cover_image_url,
        created_at,
        updated_at,
        published_at,
        view_count,
        status,
        users(username),
        categories(name)
      `, { count: 'exact' })
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // 如果指定了分类，则过滤分类
    if (category) {
      query = query.eq('categories.slug', category);
    }

    const { data, count, error } = await query;

    if (error) {
      console.error('获取文章列表错误:', error);
      return { posts: [], count: 0 };
    }

    // 格式化返回的数据
    const posts = data.map((post: any) => ({
      ...post,
      author: (post.users as any)?.username || '匿名',
      category: (post.categories as any)?.name,
      readTime: '5 分钟' // 临时设置，实际应该根据内容计算
    })) as Post[];

    return { posts, count: count || 0 };
  } catch (error) {
    console.error('获取文章列表错误:', error);
    return { posts: [], count: 0 };
  }
}