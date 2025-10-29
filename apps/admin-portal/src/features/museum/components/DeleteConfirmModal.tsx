import { AlertTriangle } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  museumName: string;
  isLoading?: boolean;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  museumName,
  isLoading,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md bg-card rounded-xl border border-border shadow-lg">
          <div className="px-6 py-5">
            {/* Icon */}
            <div className="flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-destructive/10 mb-4">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>

            {/* Content */}
            <div className="text-center mb-5">
              <h3 className="text-lg font-semibold text-card-foreground mb-2">Xác nhận xóa bảo tàng</h3>
              <p className="text-sm text-muted-foreground">
                Bạn có chắc chắn muốn xóa bảo tàng <span className="font-semibold text-foreground">{museumName}</span>?
              </p>
              <p className="text-sm text-destructive mt-2">Hành động này không thể hoàn tác!</p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 rounded-lg border border-border bg-background text-foreground hover:bg-accent transition-colors"
                disabled={isLoading}
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="flex-1 px-4 py-2 rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? 'Đang xóa...' : 'Xóa bảo tàng'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

