import { useEffect, useState } from 'react';
import { Role, UpdateRoleRequest } from '../types';

interface EditRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateRoleRequest) => void;
  role: Role | null;
  isLoading?: boolean;
}

export default function EditRoleModal({ isOpen, onClose, onSubmit, role, isLoading }: EditRoleModalProps) {
  const [formData, setFormData] = useState<UpdateRoleRequest>({
    name: '',
  });

  useEffect(() => {
    if (role) {
      setFormData({
        name: role.name,
      });
    }
  }, [role]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim()) {
      onSubmit(formData);
    }
  };

  const handleClose = () => {
    onClose();
  };

  if (!isOpen || !role) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={handleClose} />

      {/* Modal */}
      <div className="relative z-50 w-full max-w-lg mx-4">
        <div className="rounded-xl border border-border bg-card shadow-lg">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Chỉnh sửa vai trò</h2>
              <p className="text-sm text-muted-foreground mt-1">Cập nhật thông tin vai trò</p>
            </div>
            <button
              onClick={handleClose}
              className="text-muted-foreground hover:text-foreground transition-colors"
              disabled={isLoading}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                  Tên vai trò <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                  placeholder="VD: Manager, Staff, Admin..."
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Read-only status field */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Trạng thái</label>
                <div className="w-full px-3 py-2 rounded-lg border border-border bg-muted/30">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${role?.status === 'Active'
                        ? 'bg-chart-2/10 text-chart-2 border-chart-2/20'
                        : 'bg-muted text-muted-foreground border-border'
                      }`}
                  >
                    {role?.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
              <button
                type="button"
                onClick={handleClose}
                disabled={isLoading}
                className="px-4 py-2 rounded-lg border border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isLoading || !formData.name.trim()}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                    Đang lưu...
                  </span>
                ) : (
                  'Lưu thay đổi'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

