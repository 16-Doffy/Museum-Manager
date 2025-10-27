"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { 
  FiBell, 
  FiSearch, 
  FiMenu, 
  FiChevronDown,
  FiUser,
  FiLogOut,
  FiSettings
} from "react-icons/fi";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/contexts/AuthContext";

const getPageTitle = (pathname: string) => {
  const titles: Record<string, string> = {
    "/dashboard": "Tổng quan",
    "/collections": "Quản lý Bộ sưu tập",
    "/areas": "Quản lý Khu vực",
    "/display-positions": "Quản lý Vị trí trưng bày",
    "/visitors": "Quản lý Khách tham quan",
    "/interactions": "Quản lý Tương tác",
    "/events": "Quản lý Sự kiện",
    "/reports": "Báo cáo & Thống kê",
    "/personnel": "Quản lý Nhân viên",
    "/accounts": "Quản lý Tài khoản"
  };
  
  return titles[pathname] || "Museum Management";
};

export default function Topbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const pageTitle = getPageTitle(pathname);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 px-6 py-4 flex justify-between items-center sticky top-0 z-40">

      <div className="flex items-center gap-4">
        <button className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <FiMenu className="w-5 h-5 text-gray-600" />
        </button>
        
        <div>
          <h1 className="text-xl font-semibold text-emerald-600">{pageTitle}</h1>
          <p className="text-sm text-gray-500">Hệ thống quản lý bảo tàng</p>
        </div>
      </div>

      {/* Right side - Search, notifications, user menu */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="block w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-800 placeholder-gray-500"
          />
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
          >
            <FiBell className="w-5 h-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-100">
                <h3 className="font-medium text-gray-900">Thông báo</h3>
              </div>
              <div className="max-h-64 overflow-y-auto">
                <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                  <p className="text-sm font-medium text-gray-900">Sự kiện mới</p>
                  <p className="text-xs text-gray-500">Triển lãm nghệ thuật hiện đại sẽ bắt đầu vào tuần tới</p>
                </div>
                <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                  <p className="text-sm font-medium text-gray-900">Báo cáo doanh thu</p>
                  <p className="text-xs text-gray-500">Doanh thu tháng này tăng 15% so với tháng trước</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user?.name?.charAt(0) || 'A'}
              </span>
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-emerald-600">
                {user?.name || 'Museum Staff'}
              </p>
              <p className="text-xs text-gray-500">
                {user?.role || 'Staff'} • {user?.email || 'staff@museum.com'}
              </p>
            </div>
            <FiChevronDown className="w-4 h-4 text-gray-400" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-emerald-600">
                  {user?.name || 'Museum Staff'}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.email || 'staff@museum.com'}
                </p>
              </div>
              
              <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                <FiUser className="w-4 h-4" />
                Hồ sơ cá nhân
              </button>
              
              <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                <FiSettings className="w-4 h-4" />
                Cài đặt
              </button>
              
              <div className="border-t border-gray-100 mt-2 pt-2">
                <button 
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <FiLogOut className="w-4 h-4" />
                  Đăng xuất
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
