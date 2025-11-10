import { getErrorMessage } from '@/lib/error-utils';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import CreateMuseumModal from './components/CreateMuseumModal';
import { useCreateMuseum } from './hooks/useCreateMuseum';
import { useMuseums } from './hooks/useMuseums';
import { CreateMuseumRequest, Museum } from './types';

export default function MuseumsPage() {
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState<'Active' | 'Inactive' | 'Pending'>('Active');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const navigate = useNavigate();

  const { data, isLoading, error } = useMuseums({ pageIndex, pageSize, Status: statusFilter });
  const createMutation = useCreateMuseum();

  // Reset to page 1 when filter changes
  const handleStatusFilterChange = (newStatus: typeof statusFilter) => {
    setStatusFilter(newStatus);
    setPageIndex(1);
  };

  const handleCreate = async (data: CreateMuseumRequest) => {
    try {
      await createMutation.mutateAsync(data);
      toast.success('Tạo bảo tàng thành công!');
      setIsCreateModalOpen(false);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Tạo bảo tàng thất bại'));
    }
  };

  const getStatusColor = (status: Museum['status']) => {
    switch (status) {
      case 'Active':
        return 'bg-chart-2/10 text-chart-2 border-chart-2/20';
      case 'Pending':
        return 'bg-chart-4/10 text-chart-4 border-chart-4/20';
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
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Danh sách bảo tàng</h1>
          <p className="text-muted-foreground">Quản lý tất cả bảo tàng trong hệ thống</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => handleStatusFilterChange(e.target.value as typeof statusFilter)}
            className="px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
          >
            <option value="Active">Đang hoạt động</option>
            <option value="Pending">Chờ phê duyệt</option>
            <option value="Inactive">Đã xóa</option>
          </select>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all shadow-sm hover:shadow"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Thêm bảo tàng
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="rounded-xl border border-border bg-card shadow-sm">
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-3"></div>
              <p className="text-sm text-muted-foreground">Đang tải dữ liệu...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex items-center justify-center py-12">
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
        )}

        {/* Table */}
        {!isLoading && !error && data && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border bg-muted/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Tên bảo tàng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Vị trí
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Mô tả
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Ngày tạo
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {data.items.map((museum) => (
                    <tr key={museum.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-foreground">{museum.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-muted-foreground">{museum.location}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-muted-foreground max-w-md truncate">{museum.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(museum.status)}`}
                        >
                          {museum.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-muted-foreground">{formatDate(museum.createAt)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => navigate(`/museums/admin/${museum.id}`)}
                          className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all shadow-sm hover:shadow text-sm font-medium"
                        >
                          Chi tiết
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {data.totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-border">
                <div className="text-sm text-muted-foreground">
                  Hiển thị {data.items.length} / {data.totalItems} bảo tàng
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPageIndex((prev) => Math.max(1, prev - 1))}
                    disabled={pageIndex === 1}
                    className="px-3 py-1.5 rounded-lg border border-border bg-background text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Trước
                  </button>
                  <span className="text-sm text-muted-foreground">
                    Trang {pageIndex} / {data.totalPages}
                  </span>
                  <button
                    onClick={() => setPageIndex((prev) => Math.min(data.totalPages, prev + 1))}
                    disabled={pageIndex === data.totalPages}
                    className="px-3 py-1.5 rounded-lg border border-border bg-background text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Sau
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!isLoading && !error && data && data.items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="inline-flex h-16 w-16 rounded-full bg-muted items-center justify-center mb-4">
              <svg className="h-8 w-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <p className="text-sm font-medium text-foreground mb-1">Chưa có bảo tàng nào</p>
            <p className="text-xs text-muted-foreground">Thêm bảo tàng đầu tiên để bắt đầu</p>
          </div>
        )}
      </div>

      {/* Create Modal */}
      <CreateMuseumModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreate}
        isLoading={createMutation.isPending}
      />
    </div>
  );
}

