import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useSidebar } from '@/components/ui/sidebar';
import routes from '@/config/routes';
import { useAuthStore } from '@/stores/auth-store';
import { Building2, ChevronRight, Gavel, Gift, Home, LogOut, LucideIcon, TicketCheck, Users, Wallet } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { cn } from '../../../lib/cn';

const navItems = [
  {
    title: 'Dashboard',
    url: routes.dashboard,
    icon: Home,
    items: [],
  },
  {
    title: 'Quản lý bảo tàng',
    url: routes.museums.list,
    icon: Building2,
    items: [
      {
        title: 'Danh sách bảo tàng',
        url: routes.museums.list,
        icon: Building2,
      },
      {
        title: 'Phê duyệt bảo tàng',
        url: routes.museums.requests,
        icon: Gavel,
      },
    ],
  },
  {
    title: 'Quản lý người dùng',
    url: routes.users,
    icon: Users,
    items: [],
  },
  {
    title: 'Quản lý quyền',
    url: routes.rolebase.roles,
    icon: Gavel,
    items: [
      {
        title: 'Vai trò',
        url: routes.rolebase.roles,
        icon: Gavel,
      },
      {
        title: 'Quyền',
        url: routes.rolebase.permissions,
        icon: Gavel,
      },
    ],
  },
  {
    title: 'Quản lý thanh toán',
    url: routes.payments.orders,
    icon: Wallet,
    items: [
      {
        title: 'Danh sách đơn hàng',
        url: routes.payments.orders,
        icon: Wallet,
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
        icon: Wallet,
      },
    ],
  },
];

export default function AdminSidebar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { open } = useSidebar();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      toast.success('Đăng xuất thành công');
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      navigate('/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <aside
      className={cn(
        'h-screen sticky top-0 border-r border-sidebar-border bg-sidebar flex flex-col transition-all duration-300',
        open ? 'w-64' : 'w-0 overflow-hidden'
      )}
    >
      {/* Header */}
      <div className="px-4 py-6 border-b border-sidebar-border">
        <Link to={routes.dashboard} className="flex items-center gap-3">
          <div className="flex aspect-square size-10 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground shadow-md">
            <Building2 className="size-5" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold text-sidebar-foreground">MuseTrip360</span>
            <span className="truncate text-xs text-sidebar-foreground/70">Admin Portal</span>
          </div>
        </Link>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-4 overflow-y-auto">
        <div className="space-y-1">
          <div className="text-xs font-semibold text-sidebar-foreground/60 px-3 py-2">Quản lý chính</div>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.title} item={item} />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-sidebar-border">
        {user && (
          <div className="mb-3 px-3">
            <p className="text-sm font-medium text-sidebar-foreground truncate">{user.name}</p>
            <p className="text-xs text-sidebar-foreground/70 truncate">{user.email}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoggingOut ? (
            <>
              <div className="w-5 h-5 border-2 border-destructive border-t-transparent rounded-full animate-spin"></div>
              <span>Đang đăng xuất...</span>
            </>
          ) : (
            <>
              <LogOut className="w-5 h-5" />
              <span>Đăng xuất</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}

interface SidebarMenuItemProps {
  item: {
    title: string;
    url: string;
    icon?: LucideIcon;
    items?: {
      title: string;
      url: string;
      icon?: LucideIcon;
    }[];
  };
}

function SidebarMenuItem({ item }: SidebarMenuItemProps) {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (location.pathname === '/') {
      setIsOpen(true);
      return;
    }
    if (item.items?.some((subItem) => location.pathname.includes(subItem.url))) {
      setIsOpen(true);
    }
  }, [location, item]);

  // If no sub-items, render simple link
  if (!item.items || item.items.length === 0) {
    const isActive = location.pathname === item.url;

    return (
      <Link
        to={item.url}
        className={cn(
          'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all',
          isActive
            ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-sm'
            : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
        )}
      >
        {item.icon && (
          <item.icon
            className={cn(
              'h-5 w-5 transition-colors',
              isActive ? 'text-sidebar-accent-foreground' : 'text-sidebar-foreground/70'
            )}
          />
        )}
        <span>{item.title}</span>
      </Link>
    );
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground transition-all">
          {item.icon && <item.icon className="h-5 w-5 text-sidebar-foreground/70" />}
          <span className="flex-1 text-left">{item.title}</span>
          <ChevronRight className={cn('h-4 w-4 transition-transform duration-200', isOpen && 'rotate-90')} />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-1">
        <div className="ml-8 space-y-1">
          {item.items?.map((subItem) => {
            const isActive = location.pathname === subItem.url;

            return (
              <Link
                key={subItem.url}
                to={subItem.url}
                className={cn(
                  'flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition-all',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                    : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
                )}
              >
                {subItem.icon && <subItem.icon className="h-4 w-4" />}
                <span>{subItem.title}</span>
              </Link>
            );
          })}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
