import AdminLayout from '@/components/admin/AdminLayout';
import AdminRoute from '@/components/admin/AdminRoute';
import TagsManager from '@/components/admin/TagsManager';

export default function AdminTagsPage() {
  return (
    <AdminRoute>
      <AdminLayout>
        <TagsManager />
      </AdminLayout>
    </AdminRoute>
  );
}