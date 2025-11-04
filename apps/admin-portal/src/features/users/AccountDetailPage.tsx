import { getErrorMessage } from '@/lib/error-utils';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import DeleteAccountModal from './components/DeleteAccountModal';
import EditAccountModal from './components/EditAccountModal';
import { useAccount } from './hooks/useAccount';
import { useDeleteAccount } from './hooks/useDeleteAccount';
import { useUpdateAccount } from './hooks/useUpdateAccount';
import { UpdateAccountRequest } from './types';

export default function AccountDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { data: account, isLoading, error } = useAccount(id!);
  const updateMutation = useUpdateAccount();
  const deleteMutation = useDeleteAccount();

  const handleUpdate = async (data: UpdateAccountRequest) => {
    if (!account) return;
    try {
      await updateMutation.mutateAsync({ id: account.id, data });
      toast.success('Cập nhật tài khoản thành công');
      setIsEditModalOpen(false);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Không thể cập nhật tài khoản'));
    }
  };

  const handleDelete = async () => {
    if (!account) return;
    try {
      await deleteMutation.mutateAsync(account.id);
      toast.success('Xóa tài khoản thành công');
      setIsDeleteModalOpen(false);
      // Don't navigate, stay on page - account will auto-update to Inactive
    } catch (error) {
      toast.error(getErrorMessage(error, 'Không thể xóa tài khoản'));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-chart-2/10 text-chart-2 border-chart-2/20';
      case 'Inactive':
        return 'bg-muted text-muted-foreground border-border';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
          <p className="text-sm text-muted-foreground">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error || !account) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-flex h-16 w-16 rounded-full bg-destructive/10 items-center justify-center mb-4">
            <svg className="h-8 w-8 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-sm font-medium text-foreground mb-1">Không tìm thấy tài khoản</p>
          <p className="text-xs text-muted-foreground mb-4">
            {error instanceof Error ? error.message : 'Tài khoản không tồn tại hoặc đã bị xóa'}
          </p>
          <button
            onClick={() => navigate('/users')}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={() => navigate('/users')}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Chi tiết tài khoản</h1>
          </div>
          <p className="text-muted-foreground ml-8">Thông tin chi tiết về tài khoản</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all shadow-sm hover:shadow font-medium"
          >
            Chỉnh sửa
          </button>
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="px-4 py-2 rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all shadow-sm hover:shadow font-medium"
          >
            Xóa
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic Information */}
        <div className="rounded-xl border border-border bg-card shadow-sm p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Thông tin cơ bản</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground">Email</label>
              <p className="text-sm font-medium text-foreground mt-1">{account.email}</p>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Họ và tên</label>
              <p className="text-sm font-medium text-foreground mt-1">{account.fullName}</p>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Mật khẩu</label>
              <p className="text-sm font-medium text-foreground mt-1">••••••••</p>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Trạng thái</label>
              <div className="mt-1">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(account.status)}`}
                >
                  {account.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Role & Museum */}
        <div className="rounded-xl border border-border bg-card shadow-sm p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Vai trò & Bảo tàng</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground">Vai trò</label>
              <p className="text-sm font-medium text-foreground mt-1">{account.roleName}</p>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Bảo tàng</label>
              <p className="text-sm font-medium text-foreground mt-1">{account.museumName}</p>
            </div>
          </div>
        </div>

        {/* Timestamps */}
        <div className="rounded-xl border border-border bg-card shadow-sm p-6 md:col-span-2">
          <h2 className="text-lg font-semibold text-foreground mb-4">Thời gian</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm text-muted-foreground">Ngày tạo</label>
              <p className="text-sm font-medium text-foreground mt-1">{formatDate(account.createAt)}</p>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Cập nhật lần cuối</label>
              <p className="text-sm font-medium text-foreground mt-1">{formatDate(account.updateAt)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <EditAccountModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleUpdate}
        account={account}
        isLoading={updateMutation.isPending}
      />

      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        account={account}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}

