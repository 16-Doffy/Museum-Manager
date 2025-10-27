"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { 
  FiHome, 
  FiArchive, 
  FiCalendar, 
  FiUsers, 
  FiSettings,
  FiChevronDown,
  FiChevronRight,
  FiCreditCard,
  FiBarChart,
  FiEye,
  FiMapPin,
  FiShield,
  FiUserCheck,
  FiTrendingUp
} from "react-icons/fi";
import type { IconType } from "react-icons";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/contexts/AuthContext";
import { UserRole } from "@/lib/api/types";

interface NavItem {
  id: string;
  label: string;
  icon: IconType;
  href?: string;
  children?: NavItem[];
  roles?: UserRole[]; // Roles that can access this item
}

const getNavigationItems = (userRole?: UserRole): NavItem[] => {
  const baseItems: NavItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: FiHome,
      href: "/dashboard",
      roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF]
    },
    {
      id: "collections",
      label: "Bộ sưu tập",
      icon: FiArchive,
      href: "/collections",
      roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF]
    },
    {
      id: "areas",
      label: "Khu vực",
      icon: FiMapPin,
      href: "/areas",
      roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF]
    },
    {
      id: "display-positions",
      label: "Vị trí trưng bày",
      icon: FiEye,
      href: "/display-positions",
      roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF]
    },
    {
      id: "visitors",
      label: "Khách tham quan",
      icon: FiUsers,
      href: "/visitors",
      roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF]
    },
    {
      id: "interactions",
      label: "Tương tác",
      icon: FiTrendingUp,
      href: "/interactions",
      roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF]
    }
  ];

  // SuperAdmin and Admin specific items
  const adminItems: NavItem[] = [
    {
      id: "personnel",
      label: "Nhân viên",
      icon: FiUserCheck,
      href: "/personnel",
      roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN]
    },
    {
      id: "accounts",
      label: "Tài khoản",
      icon: FiShield,
      href: "/accounts",
      roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN]
    }
  ];

  // Manager specific items
  const managerItems: NavItem[] = [
    {
      id: "events",
      label: "Sự kiện",
      icon: FiCalendar,
      href: "/events",
      roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER]
    },
    {
      id: "reports",
      label: "Báo cáo",
      icon: FiBarChart,
      href: "/reports",
      roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER]
    }
  ];

  // Filter items based on user role
  const allItems = [...baseItems, ...adminItems, ...managerItems];
  
  if (!userRole) return baseItems; // Default to basic items if no role
  
  return allItems.filter(item => 
    !item.roles || item.roles.includes(userRole)
  );
};

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Get navigation items based on user role
  const navigationItems = useMemo(() => {
    return getNavigationItems(user?.role);
  }, [user?.role]);

  const handleItemClick = useCallback((item: NavItem) => {
    if (item.href) {
      router.push(item.href);
    } else if (item.children) {
      setExpandedItems(prev => 
        prev.includes(item.id) 
          ? prev.filter(id => id !== item.id)
          : [...prev, item.id]
      );
    }
  }, [router]);

  const isActive = (href?: string) => {
    if (!href || !mounted) return false;
    return pathname === href || pathname.startsWith(href + "/");
  };

  const isExpanded = (id: string) => expandedItems.includes(id);

  const renderNavItem = (item: NavItem, level = 0) => {
    const IconComponent = item.icon;
    const hasChildren = item.children && item.children.length > 0;
    const active = isActive(item.href);
    const expanded = isExpanded(item.id);

    return (
      <div key={item.id}>
        <div
          onClick={() => handleItemClick(item)}
          className={`flex items-center justify-between px-4 py-3 mx-2 rounded-lg cursor-pointer transition-all duration-200 group hover:bg-slate-700 hover:text-white ${level > 0 ? 'ml-6' : ''} ${active ? 'bg-emerald-600 text-white shadow-sm' : ''}`}
        >
          <div className="flex items-center gap-3">
            <IconComponent className={`w-5 h-5 transition-colors ${active ? 'text-white' : 'text-slate-300 group-hover:text-white'}`} />
            <span className={`font-medium transition-colors ${active ? 'text-white' : 'text-slate-200 group-hover:text-white'}`}>
              {item.label}
            </span>
          </div>
          
          {hasChildren && (
            <div className="transition-transform duration-200">
              {expanded ? (
                <FiChevronDown className="w-4 h-4 text-slate-400" />
              ) : (
                <FiChevronRight className="w-4 h-4 text-slate-400" />
              )}
            </div>
          )}
        </div>

        {hasChildren && expanded && (
          <div className="mt-1 space-y-1">
            {item.children!.map(child => renderNavItem(child, level + 1))}
          </div>
        )}
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
            <h1 className="text-xl font-bold text-emerald-400">Museum Portal</h1>
            <p className="text-sm text-slate-300">Quản lý bảo tàng</p>
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
