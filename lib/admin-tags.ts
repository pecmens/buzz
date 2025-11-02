import { supabase } from './supabase';

// 标签类型定义
export interface AdminTag {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  post_count?: number;
}

// 获取所有标签（管理员视图）
export async function getAdminTags(): Promise<AdminTag[]> {
  try {
    const { data, error } = await supabase
      .from('tags')
      .select(`
        *,
        post_tags(count)
      `)
      .order('name', { ascending: true });

    if (error) {
      console.error('获取标签列表失败:', error);
      return [];
    }

    return data.map(tag => ({
      ...tag,
      post_count: tag.post_tags?.length || 0
    })) as AdminTag[];
  } catch (error) {
    console.error('获取标签列表失败:', error);
    return [];
  }
}

// 创建标签
export async function createTag(tagData: {
  name: string;
  slug: string;
}): Promise<{ success: boolean; tag?: AdminTag; error?: string }> {
  try {
    // 检查标签名称和slug是否已存在
    const { data: existing } = await supabase
      .from('tags')
      .select('id')
      .or(`name.eq.${tagData.name},slug.eq.${tagData.slug}`)
      .limit(1);

    if (existing && existing.length > 0) {
      return { success: false, error: '标签名称或URL已存在' };
    }

    const { data, error } = await supabase
      .from('tags')
      .insert([tagData])
      .select()
      .single();

    if (error) {
      console.error('创建标签失败:', error);
      return { success: false, error: error.message };
    }

    return { success: true, tag: { ...data, post_count: 0 } as AdminTag };
  } catch (error) {
    console.error('创建标签失败:', error);
    return { success: false, error: (error as Error).message };
  }
}

// 更新标签
export async function updateTag(
  id: string,
  tagData: Partial<AdminTag>
): Promise<{ success: boolean; tag?: AdminTag; error?: string }> {
  try {
    // 如果更新名称或slug，检查是否已存在
    if (tagData.name || tagData.slug) {
      const conditions = [];
      if (tagData.name) conditions.push(`name.eq.${tagData.name}`);
      if (tagData.slug) conditions.push(`slug.eq.${tagData.slug}`);
      
      const { data: existing } = await supabase
        .from('tags')
        .select('id')
        .or(conditions.join(','))
        .neq('id', id)
        .limit(1);

      if (existing && existing.length > 0) {
        return { success: false, error: '标签名称或URL已存在' };
      }
    }

    const { data, error } = await supabase
      .from('tags')
      .update(tagData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('更新标签失败:', error);
      return { success: false, error: error.message };
    }

    return { success: true, tag: data as AdminTag };
  } catch (error) {
    console.error('更新标签失败:', error);
    return { success: false, error: (error as Error).message };
  }
}

// 删除标签
export async function deleteTag(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    // 检查是否有关联的文章
    const { data: postTags } = await supabase
      .from('post_tags')
      .select('post_id')
      .eq('tag_id', id)
      .limit(1);

    if (postTags && postTags.length > 0) {
      return { success: false, error: '该标签下还有文章，无法删除' };
    }

    const { error } = await supabase
      .from('tags')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('删除标签失败:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('删除标签失败:', error);
    return { success: false, error: (error as Error).message };
  }
}

// 生成标签 slug
export function generateTagSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}