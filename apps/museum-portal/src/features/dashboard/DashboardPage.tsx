import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAreas, useArtifacts, useDisplayPositions, useArtifactStats, useStaffStats } from '../../lib/api/hooks';
import { Users, MapPin, Package, TrendingUp, BarChart3 } from 'lucide-react';
import { useAuthStore } from '../../stores/auth-store';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalVisitors: 0,
    totalArtifacts: 0,
    totalAreas: 0,
    activeAreas: 0,
  });

  // Memoize search params to prevent infinite re-renders
  const searchParams = useMemo(() => ({ pageIndex: 1, pageSize: 100 }), []);
  const { user } = useAuthStore();
  const { areas } = useAreas(searchParams);
  const { artifacts } = useArtifacts(searchParams);
  const { displayPositions } = useDisplayPositions(searchParams);
  
  // Check user role - Admin can access dashboard stats APIs
  const userRole = (user as any)?.role?.name || (user as any)?.role || '';
  const isAdmin = userRole === 'Admin' || userRole === 'admin';
  
  // Dashboard stats APIs (Admin only)
  const { stats: artifactStats, loading: artifactStatsLoading, error: artifactStatsError } = useArtifactStats();
  const { stats: staffStats, loading: staffStatsLoading, error: staffStatsError } = useStaffStats();

  // Visitors API not available yet - disabled
  // const { visitors } = useVisitors(searchParams);

  useEffect(() => {
    // Use API stats if available (Admin), otherwise fallback to basic counts
    const artifactCount = artifactStats?.totalArtifacts ?? artifacts?.length ?? 0;
    
    setStats({
      totalVisitors: 0, // Visitors API not available
      totalArtifacts: artifactCount,
      totalAreas: areas?.length || 0,
      // API không có trạng thái khu vực; tính theo số vị trí trưng bày đang hoạt động
      activeAreas: displayPositions?.filter((p: any) => p.isActive || p.status === 'Active').length || 0,
    });
  }, [areas, artifacts, displayPositions, artifactStats]);

  // Build stat cards based on role
  const baseStatCards = [
    {
      title: 'Tổng khách tham quan',
      value: stats.totalVisitors.toLocaleString(),
      icon: Users,
      color: 'emerald',
      bgColor: 'bg-emerald-100',
      textColor: 'text-emerald-600',
    },
    {
      title: 'Hiện vật',
      value: stats.totalArtifacts.toLocaleString(),
      icon: Package,
      color: 'blue',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
    },
    {
      title: 'Khu vực',
      value: stats.totalAreas.toLocaleString(),
      icon: MapPin,
      color: 'purple',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600',
    },
    {
      title: 'Khu vực hoạt động',
      value: stats.activeAreas.toLocaleString(),
      icon: TrendingUp,
      color: 'green',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
    },
  ];

  // Admin-specific stats cards
  const adminStatCards = isAdmin && artifactStats ? [
    ...baseStatCards,
    {
      title: 'Hiện vật đang trưng bày',
      value: (artifactStats.onDisplayArtifacts || 0).toLocaleString(),
      icon: BarChart3,
      color: 'indigo',
      bgColor: 'bg-indigo-100',
      textColor: 'text-indigo-600',
    },
    {
      title: 'Hiện vật trong kho',
      value: (artifactStats.inStorageArtifacts || 0).toLocaleString(),
      icon: Package,
      color: 'amber',
      bgColor: 'bg-amber-100',
      textColor: 'text-amber-600',
    },
  ] : baseStatCards;

  const statCards = adminStatCards;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Tổng quan hệ thống quản lý bảo tàng</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
                  <p className={`text-2xl font-bold ${stat.textColor} mt-1`}>
                    {stat.value}
                  </p>
                </div>
                <div className={`w-12 h-12 ${stat.bgColor} rounded-full flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Admin Dashboard Stats Section */}
      {isAdmin && artifactStats && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Thống kê Hiện vật (Admin)</h2>
          {artifactStatsLoading ? (
            <p className="text-gray-500">Đang tải...</p>
          ) : artifactStatsError ? (
            <p className="text-red-500">Lỗi: {artifactStatsError}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-500">Tổng hiện vật</p>
                <p className="text-2xl font-bold text-gray-900">{artifactStats.totalArtifacts?.toLocaleString() || 0}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Hiện vật hoạt động</p>
                <p className="text-2xl font-bold text-green-600">{artifactStats.activeArtifacts?.toLocaleString() || 0}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Hiện vật không hoạt động</p>
                <p className="text-2xl font-bold text-red-600">{artifactStats.inactiveArtifacts?.toLocaleString() || 0}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Đang trưng bày</p>
                <p className="text-2xl font-bold text-blue-600">{artifactStats.onDisplayArtifacts?.toLocaleString() || 0}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Trong kho</p>
                <p className="text-2xl font-bold text-amber-600">{artifactStats.inStorageArtifacts?.toLocaleString() || 0}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Bảo trì</p>
                <p className="text-2xl font-bold text-orange-600">{artifactStats.maintenanceArtifacts?.toLocaleString() || 0}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Staff Stats Section (Admin only) */}
      {isAdmin && staffStats && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Thống kê Nhân viên (Admin)</h2>
          {staffStatsLoading ? (
            <p className="text-gray-500">Đang tải...</p>
          ) : staffStatsError ? (
            <p className="text-red-500">Lỗi: {staffStatsError}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-500">Tổng nhân viên</p>
                <p className="text-2xl font-bold text-gray-900">{staffStats.totalStaff?.toLocaleString() || 0}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Nhân viên hoạt động</p>
                <p className="text-2xl font-bold text-green-600">{staffStats.activeStaff?.toLocaleString() || 0}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Nhân viên không hoạt động</p>
                <p className="text-2xl font-bold text-red-600">{staffStats.inactiveStaff?.toLocaleString() || 0}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Museum Info */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Thông tin Bảo tàng</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Tên bảo tàng</p>
              <p className="text-lg text-gray-900">{(user as any)?.museum?.name || (user as any)?.museumName || '—'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Địa chỉ</p>
              <p className="text-lg text-gray-900">{(user as any)?.museum?.address || (user as any)?.museumLocation || '—'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Giờ mở cửa</p>
              <p className="text-lg text-gray-900">8:00 - 17:00 (Thứ 2 - Chủ nhật)</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Tổng hiện vật</p>
              <p className="text-lg text-gray-900">{stats.totalArtifacts.toLocaleString()} hiện vật</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Khu vực trưng bày</p>
              <p className="text-lg text-gray-900">{stats.totalAreas.toLocaleString()} khu vực</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Trạng thái</p>
              <p className={`text-lg font-medium ${stats.activeAreas > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.activeAreas > 0 ? 'Đang hoạt động' : 'Không hoạt động'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: 'Thêm hiện vật mới',
              subtitle: 'Quản lý bộ sưu tập',
              icon: Package,
              iconClasses: 'w-5 h-5 text-blue-600',
              iconWrapper: 'w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center',
              to: '/artifacts',
            },
            {
              title: 'Quản lý khu vực',
              subtitle: 'Thiết lập vị trí trưng bày',
              icon: MapPin,
              iconClasses: 'w-5 h-5 text-purple-600',
              iconWrapper: 'w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center',
              to: '/areas',
            },
            {
              title: 'Khách tham quan',
              subtitle: 'Theo dõi lượt truy cập',
              icon: Users,
              iconClasses: 'w-5 h-5 text-emerald-600',
              iconWrapper: 'w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center',
              to: '/visitors',
            },
          ].map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.title}
                type="button"
                onClick={() => navigate(action.to)}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <div className="flex items-center space-x-3">
                  <div className={action.iconWrapper}>
                    <Icon className={action.iconClasses} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{action.title}</p>
                    <p className="text-sm text-gray-500">{action.subtitle}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
