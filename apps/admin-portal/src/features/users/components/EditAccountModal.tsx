import { useEffect, useState } from 'react';
import { Account, UpdateAccountRequest } from '../types';

interface EditAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateAccountRequest) => void;
  account: Account | null;
  isLoading?: boolean;
}

export default function EditAccountModal({ isOpen, onClose, onSubmit, account, isLoading }: EditAccountModalProps) {
  const [formData, setFormData] = useState<UpdateAccountRequest>({
    email: '',
    fullName: '',
    password: '',
  });

  useEffect(() => {
    if (account) {
      setFormData({
        email: account.email || '',
        fullName: account.fullName || '',
        password: '', // Don't pre-fill password
      });
    }
  }, [account]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Only send fields that are filled
    const dataToSubmit: UpdateAccountRequest = {
      email: formData.email,
      fullName: formData.fullName,
    };
    // Only include password if it's not empty
    if (formData.password && formData.password.trim()) {
      dataToSubmit.password = formData.password;
    }
    onSubmit(dataToSubmit);
  };

  const handleClose = () => {
    onClose();
  };

  if (!isOpen || !account) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={handleClose} />

      {/* Modal */}
      <div className="relative z-50 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="rounded-xl border border-border bg-card shadow-lg">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Chỉnh sửa tài khoản</h2>
              <p className="text-sm text-muted-foreground mt-1">Cập nhật thông tin tài khoản</p>
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
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    Email <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                    placeholder="example@email.com"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-foreground mb-2">
                    Họ và tên <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                    placeholder="Nhập họ và tên"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                  Mật khẩu mới <span className="text-muted-foreground">(Để trống nếu không đổi)</span>
                </label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                  placeholder="Nhập mật khẩu mới"
                  disabled={isLoading}
                />
              </div>

              {/* Read-only fields */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Vai trò</label>
                  <div className="w-full px-3 py-2 rounded-lg border border-border bg-muted/30 text-foreground">
                    {account?.roleName}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Bảo tàng</label>
                  <div className="w-full px-3 py-2 rounded-lg border border-border bg-muted/30 text-foreground">
                    {account?.museumName}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Trạng thái</label>
                <div className="w-full px-3 py-2 rounded-lg border border-border bg-muted/30">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${account?.status === 'Active'
                      ? 'bg-chart-2/10 text-chart-2 border-chart-2/20'
                      : 'bg-muted text-muted-foreground border-border'
                      }`}
                  >
                    {account?.status}
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
                disabled={isLoading || !formData.email || !formData.fullName}
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

