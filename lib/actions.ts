'use server';

import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '@/lib/auth';
import { submitComment as submitCommentToDB } from '@/lib/comments';

export async function submitComment(
  prevState: { success: boolean; message?: string },
  formData: FormData
): Promise<{ success: boolean; message?: string }> {
  try {
    // 验证用户是否已登录
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, message: '请先登录再发表评论' };
    }

    // 从formData中提取数据
    const content = formData.get('content') as string;
    const postId = formData.get('postId') as string;
    const parentId = formData.get('parentId') as string | null;

    if (!content || content.trim().length === 0) {
      return { success: false, message: '评论内容不能为空' };
    }

    if (!postId) {
      return { success: false, message: '文章ID缺失' };
    }

    // 提交评论到数据库
    const result = await submitCommentToDB(postId, user.id, content, parentId || undefined);

    if (result.success) {
      // 重新验证页面以显示新评论
      revalidatePath(`/posts/${postId}`);
      return { success: true, message: '评论提交成功，等待审核' };
    } else {
      return { success: false, message: result.message || '提交评论失败' };
    }
  } catch (error) {
    console.error('提交评论错误:', error);
    return { success: false, message: '提交评论时发生错误' };
  }
}