import { getErrorMessage } from '@/lib/error-utils';
import { Check, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useConfirmMuseum } from './hooks/useConfirmMuseum';
import { useMuseums } from './hooks/useMuseums';
import { ConfirmMuseumRequest, Museum } from './types';

export default function MuseumApprovalPage() {
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(10);

  const { data, isLoading, error } = useMuseums({ pageIndex, pageSize, Status: 'Pending' });
  const confirmMutation = useConfirmMuseum();

  const handleConfirm = async (museum: Museum, confirmStatus: ConfirmMuseumRequest['ConfirmStatus']) => {
    try {
      await confirmMutation.mutateAsync({ id: museum.id, confirmStatus });
      const action = confirmStatus === 'Confirmed' ? 'phê duyệt' : 'từ chối';
      toast.success(`Đã ${action} bảo tàng "${museum.name}"`);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Không thể xử lý yêu cầu'));
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Phê duyệt bảo tàng</h1>
          <p className="text-muted-foreground">Xem và duyệt các yêu cầu đăng ký bảo tàng mới</p>
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
        {!isLoading && !error && data && data.items.length > 0 && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Tên bảo tàng
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Vị trí
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Mô tả
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Ngày tạo
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {data.items.map((museum) => (
                    <tr key={museum.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-foreground">{museum.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-muted-foreground max-w-xs truncate">{museum.location}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-muted-foreground max-w-md truncate">{museum.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-muted-foreground">{formatDate(museum.createAt)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleConfirm(museum, 'Confirmed')}
                            disabled={confirmMutation.isPending}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-chart-2 text-white hover:bg-chart-2/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all shadow-sm hover:shadow text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Check className="h-4 w-4" />
                            Phê duyệt
                          </button>
                          <button
                            onClick={() => handleConfirm(museum, 'Rejected')}
                            disabled={confirmMutation.isPending}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all shadow-sm hover:shadow text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <X className="h-4 w-4" />
                            Từ chối
                          </button>
                        </div>
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
                  Hiển thị {data.items.length} / {data.totalItems} bảo tàng đang chờ duyệt
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
              <Check className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground mb-1">Không có yêu cầu đang chờ</p>
            <p className="text-xs text-muted-foreground">Tất cả yêu cầu đăng ký đã được xử lý</p>
          </div>
        )}
      </div>
    </div>
  );
}

