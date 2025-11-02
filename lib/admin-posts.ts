import { supabase } from './supabase';

// 文章管理类型定义
export interface AdminPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  cover_image_url?: string;
  author_id: string;
  author?: string;
  category_id?: string;
  category?: string;
  status: 'draft' | 'published' | 'archived';
  view_count: number;
  created_at: string;
  updated_at: string;
  published_at?: string;
}

// 获取文章列表（管理员视图）
export async function getAdminPosts(
  page: number = 1,
  limit: number = 10,
  status?: string,
  search?: string
): Promise<{ posts: AdminPost[]; total: number }> {
  try {
    let query = supabase
      .from('posts')
      .select(`
        id,
        title,
        slug,
        excerpt,
        status,
        view_count,
        created_at,
        updated_at,
        published_at,
        users(username),
        categories(name)
      `, { count: 'exact' })
      .order('created_at', { ascending: false });

    // 状态筛选
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    // 搜索功能
    if (search) {
      query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
    }

    // 分页
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, count, error } = await query;

    if (error) {
      console.error('获取文章列表失败:', error);
      return { posts: [], total: 0 };
    }

    const posts = data.map((post: any) => ({
      ...post,
      author: (post.users as any)?.username || '匿名',
      category: (post.categories as any)?.name || '未分类'
    })) as AdminPost[];

    return { posts, total: count || 0 };
  } catch (error) {
    console.error('获取文章列表失败:', error);
    return { posts: [], total: 0 };
  }
}

// 获取单篇文章（管理员视图）
export async function getAdminPost(id: string): Promise<AdminPost | null> {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        users(username),
        categories(name)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('获取文章详情失败:', error);
      return null;
    }

    return {
      ...data,
      author: data.users?.username || '匿名',
      category: data.categories?.name || '未分类'
    } as AdminPost;
  } catch (error) {
    console.error('获取文章详情失败:', error);
    return null;
  }
}

// 创建文章
export async function createPost(postData: {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  cover_image_url?: string;
  category_id?: string;
  status: 'draft' | 'published';
  author_id: string;
}): Promise<{ success: boolean; post?: AdminPost; error?: string }> {
  try {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('posts')
      .insert([{
        ...postData,
        created_at: now,
        updated_at: now,
        published_at: postData.status === 'published' ? now : null,
      }])
      .select(`
        *,
        users(username),
        categories(name)
      `)
      .single();

    if (error) {
      console.error('创建文章失败:', error);
      return { success: false, error: error.message };
    }

    const post = {
      ...data,
      author: data.users?.username || '匿名',
      category: data.categories?.name || '未分类'
    } as AdminPost;

    return { success: true, post };
  } catch (error) {
    console.error('创建文章失败:', error);
    return { success: false, error: (error as Error).message };
  }
}

// 更新文章
export async function updatePost(
  id: string,
  postData: Partial<AdminPost>
): Promise<{ success: boolean; post?: AdminPost; error?: string }> {
  try {
    const updateData = {
      ...postData,
      updated_at: new Date().toISOString(),
    };

    // 如果状态改为已发布且之前没有发布时间，设置发布时间
    if (postData.status === 'published' && !postData.published_at) {
      updateData.published_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('posts')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        users(username),
        categories(name)
      `)
      .single();

    if (error) {
      console.error('更新文章失败:', error);
      return { success: false, error: error.message };
    }

    const post = {
      ...data,
      author: data.users?.username || '匿名',
      category: data.categories?.name || '未分类'
    } as AdminPost;

    return { success: true, post };
  } catch (error) {
    console.error('更新文章失败:', error);
    return { success: false, error: (error as Error).message };
  }
}

// 删除文章
export async function deletePost(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('删除文章失败:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('删除文章失败:', error);
    return { success: false, error: (error as Error).message };
  }
}

// 批量更新文章状态
export async function batchUpdatePostStatus(
  postIds: string[],
  status: 'draft' | 'published' | 'archived'
): Promise<{ success: boolean; error?: string }> {
  try {
    const updateData: any = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (status === 'published') {
      updateData.published_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from('posts')
      .update(updateData)
      .in('id', postIds);

    if (error) {
      console.error('批量更新文章状态失败:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('批量更新文章状态失败:', error);
    return { success: false, error: (error as Error).message };
  }
}

// 生成文章 slug
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // 移除特殊字符
    .replace(/[\s_-]+/g, '-') // 替换空格和下划线为连字符
    .replace(/^-+|-+$/g, ''); // 移除开头和结尾的连字符
}