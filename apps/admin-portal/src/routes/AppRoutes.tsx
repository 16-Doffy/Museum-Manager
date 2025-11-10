import Error from '@/components/common';
import ScrollToTop from '@/components/ScrollToTop';
import { AdminDashboard, SubscriptionAdminPage } from '@/features/admin';
import AuthPage from '@/features/auth/AuthPage';
import NotPermittedPage from '@/features/auth/NotPermittedPage';
import { MuseumApprovalPage, MuseumDetailPage, MuseumsPage } from '@/features/museum';
import { OrderListPage, PayoutListPage, PlanListPage, SubscriptionListPage } from '@/features/payment';
import { RoleDetailPage, RolePage } from '@/features/rolebase';
import { AccountDetailPage, UsersPage } from '@/features/users';
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
          <Route path="museums/approval" element={<MuseumApprovalPage />} />

          {/* Manager Subscription */}
          <Route path="subscription" element={<SubscriptionAdminPage />} />

          {/* User Management */}
          <Route path="users" element={<UsersPage />} />
          <Route path="users/:id" element={<AccountDetailPage />} />

          {/* Role-based Access Control */}
          <Route path="roles" element={<RolePage />} />
          <Route path="roles/:id" element={<RoleDetailPage />} />

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