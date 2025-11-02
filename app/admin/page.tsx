import AdminLayout from '@/components/admin/AdminLayout';
import AdminRoute from '@/components/admin/AdminRoute';
import DashboardStats from '@/components/admin/DashboardStats';
import RecentActivity from '@/components/admin/RecentActivity';

export default function AdminDashboard() {
  return (
    <AdminRoute>
      <AdminLayout>
        <div className="space-y-6">
          {/* 页面标题 */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">仪表板</h1>
            <p className="mt-1 text-sm text-gray-500">
              欢迎回到 Buzz 管理后台，这里是您的博客管理中心。
            </p>
          </div>

          {/* 统计数据 */}
          <DashboardStats />

          {/* 最近活动 */}
          <RecentActivity />
        </div>
      </AdminLayout>
    </AdminRoute>
  );
}