import { notFound } from 'next/navigation';
import { getTagBySlug, getTagPosts, getRelatedTags } from '@/lib/tags';
import { supabase } from '@/lib/supabase';
import TagHeader from '@/components/TagHeader';
import TagPosts from '@/components/TagPosts';
import RelatedTags from '@/components/RelatedTags';

interface TagPageProps {
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
    const { data: tags } = await supabase
      .from('tags')
      .select('slug');

    return tags?.map((tag) => ({
      slug: tag.slug,
    })) || [];
  } catch (error) {
    console.error('生成标签静态路径失败:', error);
    return [];
  }
}

export default async function TagPage({ params, searchParams }: TagPageProps) {
  const { slug } = params;
  const page = parseInt(searchParams.page || '1');
  const sortBy = searchParams.sort || 'date';

  // 获取标签详情
  const tag = await getTagBySlug(slug);
  
  if (!tag) {
    notFound();
  }

  // 获取标签文章
  const { posts, total } = await getTagPosts(slug, page, 10, sortBy);
  
  // 获取相关标签
  const relatedTags = await getRelatedTags(tag.id);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* 标签头部信息 */}
        <TagHeader tag={tag} />

        <div className="mt-8 flex flex-col lg:flex-row gap-8">
          {/* 主要内容区域 */}
          <div className="lg:w-3/4">
            <TagPosts
              posts={posts}
              total={total}
              currentPage={page}
              sortBy={sortBy}
              tagSlug={slug}
            />
          </div>

          {/* 侧边栏 */}
          <div className="lg:w-1/4">
            <RelatedTags
              tags={relatedTags}
              currentTagId={tag.id}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// 生成页面元数据
export async function generateMetadata({ params }: TagPageProps) {
  const tag = await getTagBySlug(params.slug);
  
  if (!tag) {
    return {
      title: '标签不存在',
    };
  }

  return {
    title: `${tag.name} - 标签文章`,
    description: `浏览标签 ${tag.name} 下的所有文章，共 ${tag.post_count} 篇`,
  };
}