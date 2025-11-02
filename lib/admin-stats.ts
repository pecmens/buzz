import { supabase } from './supabase';

// 统计数据类型
export interface DashboardStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalComments: number;
  pendingComments: number;
  totalUsers: number;
  totalCategories: number;
  totalTags: number;
}

// 获取仪表板统计数据
export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    // 并行获取所有统计数据
    const [
      postsResult,
      publishedPostsResult,
      draftPostsResult,
      commentsResult,
      pendingCommentsResult,
      usersResult,
      categoriesResult,
      tagsResult,
    ] = await Promise.all([
      supabase.from('posts').select('id', { count: 'exact', head: true }),
      supabase.from('posts').select('id', { count: 'exact', head: true }).eq('status', 'published'),
      supabase.from('posts').select('id', { count: 'exact', head: true }).eq('status', 'draft'),
      supabase.from('comments').select('id', { count: 'exact', head: true }),
      supabase.from('comments').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('users').select('id', { count: 'exact', head: true }),
      supabase.from('categories').select('id', { count: 'exact', head: true }),
      supabase.from('tags').select('id', { count: 'exact', head: true }),
    ]);

    return {
      totalPosts: postsResult.count || 0,
      publishedPosts: publishedPostsResult.count || 0,
      draftPosts: draftPostsResult.count || 0,
      totalComments: commentsResult.count || 0,
      pendingComments: pendingCommentsResult.count || 0,
      totalUsers: usersResult.count || 0,
      totalCategories: categoriesResult.count || 0,
      totalTags: tagsResult.count || 0,
    };
  } catch (error) {
    console.error('获取统计数据失败:', error);
    return {
      totalPosts: 0,
      publishedPosts: 0,
      draftPosts: 0,
      totalComments: 0,
      pendingComments: 0,
      totalUsers: 0,
      totalCategories: 0,
      totalTags: 0,
    };
  }
}

// 获取最近的文章
export async function getRecentPosts(limit: number = 5) {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        id,
        title,
        status,
        created_at,
        users(username)
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('获取最近文章失败:', error);
      return [];
    }

    return data.map((post: any) => ({
      ...post,
      author: (post.users as any)?.username || '匿名'
    }));
  } catch (error) {
    console.error('获取最近文章失败:', error);
    return [];
  }
}

// 获取最近的评论
export async function getRecentComments(limit: number = 5) {
  try {
    const { data, error } = await supabase
      .from('comments')
      .select(`
        id,
        content,
        status,
        created_at,
        users(username),
        posts(title)
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('获取最近评论失败:', error);
      return [];
    }

    return data.map((comment: any) => ({
      ...comment,
      author: (comment.users as any)?.username || '匿名',
      postTitle: (comment.posts as any)?.title || '未知文章'
    }));
  } catch (error) {
    console.error('获取最近评论失败:', error);
    return [];
  }
}