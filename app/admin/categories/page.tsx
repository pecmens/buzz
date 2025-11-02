import AdminLayout from '@/components/admin/AdminLayout';
import AdminRoute from '@/components/admin/AdminRoute';
import CategoriesManager from '@/components/admin/CategoriesManager';

export default function AdminCategoriesPage() {
  return (
    <AdminRoute>
      <AdminLayout>
        <CategoriesManager />
      </AdminLayout>
    </AdminRoute>
  );
}