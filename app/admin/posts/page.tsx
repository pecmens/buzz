import AdminLayout from '@/components/admin/AdminLayout';
import AdminRoute from '@/components/admin/AdminRoute';
import PostsList from '@/components/admin/PostsList';

export default function AdminPostsPage() {
  return (
    <AdminRoute>
      <AdminLayout>
        <PostsList />
      </AdminLayout>
    </AdminRoute>
  );
}