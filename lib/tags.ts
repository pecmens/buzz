import { supabase } from './supabase';

// 标签详情类型
export interface TagDetail {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  post_count: number;
}

// 标签文章类型
export interface TagPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  cover_image_url?: string;
  author: string;
  category: string;
  created_at: string;
  view_count: number;
  readTime: string;
}

// 获取标签详情
export async function getTagBySlug(slug: string): Promise<TagDetail | null> {
  try {
    const { data, error } = await supabase
      .from('tags')
      .select(`
        id,
        name,
        slug,
        created_at
      `)
      .eq('slug', slug)
      .single();

    if (error) {
      console.error('获取标签详情失败:', error);
      return null;
    }

    // 获取该标签下的文章数量
    const { count } = await supabase
      .from('post_tags')
      .select('post_id', { count: 'exact', head: true })
      .eq('tag_id', data.id);

    return {
      ...data,
      post_count: count || 0
    };
  } catch (error) {
    console.error('获取标签详情出错:', error);
    return null;
  }
}

// 获取标签下的文章列表
export async function getTagPosts(
  tagSlug: string,
  page: number = 1,
  limit: number = 10,
  sortBy: 'date' | 'views' = 'date'
): Promise<{ posts: TagPost[]; total: number }> {
  try {
    // 首先获取标签ID
    const { data: tag } = await supabase
      .from('tags')
      .select('id')
      .eq('slug', tagSlug)
      .single();

    if (!tag) {
      return { posts: [], total: 0 };
    }

    // 通过 post_tags 关联表获取文章
    let query = supabase
      .from('post_tags')
      .select(`
        posts!inner(
          id,
          title,
          slug,
          excerpt,
          cover_image_url,
          created_at,
          view_count,
          status,
          users(username),
          categories(name)
        )
      `, { count: 'exact' })
      .eq('tag_id', tag.id)
      .eq('posts.status', 'published');

    // 排序
    switch (sortBy) {
      case 'views':
        query = query.order('view_count', { ascending: false, foreignTable: 'posts' });
        break;
      case 'date':
      default:
        query = query.order('created_at', { ascending: false, foreignTable: 'posts' });
        break;
    }

    // 分页
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, count, error } = await query;

    if (error) {
      console.error('获取标签文章失败:', error);
      return { posts: [], total: 0 };
    }

    const posts = data.map(item => {
      const post = item.posts;
      return {
        ...post,
        author: post.users?.username || '匿名',
        category: post.categories?.name || '未分类',
        readTime: calculateReadTime(post.excerpt || '')
      };
    }) as TagPost[];

    return {
      posts,
      total: count || 0
    };
  } catch (error) {
    console.error('获取标签文章出错:', error);
    return { posts: [], total: 0 };
  }
}

// 获取相关标签
export async function getRelatedTags(
  currentTagId: string,
  limit: number = 10
): Promise<TagDetail[]> {
  try {
    const { data, error } = await supabase
      .from('tags')
      .select(`
        id,
        name,
        slug,
        created_at
      `)
      .neq('id', currentTagId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('获取相关标签失败:', error);
      return [];
    }

    // 为每个标签获取文章数量
    const tagsWithCount = await Promise.all(
      data.map(async (tag) => {
        const { count } = await supabase
          .from('post_tags')
          .select('post_id', { count: 'exact', head: true })
          .eq('tag_id', tag.id);

        return {
          ...tag,
          post_count: count || 0
        };
      })
    );

    // 按文章数量排序
    return tagsWithCount.sort((a, b) => b.post_count - a.post_count);
  } catch (error) {
    console.error('获取相关标签出错:', error);
    return [];
  }
}

// 获取所有标签及其文章数量
export async function getAllTagsWithCount(): Promise<TagDetail[]> {
  try {
    const { data, error } = await supabase
      .from('tags')
      .select(`
        id,
        name,
        slug,
        created_at
      `)
      .order('name', { ascending: true });

    if (error) {
      console.error('获取所有标签失败:', error);
      return [];
    }

    // 为每个标签获取文章数量
    const tagsWithCount = await Promise.all(
      data.map(async (tag) => {
        const { count } = await supabase
          .from('post_tags')
          .select('post_id', { count: 'exact', head: true })
          .eq('tag_id', tag.id);

        return {
          ...tag,
          post_count: count || 0
        };
      })
    );

    return tagsWithCount;
  } catch (error) {
    console.error('获取所有标签出错:', error);
    return [];
  }
}

// 获取热门标签
export async function getPopularTags(limit: number = 20): Promise<TagDetail[]> {
  try {
    const allTags = await getAllTagsWithCount();
    
    // 按文章数量排序，只返回有文章的标签
    return allTags
      .filter(tag => tag.post_count > 0)
      .sort((a, b) => b.post_count - a.post_count)
      .slice(0, limit);
  } catch (error) {
    console.error('获取热门标签出错:', error);
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