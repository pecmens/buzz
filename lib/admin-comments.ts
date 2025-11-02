import { supabase } from './supabase';

// 管理员评论类型定义
export interface AdminComment {
  id: string;
  content: string;
  post_id: string;
  post_title: string;
  author_id: string;
  author_name: string;
  parent_id?: string;
  status: 'pending' | 'approved' | 'spam';
  created_at: string;
  updated_at: string;
}

// 获取评论列表（管理员视图）
export async function getAdminComments(
  page: number = 1,
  limit: number = 10,
  status?: string,
  search?: string
): Promise<{ comments: AdminComment[]; total: number }> {
  try {
    let query = supabase
      .from('comments')
      .select(`
        id,
        content,
        post_id,
        author_id,
        parent_id,
        status,
        created_at,
        updated_at,
        users(username),
        posts(title)
      `, { count: 'exact' })
      .order('created_at', { ascending: false });

    // 状态筛选
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    // 搜索功能
    if (search) {
      query = query.ilike('content', `%${search}%`);
    }

    // 分页
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, count, error } = await query;

    if (error) {
      console.error('获取评论列表失败:', error);
      return { comments: [], total: 0 };
    }

    const comments = data.map(comment => ({
      ...comment,
      author_name: comment.users?.username || '匿名用户',
      post_title: comment.posts?.title || '未知文章'
    })) as AdminComment[];

    return { comments, total: count || 0 };
  } catch (error) {
    console.error('获取评论列表失败:', error);
    return { comments: [], total: 0 };
  }
}

// 更新评论状态
export async function updateCommentStatus(
  commentId: string,
  status: 'pending' | 'approved' | 'spam'
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('comments')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', commentId);

    if (error) {
      console.error('更新评论状态失败:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('更新评论状态失败:', error);
    return { success: false, error: (error as Error).message };
  }
}

// 批量更新评论状态
export async function batchUpdateCommentStatus(
  commentIds: string[],
  status: 'pending' | 'approved' | 'spam'
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('comments')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .in('id', commentIds);

    if (error) {
      console.error('批量更新评论状态失败:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('批量更新评论状态失败:', error);
    return { success: false, error: (error as Error).message };
  }
}

// 删除评论
export async function deleteComment(commentId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId);

    if (error) {
      console.error('删除评论失败:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('删除评论失败:', error);
    return { success: false, error: (error as Error).message };
  }
}

// 批量删除评论
export async function batchDeleteComments(commentIds: string[]): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('comments')
      .delete()
      .in('id', commentIds);

    if (error) {
      console.error('批量删除评论失败:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('批量删除评论失败:', error);
    return { success: false, error: (error as Error).message };
  }
}