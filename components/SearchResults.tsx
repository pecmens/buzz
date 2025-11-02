'use client';

import Link from 'next/link';
import { SearchResult } from '@/lib/search';

interface SearchResultsProps {
  result: SearchResult;
  loading: boolean;
  query: string;
  onPageChange: (page: number) => void;
  currentPage: number;
}

export default function SearchResults({
  result,
  loading,
  query,
  onPageChange,
  currentPage
}: SearchResultsProps) {
  const { posts, total } = result;
  const pageSize = 10;
  const totalPages = Math.ceil(total / pageSize);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">搜索中...</span>
        </div>
      </div>
    );
  }

  if (!query) {
    return (
      <div className="text-center py-12">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-gray-900">开始搜索</h3>
        <p className="mt-2 text-gray-500">输入关键词来搜索相关文章</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-gray-900">没有找到相关文章</h3>
        <p className="mt-2 text-gray-500">
          没有找到包含 &ldquo;<span className="font-medium">{query}</span>&rdquo; 的文章
        </p>
        <div className="mt-6">
          <p className="text-sm text-gray-500 mb-4">建议：</p>
          <ul className="text-sm text-gray-500 space-y-1">
            <li>• 检查拼写是否正确</li>
            <li>• 尝试使用更通用的关键词</li>
            <li>• 尝试使用不同的关键词组合</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 搜索结果统计 */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          找到 <span className="font-medium">{total}</span> 篇相关文章
          {query && (
            <>
              ，关键词：<span className="font-medium">&ldquo;{query}&rdquo;</span>
            </>
          )}
        </p>
      </div>

      {/* 搜索结果列表 */}
      <div className="space-y-6">
        {posts.map((post) => (
          <article key={post.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="space-y-3">
              {/* 文章标题 */}
              <h2 className="text-xl font-semibold">
                <Link 
                  href={`/posts/${post.slug}`}
                  className="text-gray-900 hover:text-blue-600 transition-colors"
                >
                  {post.highlight?.title ? (
                    <span dangerouslySetInnerHTML={{ __html: post.highlight.title }} />
                  ) : (
                    post.title
                  )}
                </Link>
              </h2>

              {/* 文章摘要 */}
              <div className="text-gray-600 leading-relaxed">
                {post.highlight?.content ? (
                  <p dangerouslySetInnerHTML={{ __html: post.highlight.content }} />
                ) : post.highlight?.excerpt ? (
                  <p dangerouslySetInnerHTML={{ __html: post.highlight.excerpt }} />
                ) : (
                  <p>{post.excerpt || post.content.substring(0, 200) + '...'}</p>
                )}
              </div>

              {/* 文章元信息 */}
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {post.author}
                </div>
                
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {formatDate(post.created_at)}
                </div>

                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  {post.category}
                </div>

                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {post.view_count} 次阅读
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* 分页 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 mt-8">
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            上一页
          </button>

          <div className="flex space-x-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let page;
              if (totalPages <= 5) {
                page = i + 1;
              } else if (currentPage <= 3) {
                page = i + 1;
              } else if (currentPage >= totalPages - 2) {
                page = totalPages - 4 + i;
              } else {
                page = currentPage - 2 + i;
              }

              return (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    currentPage === page
                      ? 'text-blue-600 bg-blue-50 border border-blue-300'
                      : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            下一页
          </button>
        </div>
      )}
    </div>
  );
}