import Error from '@/components/common';
import ScrollToTop from '@/components/ScrollToTop';
import { AdminDashboard, SubscriptionAdminPage } from '@/features/admin';
import AuthPage from '@/features/auth/AuthPage';
import NotPermittedPage from '@/features/auth/NotPermittedPage';
import { MuseumDetailPage, MuseumsPage } from '@/features/museum';
import { OrderListPage, PayoutListPage, PlanListPage, SubscriptionListPage } from '@/features/payment';
import { PermissionPage, RolePage, RolePermissionsPage } from '@/features/rolebase';
import { UsersPage } from '@/features/users';
import DefaultLayout from '@/layouts/DefaultLayout';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<AuthPage />} />
        <Route path="/not-permitted" element={<NotPermittedPage />} />

        {/* Protected Routes */}
        <Route path="/" element={<DefaultLayout />}>
          <Route index element={<AdminDashboard />} />

          {/* Museum Management */}
          <Route path="museums/admin" element={<MuseumsPage />} />
          <Route path="museums/admin/:id" element={<MuseumDetailPage />} />

          {/* Manager Subscription */}
          <Route path="subscription" element={<SubscriptionAdminPage />} />

          {/* User Management */}
          <Route path="users" element={<UsersPage />} />

          {/* Role-based Access Control */}
          <Route path="rolebase/roles" element={<RolePage />} />
          <Route path="rolebase/roles/:roleId/permissions" element={<RolePermissionsPage />} />
          <Route path="rolebase/permissions" element={<PermissionPage />} />

          {/* Payment Management */}
          <Route path="payments/orders" element={<OrderListPage />} />
          <Route path="payments/plans" element={<PlanListPage />} />
          <Route path="payments/subscriptions" element={<SubscriptionListPage />} />
          <Route path="payments/payouts" element={<PayoutListPage />} />
        </Route>

        {/* 404 - Catch all */}
        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
}