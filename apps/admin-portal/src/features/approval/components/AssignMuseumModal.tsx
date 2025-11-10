import { Museum } from '@/features/museum/types';
import { Account } from '@/features/users/types';
import { useEffect, useState } from 'react';

interface AssignMuseumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (accountId: string, museumId: string) => void;
  account: Account | null;
  museums: Museum[];
  isLoading: boolean;
}

export default function AssignMuseumModal({
  isOpen,
  onClose,
  onSubmit,
  account,
  museums,
  isLoading,
}: AssignMuseumModalProps) {
  const [selectedMuseumId, setSelectedMuseumId] = useState('');

  useEffect(() => {
    if (isOpen && museums.length > 0) {
      setSelectedMuseumId(museums[0].id);
    }
  }, [isOpen, museums]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!account || !selectedMuseumId) return;
    onSubmit(account.id, selectedMuseumId);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative z-50 w-full max-w-lg rounded-xl border border-border bg-card shadow-lg">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-card-foreground">Phê duyệt & Liên kết</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Chọn bảo tàng để liên kết với tài khoản. Cả hai sẽ được kích hoạt.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            {/* Account Info */}
            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <h3 className="text-sm font-medium text-foreground mb-2">Thông tin tài khoản</h3>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Họ tên:</span> {account?.fullName}
                </p>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Email:</span> {account?.email}
                </p>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Vai trò:</span> {account?.roleName || 'N/A'}
                </p>
              </div>
            </div>

            {/* Museum Selection */}
            <div>
              <label htmlFor="museum" className="block text-sm font-medium text-foreground mb-2">
                Chọn bảo tàng <span className="text-destructive">*</span>
              </label>
              {museums.length === 0 ? (
                <div className="p-4 rounded-lg border border-border bg-muted/30">
                  <p className="text-sm text-muted-foreground text-center">
                    Không có bảo tàng nào đang chờ phê duyệt
                  </p>
                </div>
              ) : (
                <select
                  id="museum"
                  value={selectedMuseumId}
                  onChange={(e) => setSelectedMuseumId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  required
                >
                  {museums.map((museum) => (
                    <option key={museum.id} value={museum.id}>
                      {museum.name} - {museum.location}
                    </option>
                  ))}
                </select>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Sau khi liên kết, cả tài khoản và bảo tàng sẽ được kích hoạt
              </p>
            </div>

            {/* Warning */}
            <div className="rounded-lg border border-chart-4/20 bg-chart-4/5 p-3">
              <div className="flex gap-2">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-chart-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <p className="text-xs text-chart-4">
                  Hành động này sẽ kích hoạt cả tài khoản và bảo tàng. Không thể hoàn tác.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 rounded-lg border border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isLoading || museums.length === 0 || !selectedMuseumId}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isLoading ? 'Đang xử lý...' : 'Phê duyệt & Kích hoạt'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

