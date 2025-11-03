import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  FiHome, 
  FiArchive, 
  FiUsers, 
  FiEye,
  FiMapPin,
  FiMessageSquare,
} from "react-icons/fi";
import type { IconType } from "react-icons";
import { cn } from "../../lib/utils";
import { useAuthStore } from "../../stores/auth-store";
import { useMuseum } from "../../lib/api/hooks";

interface NavItem {
  id: string;
  label: string;
  icon: IconType;
  href: string;
}

const navigationItems: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: FiHome,
    href: "/dashboard",
  },
  {
    id: "areas",
    label: "Khu vực",
    icon: FiMapPin,
    href: "/areas",
  },
  {
    id: "artifacts",
    label: "Hiện vật",
    icon: FiArchive,
    href: "/artifacts",
  },
  {
    id: "display-positions",
    label: "Vị trí trưng bày",
    icon: FiEye,
    href: "/display-positions",
  },
  {
    id: "visitors",
    label: "Khách tham quan",
    icon: FiUsers,
    href: "/visitors",
  },
  {
    id: "interactions",
    label: "Tương tác",
    icon: FiMessageSquare,
    href: "/interactions",
  },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  const { museum } = useMuseum(user?.museumId || '');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleItemClick = useCallback((href: string) => {
    navigate(href);
  }, [navigate]);

  const isActive = (href: string) => {
    if (!mounted) return false;
    return location.pathname === href || location.pathname.startsWith(href + "/");
  };

  const renderNavItem = (item: NavItem) => {
    const IconComponent = item.icon;
    const active = isActive(item.href);

    return (
      <div
        key={item.id}
        onClick={() => handleItemClick(item.href)}
        className={cn(
          "flex items-center gap-3 px-4 py-3 mx-2 rounded-lg cursor-pointer transition-all duration-200 group hover:bg-slate-700 hover:text-white",
          active && 'bg-emerald-600 text-white shadow-sm'
        )}
      >
        <IconComponent className={cn(
          "w-5 h-5 transition-colors",
          active ? 'text-white' : 'text-slate-300 group-hover:text-white'
        )} />
        <span className={cn(
          "font-medium transition-colors",
          active ? 'text-white' : 'text-slate-200 group-hover:text-white'
        )}>
          {item.label}
        </span>
      </div>
    );
  };

  return (
    <aside className="w-72 bg-slate-800 shadow-xl border-r border-slate-700 flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
            <FiArchive className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-emerald-400">{user?.museum?.name || museum?.name || 'Museum Portal'}</h1>
            <p className="text-sm text-slate-300">Quản lý bảo tàng • {user?.role || ''}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navigationItems.map(item => renderNavItem(item))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center gap-3 p-3 bg-slate-700 rounded-lg">
          <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {user?.name?.charAt(0) || 'U'}
            </span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-emerald-400">
              {user?.name || 'Museum Staff'}
            </p>
            <p className="text-xs text-slate-300">
              {user?.role || 'Staff'} • {user?.email || 'staff@museum.com'}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}