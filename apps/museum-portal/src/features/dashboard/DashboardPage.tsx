import { useState, useEffect, useMemo } from 'react';
import { useAreas, useArtifacts, useVisitors } from '../../lib/api/hooks';
import { Users, MapPin, Package, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalVisitors: 0,
    totalArtifacts: 0,
    totalAreas: 0,
    activeAreas: 0,
  });

  // Memoize search params to prevent infinite re-renders
  const searchParams = useMemo(() => ({ pageIndex: 1, pageSize: 100 }), []);
  
  const { areas } = useAreas(searchParams);
  const { artifacts } = useArtifacts(searchParams);
  const { visitors } = useVisitors(searchParams);

  useEffect(() => {
    setStats({
      totalVisitors: visitors?.length || 0,
      totalArtifacts: artifacts?.length || 0,
      totalAreas: areas?.length || 0,
      activeAreas: areas?.filter(area => area.isActive).length || 0,
    });
  }, [areas, artifacts, visitors]);

  const statCards = [
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

      {/* Museum Info */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Thông tin Bảo tàng</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Tên bảo tàng</p>
              <p className="text-lg text-gray-900">Bảo tàng Lịch sử Việt Nam</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Địa chỉ</p>
              <p className="text-lg text-gray-900">1 Tràng Tiền, Hoàn Kiếm, Hà Nội</p>
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
              <p className="text-lg text-green-600 font-medium">Đang hoạt động</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Thêm hiện vật mới</p>
                <p className="text-sm text-gray-500">Quản lý bộ sưu tập</p>
              </div>
            </div>
          </button>
          
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Quản lý khu vực</p>
                <p className="text-sm text-gray-500">Thiết lập vị trí trưng bày</p>
              </div>
            </div>
          </button>
          
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Khách tham quan</p>
                <p className="text-sm text-gray-500">Theo dõi lượt truy cập</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
