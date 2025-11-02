import { notFound } from 'next/navigation';
import { getCategoryBySlug, getCategoryPosts, getRelatedCategories } from '@/lib/categories';
import { supabase } from '@/lib/supabase';
import CategoryHeader from '@/components/CategoryHeader';
import CategoryPosts from '@/components/CategoryPosts';
import RelatedCategories from '@/components/RelatedCategories';

interface CategoryPageProps {
  params: {
    slug: string;
  };
  searchParams: {
    page?: string;
    sort?: 'date' | 'views';
  };
}

// 生成静态路径
export async function generateStaticParams() {
  try {
    const { data: categories } = await supabase
      .from('categories')
      .select('slug');

    return categories?.map((category) => ({
      slug: category.slug,
    })) || [];
  } catch (error) {
    console.error('生成分类静态路径失败:', error);
    return [];
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = params;
  const page = parseInt(searchParams.page || '1');
  const sortBy = searchParams.sort || 'date';

  // 获取分类详情
  const category = await getCategoryBySlug(slug);
  
  if (!category) {
    notFound();
  }

  // 获取分类文章
  const { posts, total } = await getCategoryPosts(slug, page, 10, sortBy);
  
  // 获取相关分类
  const relatedCategories = await getRelatedCategories(category.id);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* 分类头部信息 */}
        <CategoryHeader category={category} />

        <div className="mt-8 flex flex-col lg:flex-row gap-8">
          {/* 主要内容区域 */}
          <div className="lg:w-3/4">
            <CategoryPosts
              posts={posts}
              total={total}
              currentPage={page}
              sortBy={sortBy}
              categorySlug={slug}
            />
          </div>

          {/* 侧边栏 */}
          <div className="lg:w-1/4">
            <RelatedCategories
              categories={relatedCategories}
              currentCategoryId={category.id}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// 生成页面元数据
export async function generateMetadata({ params }: CategoryPageProps) {
  const category = await getCategoryBySlug(params.slug);
  
  if (!category) {
    return {
      title: '分类不存在',
    };
  }

  return {
    title: `${category.name} - 分类文章`,
    description: category.description || `浏览 ${category.name} 分类下的所有文章`,
  };
}