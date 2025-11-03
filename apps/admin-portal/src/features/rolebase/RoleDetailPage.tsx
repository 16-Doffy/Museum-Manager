import { getErrorMessage } from '@/lib/error-utils';
import { ArrowLeft, Calendar } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import DeleteRoleModal from './components/DeleteRoleModal';
import EditRoleModal from './components/EditRoleModal';
import { useDeleteRole } from './hooks/useDeleteRole';
import { useRole } from './hooks/useRole';
import { useUpdateRole } from './hooks/useUpdateRole';
import { Role, UpdateRoleRequest } from './types';

export default function RoleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { data: role, isLoading, error } = useRole(id!);
  const updateMutation = useUpdateRole();
  const deleteMutation = useDeleteRole();

  const handleUpdate = async (data: UpdateRoleRequest) => {
    if (!role) return;
    try {
      await updateMutation.mutateAsync({ id: role.id, data });
      toast.success('Cập nhật vai trò thành công');
      setIsEditModalOpen(false);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Không thể cập nhật vai trò'));
    }
  };

  const handleDelete = async () => {
    if (!role) return;
    try {
      await deleteMutation.mutateAsync(role.id);
      toast.success('Xóa vai trò thành công');
      setIsDeleteModalOpen(false);
      // Don't navigate, stay on page - role will auto-update to Inactive
    } catch (error) {
      toast.error(getErrorMessage(error, 'Không thể xóa vai trò'));
    }
  };

  const getStatusColor = (status: Role['status']) => {
    switch (status) {
      case 'Active':
        return 'bg-chart-2/10 text-chart-2 border-chart-2/20';
      case 'Inactive':
        return 'bg-muted text-muted-foreground border-border';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border bg-card p-12 shadow-sm">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-3"></div>
            <p className="text-sm text-muted-foreground">Đang tải dữ liệu...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-border bg-card p-12 shadow-sm">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="inline-flex h-12 w-12 rounded-full bg-destructive/10 items-center justify-center mb-3">
              <svg className="h-6 w-6 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-sm font-medium text-foreground mb-1">Không thể tải dữ liệu</p>
            <p className="text-xs text-muted-foreground">
              {error instanceof Error ? error.message : 'Đã xảy ra lỗi'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!role) {
    return (
      <div className="rounded-xl border border-border bg-card p-12 shadow-sm">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <p className="text-sm font-medium text-foreground mb-1">Không tìm thấy vai trò</p>
            <p className="text-xs text-muted-foreground">Vai trò này có thể không tồn tại hoặc đã bị xóa.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/roles')}
            className="inline-flex items-center justify-center h-10 w-10 rounded-lg border border-border bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Chi tiết vai trò</h1>
            <p className="text-muted-foreground">Xem thông tin chi tiết về vai trò</p>
          </div>
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
      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Info Card */}
        <div className="md:col-span-2">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-card-foreground">Thông tin cơ bản</h2>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(role.status)}`}
              >
                {role.status}
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Tên vai trò</label>
                <p className="mt-1 text-base text-foreground">{role.name}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-card-foreground mb-4">Thời gian</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 rounded-full bg-primary/10 p-2">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Ngày tạo</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{formatDate(role.createAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <EditRoleModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleUpdate}
        role={role}
        isLoading={updateMutation.isPending}
      />

      <DeleteRoleModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        role={role}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}

