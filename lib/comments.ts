import { supabase } from './supabase';

// 评论类型定义
export type Comment = {
  id: string;
  content: string;
  post_id: string;
  author_id: string;
  author_name: string; // 评论者的用户名
  parent_id?: string; // 父评论ID，用于嵌套回复
  status: string; // 评论状态: pending, approved, spam
  created_at: string;
  updated_at: string;
  replies?: Comment[]; // 嵌套回复
};

// 获取文章的所有评论
export async function getCommentsByPostId(postId: string): Promise<Comment[]> {
  try {
    // 首先获取所有顶级评论（parent_id 为 null 或 undefined 的评论）
    const { data: topComments, error: topError } = await supabase
      .from('comments')
      .select(`
        id, 
        content, 
        post_id, 
        author_id, 
        status, 
        created_at, 
        updated_at,
        users ( username )
      `)
      .eq('post_id', postId)
      .is('parent_id', null) // 获取顶级评论
      .eq('status', 'approved') // 只获取已批准的评论
      .order('created_at', { ascending: false });
    
    if (topError) {
      console.error('获取评论错误:', topError);
      throw new Error(topError.message);
    }

    // 为每个顶级评论获取其回复
    const commentsWithReplies = await Promise.all(
      topComments.map(async (comment) => {
        // 获取该评论的所有回复
        const { data: replies, error: repliesError } = await supabase
          .from('comments')
          .select(`
            id, 
            content, 
            post_id, 
            author_id, 
            status, 
            created_at, 
            updated_at,
            users ( username )
          `)
          .eq('parent_id', comment.id)
          .eq('status', 'approved')
          .order('created_at', { ascending: true });
        
        if (repliesError) {
          console.error('获取评论回复错误:', repliesError);
        }
        
        return {
          ...comment,
          author_name: (comment.users as any)?.username || '匿名用户',
          replies: replies?.map((reply: any) => ({
            ...reply,
            author_name: (reply.users as any)?.username || '匿名用户'
          })) || []
        };
      })
    );

    return commentsWithReplies as Comment[];
  } catch (error) {
    console.error('获取评论错误:', error);
    return [];
  }
}

// 提交新评论
export async function submitComment(
  postId: string, 
  authorId: string, 
  content: string, 
  parentId?: string
): Promise<{ success: boolean; message?: string; comment?: Comment }> {
  try {
    const newComment = {
      post_id: postId,
      author_id: authorId,
      content: content,
      parent_id: parentId || null, // 如果没有父评论ID，则设为null
      status: 'pending' // 默认状态为待审核
    };

    const { data, error } = await supabase
      .from('comments')
      .insert([newComment])
      .select()
      .single();

    if (error) {
      console.error('提交评论错误:', error);
      return { 
        success: false, 
        message: error.message 
      };
    }

    return { 
      success: true, 
      comment: data as Comment 
    };
  } catch (error) {
    console.error('提交评论错误:', error);
    return { 
      success: false, 
      message: (error as Error).message 
    };
  }
}