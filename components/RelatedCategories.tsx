import Link from 'next/link';
import { CategoryDetail } from '@/lib/categories';

interface RelatedCategoriesProps {
  categories: CategoryDetail[];
  currentCategoryId: string;
}

export default function RelatedCategories({ categories, currentCategoryId }: RelatedCategoriesProps) {
  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">相关分类</h3>
      
      <div className="space-y-3">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/categories/${category.slug}`}
            className="block p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">{category.name}</h4>
                {category.description && (
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {category.description}
                  </p>
                )}
              </div>
              <div className="ml-3 flex-shrink-0">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {category.post_count}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <Link
          href="/categories"
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          查看所有分类 →
        </Link>
      </div>
    </div>
  );
}