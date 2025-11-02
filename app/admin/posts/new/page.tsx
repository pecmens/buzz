import AdminLayout from '@/components/admin/AdminLayout';
import AdminRoute from '@/components/admin/AdminRoute';
import PostEditor from '@/components/admin/PostEditor';

export default function NewPostPage() {
  return (
    <AdminRoute>
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">创建新文章</h1>
            <p className="mt-1 text-sm text-gray-500">
              创建一篇新的博客文章，支持 Markdown 格式。
            </p>
          </div>
          
          <PostEditor />
        </div>
      </AdminLayout>
    </AdminRoute>
  );
}