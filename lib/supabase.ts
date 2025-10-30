import { createClient } from '@supabase/supabase-js';

// 创建Supabase客户端实例
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 示例函数：获取文章列表
export async function getPosts() {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

// 示例函数：获取单篇文章
export async function getPost(slug: string) {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

// 示例函数：获取分类列表
export async function getCategories() {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}