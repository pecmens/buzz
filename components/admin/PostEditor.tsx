'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { createPost, updatePost, generateSlug, AdminPost } from '@/lib/admin-posts';
import { getCategories } from '@/lib/supabase';
import { markdownToHtml } from '@/lib/markdown';

interface PostEditorProps {
  post?: AdminPost;
  isEdit?: boolean;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function PostEditor({ post, isEdit = false }: PostEditorProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [previewMode, setPreviewMode] = useState(false);
  const [previewHtml, setPreviewHtml] = useState('');
  
  // 表单数据
  const [formData, setFormData] = useState({
    title: post?.title || '',
    slug: post?.slug || '',
    content: post?.content || '',
    excerpt: post?.excerpt || '',
    cover_image_url: post?.cover_image_url || '',
    category_id: post?.category_id || '',
    status: post?.status || 'draft' as 'draft' | 'published',
  });

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    // 自动生成 slug
    if (formData.title && !isEdit) {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(formData.title)
      }));
    }
  }, [formData.title, isEdit]);

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error('加载分类失败:', error);
    }
  };

  const handlePreview = async () => {
    if (!previewMode) {
      try {
        const html = await markdownToHtml(formData.content);
        setPreviewHtml(html);
      } catch (error) {
        console.error('预览生成失败:', error);
      }
    }
    setPreviewMode(!previewMode);
  };

  const handleSubmit = async (status: 'draft' | 'published') => {
    if (!formData.title.trim()) {
      alert('请输入文章标题');
      return;
    }

    if (!formData.content.trim()) {
      alert('请输入文章内容');
      return;
    }

    setLoading(true);
    try {
      const user = await getCurrentUser();
      if (!user) {
        alert('请先登录');
        return;
      }

      const postData = {
        ...formData,
        status,
        author_id: user.id,
      };

      let result;
      if (isEdit && post) {
        result = await updatePost(post.id, postData);
      } else {
        result = await createPost(postData);
      }

      if (result.success) {
        router.push('/admin/posts');
      } else {
        alert('保存失败: ' + result.error);
      }
    } catch (error) {
      console.error('保存文章失败:', error);
      alert('保存失败');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">
            {isEdit ? '编辑文章' : '创建文章'}
          </h2>
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={handlePreview}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {previewMode ? '编辑' : '预览'}
            </button>
            <button
              type="button"
              onClick={() => handleSubmit('draft')}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? '保存中...' : '保存草稿'}
            </button>
            <button
              type="button"
              onClick={() => handleSubmit('published')}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? '发布中...' : '发布文章'}
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {!previewMode ? (
          <div className="space-y-6">
            {/* 标题 */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                文章标题 *
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="输入文章标题"
              />
            </div>

            {/* Slug */}
            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
                URL Slug *
              </label>
              <input
                type="text"
                id="slug"
                value={formData.slug}
                onChange={(e) => handleInputChange('slug', e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="url-slug"
              />
              <p className="mt-1 text-sm text-gray-500">
                文章的 URL 地址，将自动根据标题生成
              </p>
            </div>

            {/* 摘要 */}
            <div>
              <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">
                文章摘要
              </label>
              <textarea
                id="excerpt"
                rows={3}
                value={formData.excerpt}
                onChange={(e) => handleInputChange('excerpt', e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="输入文章摘要（可选）"
              />
            </div>

            {/* 分类和封面图 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  文章分类
                </label>
                <select
                  id="category"
                  value={formData.category_id}
                  onChange={(e) => handleInputChange('category_id', e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">选择分类</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="cover_image" className="block text-sm font-medium text-gray-700">
                  封面图片 URL
                </label>
                <input
                  type="url"
                  id="cover_image"
                  value={formData.cover_image_url}
                  onChange={(e) => handleInputChange('cover_image_url', e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            {/* 内容编辑器 */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                文章内容 * (支持 Markdown)
              </label>
              <textarea
                id="content"
                rows={20}
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm font-mono"
                placeholder="在这里输入文章内容，支持 Markdown 语法..."
              />
              <p className="mt-1 text-sm text-gray-500">
                支持 Markdown 语法，包括标题、列表、链接、图片、代码块等
              </p>
            </div>
          </div>
        ) : (
          /* 预览模式 */
          <div className="prose prose-lg max-w-none">
            <h1>{formData.title}</h1>
            {formData.excerpt && (
              <p className="text-lg text-gray-600 italic">{formData.excerpt}</p>
            )}
            <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
          </div>
        )}
      </div>
    </div>
  );
}