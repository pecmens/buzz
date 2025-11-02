import { notFound } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminRoute from '@/components/admin/AdminRoute';
import PostEditor from '@/components/admin/PostEditor';
import { getAdminPost } from '@/lib/admin-posts';

interface EditPostPageProps {
  params: {
    id: string;
  };
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const post = await getAdminPost(params.id);

  if (!post) {
    notFound();
  }

  return (
    <AdminRoute>
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">编辑文章</h1>
            <p className="mt-1 text-sm text-gray-500">
              编辑文章 &ldquo;{post.title}&rdquo;
            </p>
          </div>
          
          <PostEditor post={post} isEdit={true} />
        </div>
      </AdminLayout>
    </AdminRoute>
  );
}