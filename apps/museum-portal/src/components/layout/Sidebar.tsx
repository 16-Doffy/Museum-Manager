"use client";

import { useState } from "react";
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
  FiEye
} from "react-icons/fi";
import type { IconType } from "react-icons";
import { cn } from "@/lib/utils";

interface NavItem {
  id: string;
  label: string;
  icon: IconType;
  href?: string;
  children?: NavItem[];
}

const navigationItems: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: FiHome,
    href: "/dashboard"
  },
  {
    id: "collections",
    label: "Bộ sưu tập",
    icon: FiArchive,
    href: "/collections"
  },
  {
    id: "events",
    label: "Sự kiện",
    icon: FiCalendar,
    href: "/events"
  },
  {
    id: "visitors",
    label: "Khách tham quan",
    icon: FiEye,
    href: "/visitors"
  },
  {
    id: "tickets",
    label: "Quản lý vé",
    icon: FiCreditCard,
    href: "/tickets"
  },
  {
    id: "reports",
    label: "Báo cáo",
    icon: FiBarChart,
    href: "/reports"
  },
  {
    id: "personnel",
    label: "Nhân viên",
    icon: FiUsers,
    href: "/personnel"
  },
  {
    id: "settings",
    label: "Tạo sự kiện",
    icon: FiSettings,
    href: "/settings"
  }
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const handleItemClick = (item: NavItem) => {
    if (item.href) {
      router.push(item.href);
    } else if (item.children) {
      setExpandedItems(prev => 
        prev.includes(item.id) 
          ? prev.filter(id => id !== item.id)
          : [...prev, item.id]
      );
    }
  };

  const isActive = (href?: string) => {
    if (!href) return false;
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
          className={cn(
            "flex items-center justify-between px-4 py-3 mx-2 rounded-lg cursor-pointer transition-all duration-200 group",
            "hover:bg-slate-700 hover:text-white",
            level > 0 && "ml-6",
            active && "bg-emerald-600 text-white shadow-sm"
          )}
        >
          <div className="flex items-center gap-3">
            <IconComponent className={cn(
              "w-5 h-5 transition-colors",
              active ? "text-white" : "text-slate-300 group-hover:text-white"
            )} />
            <span className={cn(
              "font-medium transition-colors",
              active ? "text-white" : "text-slate-200 group-hover:text-white"
            )}>
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
            <span className="text-white text-sm font-medium">A</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-emerald-400">Museum Staff</p>
            <p className="text-xs text-slate-300">staff@museum.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
