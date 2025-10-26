import { SidebarTrigger } from '@/components/ui/sidebar';
import { LogOut } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuthStore } from '../../../stores/auth-store';

export default function Header() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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
    <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border bg-card px-4 lg:px-6">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <h1 className="text-lg font-semibold text-card-foreground">Admin Portal</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-foreground">{user?.name}</p>
            <p className="text-xs text-muted-foreground">{user?.role}</p>
          </div>

          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoggingOut ? (
              <>
                <div className="w-4 h-4 border-2 border-destructive border-t-transparent rounded-full animate-spin"></div>
                <span className="hidden sm:inline">Đang đăng xuất...</span>
              </>
            ) : (
              <>
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Đăng xuất</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}