import { supabase } from './supabase';

// 分类类型定义
export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
  post_count?: number;
}

// 获取所有分类（管理员视图）
export async function getAdminCategories(): Promise<AdminCategory[]> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select(`
        *,
        posts(count)
      `)
      .order('name', { ascending: true });

    if (error) {
      console.error('获取分类列表失败:', error);
      return [];
    }

    return data.map(category => ({
      ...category,
      post_count: category.posts?.length || 0
    })) as AdminCategory[];
  } catch (error) {
    console.error('获取分类列表失败:', error);
    return [];
  }
}

// 创建分类
export async function createCategory(categoryData: {
  name: string;
  slug: string;
  description?: string;
}): Promise<{ success: boolean; category?: AdminCategory; error?: string }> {
  try {
    // 检查分类名称和slug是否已存在
    const { data: existing } = await supabase
      .from('categories')
      .select('id')
      .or(`name.eq.${categoryData.name},slug.eq.${categoryData.slug}`)
      .limit(1);

    if (existing && existing.length > 0) {
      return { success: false, error: '分类名称或URL已存在' };
    }

    const { data, error } = await supabase
      .from('categories')
      .insert([categoryData])
      .select()
      .single();

    if (error) {
      console.error('创建分类失败:', error);
      return { success: false, error: error.message };
    }

    return { success: true, category: { ...data, post_count: 0 } as AdminCategory };
  } catch (error) {
    console.error('创建分类失败:', error);
    return { success: false, error: (error as Error).message };
  }
}

// 更新分类
export async function updateCategory(
  id: string,
  categoryData: Partial<AdminCategory>
): Promise<{ success: boolean; category?: AdminCategory; error?: string }> {
  try {
    // 如果更新名称或slug，检查是否已存在
    if (categoryData.name || categoryData.slug) {
      const conditions = [];
      if (categoryData.name) conditions.push(`name.eq.${categoryData.name}`);
      if (categoryData.slug) conditions.push(`slug.eq.${categoryData.slug}`);
      
      const { data: existing } = await supabase
        .from('categories')
        .select('id')
        .or(conditions.join(','))
        .neq('id', id)
        .limit(1);

      if (existing && existing.length > 0) {
        return { success: false, error: '分类名称或URL已存在' };
      }
    }

    const { data, error } = await supabase
      .from('categories')
      .update(categoryData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('更新分类失败:', error);
      return { success: false, error: error.message };
    }

    return { success: true, category: data as AdminCategory };
  } catch (error) {
    console.error('更新分类失败:', error);
    return { success: false, error: (error as Error).message };
  }
}

// 删除分类
export async function deleteCategory(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    // 检查是否有关联的文章
    const { data: posts } = await supabase
      .from('posts')
      .select('id')
      .eq('category_id', id)
      .limit(1);

    if (posts && posts.length > 0) {
      return { success: false, error: '该分类下还有文章，无法删除' };
    }

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('删除分类失败:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('删除分类失败:', error);
    return { success: false, error: (error as Error).message };
  }
}

// 生成分类 slug
export function generateCategorySlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}