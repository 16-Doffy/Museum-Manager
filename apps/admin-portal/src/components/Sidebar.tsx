import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const navItems = [
  { href: '/', label: 'Tổng quan' },
  { href: '/museums', label: 'Bảo tàng' },
  { href: '/revenue', label: 'Doanh số' },
  { href: '/users', label: 'Quản lý người dùng' },
];

export function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Still navigate to login even if logout API fails
      navigate('/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <aside className="h-screen sticky top-0 w-[250px] border-r border-gray-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 flex flex-col">
      <div className="flex-1 px-4 py-6">
        <div className="mb-6">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center shadow-md">
            <span className="text-white text-lg font-bold">A</span>
          </div>
          <div className="mt-3">
            <h1 className="text-lg font-semibold tracking-tight text-gray-900">Admin Portal</h1>
            <p className="text-xs text-gray-500">Museum Manager</p>
          </div>
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === '/'}
              className={({ isActive }) =>
                `group flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all ${isActive
                  ? 'bg-gray-100 text-gray-900 shadow-sm ring-1 ring-gray-200'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`h-1.5 w-1.5 rounded-full transition-colors ${isActive ? 'bg-indigo-600' : 'bg-gray-300 group-hover:bg-gray-400'
                      }`}
                  ></span>
                  {item.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* User info and logout */}
      <div className="px-4 py-4 border-t border-gray-200">
        <div className="mb-3">
          <p className="text-sm font-medium text-gray-900">{user?.name}</p>
          <p className="text-xs text-gray-500">{user?.email}</p>
          <p className="text-xs text-indigo-600 font-medium mt-1">{user?.role}</p>
        </div>
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoggingOut ? (
            <>
              <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
              Đang đăng xuất...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Đăng xuất
            </>
          )}
        </button>
      </div>
    </aside>
  );
}

