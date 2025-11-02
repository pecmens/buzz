import { supabase } from './supabase';

// 分类详情类型
export interface CategoryDetail {
  id: string;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
  post_count: number;
}

// 分类文章类型
export interface CategoryPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  cover_image_url?: string;
  author: string;
  created_at: string;
  view_count: number;
  readTime: string;
}

// 获取分类详情
export async function getCategoryBySlug(slug: string): Promise<CategoryDetail | null> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select(`
        id,
        name,
        slug,
        description,
        created_at
      `)
      .eq('slug', slug)
      .single();

    if (error) {
      console.error('获取分类详情失败:', error);
      return null;
    }

    // 获取该分类下的文章数量
    const { count } = await supabase
      .from('posts')
      .select('id', { count: 'exact', head: true })
      .eq('category_id', data.id)
      .eq('status', 'published');

    return {
      ...data,
      post_count: count || 0
    };
  } catch (error) {
    console.error('获取分类详情出错:', error);
    return null;
  }
}

// 获取分类下的文章列表
export async function getCategoryPosts(
  categorySlug: string,
  page: number = 1,
  limit: number = 10,
  sortBy: 'date' | 'views' = 'date'
): Promise<{ posts: CategoryPost[]; total: number }> {
  try {
    // 首先获取分类ID
    const { data: category } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', categorySlug)
      .single();

    if (!category) {
      return { posts: [], total: 0 };
    }

    // 构建查询
    let query = supabase
      .from('posts')
      .select(`
        id,
        title,
        slug,
        excerpt,
        cover_image_url,
        created_at,
        view_count,
        users(username)
      `, { count: 'exact' })
      .eq('category_id', category.id)
      .eq('status', 'published');

    // 排序
    switch (sortBy) {
      case 'views':
        query = query.order('view_count', { ascending: false });
        break;
      case 'date':
      default:
        query = query.order('created_at', { ascending: false });
        break;
    }

    // 分页
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, count, error } = await query;

    if (error) {
      console.error('获取分类文章失败:', error);
      return { posts: [], total: 0 };
    }

    const posts = data.map((post: any) => ({
      ...post,
      author: (post.users as any)?.username || '匿名',
      readTime: calculateReadTime(post.excerpt || '')
    })) as CategoryPost[];

    return {
      posts,
      total: count || 0
    };
  } catch (error) {
    console.error('获取分类文章出错:', error);
    return { posts: [], total: 0 };
  }
}

// 获取相关分类
export async function getRelatedCategories(
  currentCategoryId: string,
  limit: number = 5
): Promise<CategoryDetail[]> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select(`
        id,
        name,
        slug,
        description,
        created_at
      `)
      .neq('id', currentCategoryId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('获取相关分类失败:', error);
      return [];
    }

    // 为每个分类获取文章数量
    const categoriesWithCount = await Promise.all(
      data.map(async (category) => {
        const { count } = await supabase
          .from('posts')
          .select('id', { count: 'exact', head: true })
          .eq('category_id', category.id)
          .eq('status', 'published');

        return {
          ...category,
          post_count: count || 0
        };
      })
    );

    return categoriesWithCount;
  } catch (error) {
    console.error('获取相关分类出错:', error);
    return [];
  }
}

// 获取所有分类及其文章数量
export async function getAllCategoriesWithCount(): Promise<CategoryDetail[]> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select(`
        id,
        name,
        slug,
        description,
        created_at
      `)
      .order('name', { ascending: true });

    if (error) {
      console.error('获取所有分类失败:', error);
      return [];
    }

    // 为每个分类获取文章数量
    const categoriesWithCount = await Promise.all(
      data.map(async (category) => {
        const { count } = await supabase
          .from('posts')
          .select('id', { count: 'exact', head: true })
          .eq('category_id', category.id)
          .eq('status', 'published');

        return {
          ...category,
          post_count: count || 0
        };
      })
    );

    return categoriesWithCount;
  } catch (error) {
    console.error('获取所有分类出错:', error);
    return [];
  }
}

// 计算阅读时间（简单估算）
function calculateReadTime(content: string): string {
  const wordsPerMinute = 200; // 假设每分钟阅读200字
  const wordCount = content.length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${Math.max(1, minutes)} 分钟`;
}