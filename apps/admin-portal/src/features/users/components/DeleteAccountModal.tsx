import { Account } from '../types';

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  account: Account | null;
  isLoading?: boolean;
}

export default function DeleteAccountModal({
  isOpen,
  onClose,
  onConfirm,
  account,
  isLoading,
}: DeleteAccountModalProps) {
  if (!isOpen || !account) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-50 w-full max-w-md mx-4">
        <div className="rounded-xl border border-border bg-card shadow-lg">
          {/* Header */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                <svg className="h-5 w-5 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Xác nhận xóa tài khoản</h2>
                <p className="text-sm text-muted-foreground mt-1">Hành động này không thể hoàn tác</p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-6">
            <p className="text-sm text-foreground">
              Bạn có chắc chắn muốn xóa tài khoản <span className="font-semibold text-foreground">"{account.email}"</span>?
            </p>
            <div className="mt-3 p-3 rounded-lg bg-muted border border-border">
              <p className="text-xs text-muted-foreground mb-1">Thông tin tài khoản:</p>
              <p className="text-sm font-medium text-foreground">{account.fullName}</p>
              <p className="text-xs text-muted-foreground">Vai trò: {account.roleName}</p>
              <p className="text-xs text-muted-foreground">Bảo tàng: {account.museumName}</p>
            </div>
            <p className="text-sm text-muted-foreground mt-3">
              Người dùng sẽ không thể đăng nhập và tất cả dữ liệu liên quan sẽ bị ảnh hưởng.
            </p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 rounded-lg border border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Hủy
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="px-4 py-2 rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-destructive-foreground border-t-transparent rounded-full animate-spin"></div>
                  Đang xóa...
                </span>
              ) : (
                'Xóa tài khoản'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

