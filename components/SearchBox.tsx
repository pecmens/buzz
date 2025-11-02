'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getSearchSuggestions, SearchHistory } from '@/lib/search';
import { useDebounce } from '@/hooks/useDebounce';

interface SearchBoxProps {
  initialQuery?: string;
  onSearch?: (query: string) => void;
  showSuggestions?: boolean;
  placeholder?: string;
  className?: string;
}

export default function SearchBox({
  initialQuery = '',
  onSearch,
  showSuggestions = false,
  placeholder = '搜索...',
  className = ''
}: SearchBoxProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // 防抖搜索
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (showSuggestions && debouncedQuery && debouncedQuery.length >= 2) {
      loadSuggestions(debouncedQuery);
    } else {
      setSuggestions([]);
    }
  }, [debouncedQuery, showSuggestions]);

  useEffect(() => {
    // 加载搜索历史
    setHistory(SearchHistory.getHistory());
  }, []);

  useEffect(() => {
    // 点击外部关闭下拉框
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadSuggestions = async (searchQuery: string) => {
    setLoading(true);
    try {
      const results = await getSearchSuggestions(searchQuery);
      setSuggestions(results);
    } catch (error) {
      console.error('获取搜索建议失败:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    const trimmedQuery = searchQuery.trim();
    
    // 添加到搜索历史
    SearchHistory.addToHistory(trimmedQuery);
    setHistory(SearchHistory.getHistory());
    
    // 关闭下拉框
    setShowDropdown(false);
    setSelectedIndex(-1);
    
    if (onSearch) {
      onSearch(trimmedQuery);
    } else {
      // 导航到搜索页面
      router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedIndex(-1);
    
    if (showSuggestions && value.length >= 1) {
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  const handleInputFocus = () => {
    if (showSuggestions && (query.length >= 1 || history.length > 0)) {
      setShowDropdown(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const items = [...(query ? suggestions : history)];
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev < items.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && items[selectedIndex]) {
          handleSearch(items[selectedIndex]);
        } else {
          handleSearch(query);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    handleSearch(suggestion);
  };

  const clearHistory = () => {
    SearchHistory.clearHistory();
    setHistory([]);
  };

  const displayItems = query ? suggestions : history;

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full px-4 py-3 pl-12 pr-12 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          
          {/* 搜索图标 */}
          <div className="absolute inset-y-0 left-0 flex items-center pl-4">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* 清除按钮 */}
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setShowDropdown(false);
                inputRef.current?.focus();
              }}
              className="absolute inset-y-0 right-0 flex items-center pr-4"
            >
              <svg className="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </form>

      {/* 搜索建议下拉框 */}
      {showSuggestions && showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto"
        >
          {loading && (
            <div className="px-4 py-3 text-center text-gray-500">
              <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="ml-2">搜索中...</span>
            </div>
          )}

          {!loading && displayItems.length === 0 && query && (
            <div className="px-4 py-3 text-gray-500 text-center">
              没有找到相关建议
            </div>
          )}

          {!loading && displayItems.length === 0 && !query && history.length === 0 && (
            <div className="px-4 py-3 text-gray-500 text-center">
              暂无搜索历史
            </div>
          )}

          {!loading && displayItems.length > 0 && (
            <>
              {!query && history.length > 0 && (
                <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-gray-500 font-medium">搜索历史</span>
                  <button
                    onClick={clearHistory}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    清除
                  </button>
                </div>
              )}

              {query && suggestions.length > 0 && (
                <div className="px-4 py-2 border-b border-gray-100">
                  <span className="text-xs text-gray-500 font-medium">搜索建议</span>
                </div>
              )}

              {displayItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(item)}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center ${
                    selectedIndex === index ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
                  }`}
                >
                  <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {query ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    )}
                  </svg>
                  <span className="truncate">{item}</span>
                </button>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}