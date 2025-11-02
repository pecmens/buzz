import AdminLayout from '@/components/admin/AdminLayout';
import AdminRoute from '@/components/admin/AdminRoute';
import CommentsManager from '@/components/admin/CommentsManager';

export default function AdminCommentsPage() {
  return (
    <AdminRoute>
      <AdminLayout>
        <CommentsManager />
      </AdminLayout>
    </AdminRoute>
  );
}