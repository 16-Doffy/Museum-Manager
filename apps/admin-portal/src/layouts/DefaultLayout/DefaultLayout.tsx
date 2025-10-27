import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth-store';
import Header from '../components/Header';
import AdminSidebar from '../components/Sidebar';

export default function DefaultLayout() {
  const { user, isAuthenticated, isLoading, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
          <p className="text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user is SuperAdmin
  if (user?.role !== 'SuperAdmin') {
    return <Navigate to="/not-permitted" replace />;
  }

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <Header />
        <div className="flex flex-1 flex-col">
          <div className="flex flex-1 flex-col gap-2">
            <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:py-6">
              <Outlet />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}