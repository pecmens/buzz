'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import SearchBox from '@/components/SearchBox';
import SearchResults from '@/components/SearchResults';
import SearchFilters from '@/components/SearchFilters';
import { searchPosts, SearchParams, SearchResult } from '@/lib/search';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [searchResult, setSearchResult] = useState<SearchResult>({ posts: [], total: 0 });
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<SearchParams>({
    query: searchParams.get('q') || '',
    category: searchParams.get('category') || undefined,
    sortBy: (searchParams.get('sort') as 'relevance' | 'date' | 'views') || 'relevance',
    page: parseInt(searchParams.get('page') || '1'),
    limit: 10,
  });

  useEffect(() => {
    if (filters.query) {
      handleSearch();
    }
  }, [filters]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const result = await searchPosts(filters);
      setSearchResult(result);
    } catch (error) {
      console.error('搜索失败:', error);
      setSearchResult({ posts: [], total: 0 });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters: Partial<SearchParams>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: newFilters.query !== prev.query ? 1 : prev.page, // 新搜索时重置页码
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">搜索文章</h1>
          <p className="text-gray-600">在这里搜索您感兴趣的内容</p>
        </div>

        {/* 搜索框 */}
        <div className="max-w-2xl mx-auto mb-8">
          <SearchBox
            initialQuery={filters.query}
            onSearch={(query) => handleFilterChange({ query })}
            showSuggestions={true}
            placeholder="输入关键词搜索文章..."
          />
        </div>

        {/* 搜索结果区域 */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 侧边栏筛选 */}
          <div className="lg:w-1/4">
            <SearchFilters
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </div>

          {/* 搜索结果 */}
          <div className="lg:w-3/4">
            <SearchResults
              result={searchResult}
              loading={loading}
              query={filters.query}
              onPageChange={handlePageChange}
              currentPage={filters.page || 1}
            />
          </div>
        </div>
      </div>
    </div>
  );
}