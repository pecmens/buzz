import { createClient } from '@supabase/supabase-js';

// 创建Supabase客户端实例
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// 示例函数：获取文章列表
export async function getPosts() {
  try {
    const { data, error } = await supabase
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
      `)
      .eq('status', 'published')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // 格式化数据
    return data.map((post: any) => ({
      ...post,
      author: (post.users as any)?.username || '匿名',
      category: (post.categories as any)?.name,
      readTime: '5 分钟' // 临时设置，实际应该根据内容计算
    }));
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

// 示例函数：获取单篇文章
export async function getPost(slug: string) {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        id,
        title,
        slug,
        content,
        excerpt,
        cover_image_url,
        created_at,
        updated_at,
        published_at,
        view_count,
        status,
        users(username),
        categories(name)
      `)
      .eq('slug', slug)
      .eq('status', 'published') // 只获取已发布的文章
      .single();
    
    if (error) throw error;
    
    // 格式化数据
    return {
      ...data,
      author: (data.users as any)?.username || '匿名',
      category: (data.categories as any)?.name,
      readTime: '5 分钟' // 临时设置，实际应该根据内容计算
    };
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

// 示例函数：获取分类列表
export async function getCategories() {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}