import { getErrorMessage } from '@/lib/error-utils';
import { ArrowLeft, Calendar, MapPin } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import EditMuseumModal from './components/EditMuseumModal';
import { useDeleteMuseum } from './hooks/useDeleteMuseum';
import { useMuseum } from './hooks/useMuseum';
import { useUpdateMuseum } from './hooks/useUpdateMuseum';
import { Museum, UpdateMuseumRequest } from './types';

export default function MuseumDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: museum, isLoading, error } = useMuseum(id!);
  const updateMutation = useUpdateMuseum();
  const deleteMutation = useDeleteMuseum();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const getStatusColor = (status: Museum['status']) => {
    switch (status) {
      case 'Active':
        return 'bg-chart-2/10 text-chart-2 border-chart-2/20';
      case 'Inactive':
        return 'bg-muted text-muted-foreground border-border';
      case 'Pending':
        return 'bg-chart-4/10 text-chart-4 border-chart-4/20';
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

  const handleUpdate = async (data: UpdateMuseumRequest) => {
    try {
      await updateMutation.mutateAsync({ id: id!, data });
      toast.success('Cập nhật bảo tàng thành công!');
      setIsEditModalOpen(false);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Cập nhật thất bại'));
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(id!);
      toast.success('Xóa bảo tàng thành công!');
      navigate('/museums/admin');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Xóa thất bại'));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/museums/admin')}
            className="inline-flex items-center justify-center h-10 w-10 rounded-lg border border-border bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Chi tiết bảo tàng</h1>
            <p className="text-muted-foreground">Xem thông tin chi tiết về bảo tàng</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditModalOpen(true)}
            disabled={!museum}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Chỉnh sửa
          </button>
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            disabled={!museum}
            className="inline-flex items-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg font-medium hover:bg-destructive/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Xóa
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="rounded-xl border border-border bg-card p-12 shadow-sm">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-3"></div>
              <p className="text-sm text-muted-foreground">Đang tải dữ liệu...</p>
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
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
      )}

      {/* Content */}
      {!isLoading && !error && museum && (
        <div className="grid gap-6 md:grid-cols-3">
          {/* Main Info Card */}
          <div className="md:col-span-2">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-card-foreground">Thông tin cơ bản</h2>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(museum.status)}`}
                >
                  {museum.status}
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Tên bảo tàng</label>
                  <p className="mt-1 text-base text-foreground">{museum.name}</p>
                </div>

                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <label className="text-sm font-medium text-muted-foreground">Vị trí</label>
                    <p className="mt-1 text-base text-foreground">{museum.location}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Mô tả</label>
                  <p className="mt-1 text-base text-foreground leading-relaxed">{museum.description}</p>
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
                    <p className="text-xs text-muted-foreground mt-0.5">{formatDate(museum.createAt)}</p>
                  </div>
                </div>

                {museum.updateAt && (
                  <div className="flex items-start gap-3">
                    <div className="mt-1 rounded-full bg-chart-3/10 p-2">
                      <Calendar className="h-4 w-4 text-chart-3" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">Cập nhật cuối</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{formatDate(museum.updateAt)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {museum && (
        <>
          <EditMuseumModal
            museum={museum}
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onSubmit={handleUpdate}
            isLoading={updateMutation.isPending}
          />
          <DeleteConfirmModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDelete}
            museumName={museum.name}
            isLoading={deleteMutation.isPending}
          />
        </>
      )}
    </div>
  );
}

