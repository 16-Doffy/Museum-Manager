import routes from '@/config/routes';
import { Building2, Gavel, Gift, Home, TicketCheck, Users, Wallet } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../../lib/cn';

const navItems = [
  {
    title: 'Dashboard',
    url: routes.dashboard,
    icon: Home,
  },
  {
    title: 'Quản lý bảo tàng',
    icon: Building2,
    children: [
      {
        title: 'Danh sách bảo tàng',
        url: routes.museums.list,
      },
      {
        title: 'Phê duyệt bảo tàng',
        url: routes.museums.requests,
      },
    ],
  },
  {
    title: 'Quản lý người dùng',
    url: routes.users,
    icon: Users,
  },
  {
    title: 'Quản lý quyền',
    icon: Gavel,
    children: [
      {
        title: 'Vai trò',
        url: routes.rolebase.roles,
      },
      {
        title: 'Quyền',
        url: routes.rolebase.permissions,
      },
    ],
  },
  {
    title: 'Quản lý thanh toán',
    icon: Wallet,
    children: [
      {
        title: 'Danh sách đơn hàng',
        url: routes.payments.orders,
      },
      {
        title: 'Danh sách gói',
        url: routes.payments.plans,
        icon: Gift,
      },
      {
        title: 'Danh sách đăng ký',
        url: routes.payments.subscriptions,
        icon: TicketCheck,
      },
      {
        title: 'Danh sách rút tiền',
        url: routes.payments.payouts,
      },
    ],
  },
];

export default function AdminSidebar() {
  const location = useLocation();

  return (
    <aside className="h-screen sticky top-0 w-64 border-r border-gray-200 bg-white flex flex-col">
      <div className="flex-1 px-4 py-6 overflow-y-auto">
        {/* Logo */}
        <div className="mb-6">
          <div className="h-12 w-12 rounded-2xl bg-linear-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center shadow-md">
            <span className="text-white text-lg font-bold">M</span>
          </div>
          <div className="mt-3">
            <h1 className="text-lg font-semibold tracking-tight text-gray-900">MuseTrip360</h1>
            <p className="text-xs text-gray-500">Admin Portal</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavItem key={item.title} item={item} location={location} />
          ))}
        </nav>
      </div>
    </aside>
  );
}

interface NavItemProps {
  item: {
    title: string;
    url?: string;
    icon?: React.ElementType;
    children?: { title: string; url: string; icon?: React.ElementType }[];
  };
  location: ReturnType<typeof useLocation>;
}

function NavItem({ item, location }: NavItemProps) {
  const Icon = item.icon;

  // If no children, render simple link
  if (!item.children || item.children.length === 0) {
    const isActive = location.pathname === item.url;

    return (
      <Link
        to={item.url || '#'}
        className={cn(
          'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all',
          isActive
            ? 'bg-indigo-50 text-indigo-700 shadow-sm'
            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
        )}
      >
        {Icon && (
          <Icon
            className={cn('h-5 w-5 transition-colors', isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-600')}
          />
        )}
        {item.title}
      </Link>
    );
  }

  // If has children, render collapsible menu
  const isAnyChildActive = item.children.some((child) => location.pathname.startsWith(child.url));

  return (
    <div>
      <div
        className={cn(
          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all',
          isAnyChildActive ? 'text-indigo-700' : 'text-gray-700'
        )}
      >
        {Icon && <Icon className={cn('h-5 w-5', isAnyChildActive ? 'text-indigo-600' : 'text-gray-400')} />}
        {item.title}
      </div>
      <div className="ml-8 mt-1 space-y-1">
        {item.children.map((child) => {
          const isActive = location.pathname === child.url;
          const ChildIcon = child.icon;

          return (
            <Link
              key={child.url}
              to={child.url}
              className={cn(
                'group flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition-all',
                isActive
                  ? 'bg-indigo-50 text-indigo-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              {ChildIcon && <ChildIcon className="h-4 w-4" />}
              {child.title}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
