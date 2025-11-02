'use client';

import { useState, useEffect } from 'react';
import { SearchParams } from '@/lib/search';
import { getCategories } from '@/lib/supabase';

interface SearchFiltersProps {
  filters: SearchParams;
  onFilterChange: (filters: Partial<SearchParams>) => void;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function SearchFilters({ filters, onFilterChange }: SearchFiltersProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error('加载分类失败:', error);
    }
  };

  const handleSortChange = (sortBy: 'relevance' | 'date' | 'views') => {
    onFilterChange({ sortBy });
  };

  const handleCategoryChange = (category: string) => {
    onFilterChange({ category: category || undefined });
  };

  const handleDateChange = (field: 'dateFrom' | 'dateTo', value: string) => {
    onFilterChange({ [field]: value || undefined });
  };

  const clearFilters = () => {
    onFilterChange({
      category: undefined,
      dateFrom: undefined,
      dateTo: undefined,
      sortBy: 'relevance'
    });
  };

  const hasActiveFilters = filters.category || filters.dateFrom || filters.dateTo || filters.sortBy !== 'relevance';

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="space-y-6">
        {/* 筛选标题 */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">筛选条件</h3>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              清除筛选
            </button>
          )}
        </div>

        {/* 排序方式 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            排序方式
          </label>
          <div className="space-y-2">
            {[
              { value: 'relevance', label: '相关性' },
              { value: 'date', label: '发布时间' },
              { value: 'views', label: '阅读量' }
            ].map((option) => (
              <label key={option.value} className="flex items-center">
                <input
                  type="radio"
                  name="sortBy"
                  value={option.value}
                  checked={filters.sortBy === option.value}
                  onChange={(e) => handleSortChange(e.target.value as any)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 分类筛选 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            文章分类
          </label>
          <select
            value={filters.category || ''}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="">所有分类</option>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* 高级筛选 */}
        <div>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            <span>高级筛选</span>
            <svg
              className={`ml-1 h-4 w-4 transform transition-transform ${
                showAdvanced ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showAdvanced && (
            <div className="mt-4 space-y-4">
              {/* 日期范围 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  发布日期
                </label>
                <div className="space-y-2">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">开始日期</label>
                    <input
                      type="date"
                      value={filters.dateFrom || ''}
                      onChange={(e) => handleDateChange('dateFrom', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">结束日期</label>
                    <input
                      type="date"
                      value={filters.dateTo || ''}
                      onChange={(e) => handleDateChange('dateTo', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 活跃筛选条件显示 */}
        {hasActiveFilters && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              当前筛选
            </label>
            <div className="flex flex-wrap gap-2">
              {filters.category && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  分类: {categories.find(c => c.slug === filters.category)?.name || filters.category}
                  <button
                    onClick={() => handleCategoryChange('')}
                    className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-blue-200"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              )}
              
              {filters.dateFrom && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  从: {filters.dateFrom}
                  <button
                    onClick={() => handleDateChange('dateFrom', '')}
                    className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-green-200"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              )}
              
              {filters.dateTo && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  到: {filters.dateTo}
                  <button
                    onClick={() => handleDateChange('dateTo', '')}
                    className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-green-200"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}