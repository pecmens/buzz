import { supabase } from './supabase';

// 搜索参数类型
export interface SearchParams {
  query: string;
  category?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'relevance' | 'date' | 'views';
  page?: number;
  limit?: number;
}

// 搜索结果类型
export interface SearchResult {
  posts: SearchPost[];
  total: number;
  suggestions?: string[];
}

// 搜索文章类型
export interface SearchPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  created_at: string;
  view_count: number;
  highlight?: {
    title?: string;
    content?: string;
    excerpt?: string;
  };
}

// 全文搜索函数
export async function searchPosts(params: SearchParams): Promise<SearchResult> {
  try {
    const {
      query,
      category,
      dateFrom,
      dateTo,
      sortBy = 'relevance',
      page = 1,
      limit = 10
    } = params;

    if (!query || query.trim().length === 0) {
      return { posts: [], total: 0 };
    }

    // 构建搜索查询
    let searchQuery = supabase
      .from('posts')
      .select(`
        id,
        title,
        slug,
        excerpt,
        content,
        created_at,
        view_count,
        users(username),
        categories(name)
      `, { count: 'exact' })
      .eq('status', 'published');

    // 全文搜索 - 搜索标题、摘要和内容
    const searchTerm = query.trim();
    searchQuery = searchQuery.or(
      `title.ilike.%${searchTerm}%,excerpt.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`
    );

    // 分类筛选
    if (category) {
      searchQuery = searchQuery.eq('categories.slug', category);
    }

    // 日期范围筛选
    if (dateFrom) {
      searchQuery = searchQuery.gte('created_at', dateFrom);
    }
    if (dateTo) {
      searchQuery = searchQuery.lte('created_at', dateTo);
    }

    // 排序
    switch (sortBy) {
      case 'date':
        searchQuery = searchQuery.order('created_at', { ascending: false });
        break;
      case 'views':
        searchQuery = searchQuery.order('view_count', { ascending: false });
        break;
      case 'relevance':
      default:
        // 按相关性排序（标题匹配优先）
        searchQuery = searchQuery.order('created_at', { ascending: false });
        break;
    }

    // 分页
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    searchQuery = searchQuery.range(from, to);

    const { data, count, error } = await searchQuery;

    if (error) {
      console.error('搜索失败:', error);
      return { posts: [], total: 0 };
    }

    // 处理搜索结果，添加高亮
    const posts = data.map(post => {
      const searchPost: SearchPost = {
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt || '',
        content: post.content,
        category: (post.categories as any)?.name || '未分类',
        author: (post.users as any)?.username || '匿名',
        created_at: post.created_at,
        view_count: post.view_count || 0,
        highlight: generateHighlight(post, searchTerm)
      };
      return searchPost;
    });

    return {
      posts,
      total: count || 0
    };
  } catch (error) {
    console.error('搜索出错:', error);
    return { posts: [], total: 0 };
  }
}

// 生成搜索建议
export async function getSearchSuggestions(query: string): Promise<string[]> {
  try {
    if (!query || query.trim().length < 2) {
      return [];
    }

    const searchTerm = query.trim();
    
    // 从文章标题中获取建议
    const { data, error } = await supabase
      .from('posts')
      .select('title')
      .eq('status', 'published')
      .ilike('title', `%${searchTerm}%`)
      .limit(5);

    if (error) {
      console.error('获取搜索建议失败:', error);
      return [];
    }

    // 提取关键词作为建议
    const suggestions = data
      .map(post => post.title)
      .filter(title => title.toLowerCase().includes(searchTerm.toLowerCase()))
      .slice(0, 5);

    return suggestions;
  } catch (error) {
    console.error('获取搜索建议出错:', error);
    return [];
  }
}

// 获取热门搜索词
export async function getPopularSearchTerms(): Promise<string[]> {
  try {
    // 从文章标签中获取热门词汇
    const { data, error } = await supabase
      .from('tags')
      .select(`
        name,
        post_tags(count)
      `)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('获取热门搜索词失败:', error);
      return [];
    }

    return data.map(tag => tag.name);
  } catch (error) {
    console.error('获取热门搜索词出错:', error);
    return [];
  }
}

// 生成搜索结果高亮
function generateHighlight(post: any, searchTerm: string): SearchPost['highlight'] {
  const highlight: SearchPost['highlight'] = {};
  const term = searchTerm.toLowerCase();

  // 高亮标题
  if (post.title.toLowerCase().includes(term)) {
    highlight.title = highlightText(post.title, searchTerm);
  }

  // 高亮摘要
  if (post.excerpt && post.excerpt.toLowerCase().includes(term)) {
    highlight.excerpt = highlightText(post.excerpt, searchTerm);
  }

  // 高亮内容片段
  if (post.content.toLowerCase().includes(term)) {
    highlight.content = extractAndHighlightContent(post.content, searchTerm);
  }

  return highlight;
}

// 高亮文本
function highlightText(text: string, searchTerm: string): string {
  const regex = new RegExp(`(${escapeRegExp(searchTerm)})`, 'gi');
  return text.replace(regex, '<mark class="bg-yellow-200">$1</mark>');
}

// 提取并高亮内容片段
function extractAndHighlightContent(content: string, searchTerm: string, maxLength: number = 200): string {
  const term = searchTerm.toLowerCase();
  const lowerContent = content.toLowerCase();
  const index = lowerContent.indexOf(term);
  
  if (index === -1) return '';

  // 提取包含搜索词的片段
  const start = Math.max(0, index - 50);
  const end = Math.min(content.length, index + maxLength);
  let excerpt = content.substring(start, end);

  // 如果不是从开头开始，添加省略号
  if (start > 0) excerpt = '...' + excerpt;
  if (end < content.length) excerpt = excerpt + '...';

  // 高亮搜索词
  return highlightText(excerpt, searchTerm);
}

// 转义正则表达式特殊字符
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// 搜索历史管理
export class SearchHistory {
  private static readonly STORAGE_KEY = 'blog_search_history';
  private static readonly MAX_HISTORY = 10;

  static getHistory(): string[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const history = localStorage.getItem(this.STORAGE_KEY);
      return history ? JSON.parse(history) : [];
    } catch {
      return [];
    }
  }

  static addToHistory(query: string): void {
    if (typeof window === 'undefined' || !query.trim()) return;

    const history = this.getHistory();
    const trimmedQuery = query.trim();
    
    // 移除重复项
    const filteredHistory = history.filter(item => item !== trimmedQuery);
    
    // 添加到开头
    const newHistory = [trimmedQuery, ...filteredHistory].slice(0, this.MAX_HISTORY);
    
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(newHistory));
    } catch (error) {
      console.error('保存搜索历史失败:', error);
    }
  }

  static clearHistory(): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('清除搜索历史失败:', error);
    }
  }
}