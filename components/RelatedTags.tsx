import Link from 'next/link';
import { TagDetail } from '@/lib/tags';

interface RelatedTagsProps {
  tags: TagDetail[];
  currentTagId: string;
}

export default function RelatedTags({ tags, currentTagId }: RelatedTagsProps) {
  if (tags.length === 0) {
    return null;
  }

  // 根据文章数量分组标签
  const popularTags = tags.filter(tag => tag.post_count >= 3);
  const otherTags = tags.filter(tag => tag.post_count < 3);

  return (
    <div className="space-y-6">
      {/* 热门标签 */}
      {popularTags.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">热门标签</h3>
          
          <div className="flex flex-wrap gap-2">
            {popularTags.slice(0, 8).map((tag) => (
              <Link
                key={tag.id}
                href={`/tags/${tag.slug}`}
                className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-800 hover:bg-green-200 transition-colors"
              >
                #{tag.name}
                <span className="ml-1 text-xs bg-green-200 text-green-700 px-1.5 py-0.5 rounded-full">
                  {tag.post_count}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 相关标签 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">相关标签</h3>
        
        <div className="space-y-3">
          {otherTags.slice(0, 6).map((tag) => (
            <Link
              key={tag.id}
              href={`/tags/${tag.slug}`}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                  #{tag.name}
                </span>
              </div>
              <span className="text-xs text-gray-500">
                {tag.post_count} 篇
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <Link
            href="/tags"
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            查看所有标签 →
          </Link>
        </div>
      </div>

      {/* 标签云 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">标签云</h3>
        
        <div className="flex flex-wrap gap-2">
          {tags.slice(0, 15).map((tag) => {
            // 根据文章数量计算标签大小
            const size = Math.min(Math.max(tag.post_count, 1), 5);
            const sizeClasses = {
              1: 'text-xs',
              2: 'text-sm',
              3: 'text-base',
              4: 'text-lg',
              5: 'text-xl'
            };
            
            return (
              <Link
                key={tag.id}
                href={`/tags/${tag.slug}`}
                className={`inline-block px-2 py-1 text-gray-600 hover:text-blue-600 transition-colors ${sizeClasses[size as keyof typeof sizeClasses]}`}
                style={{ 
                  opacity: 0.6 + (size * 0.1),
                  fontWeight: 300 + (size * 100)
                }}
              >
                #{tag.name}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}