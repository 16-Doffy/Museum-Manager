import { useEffect, useState } from 'react';
import { useMuseums } from '../../museum/hooks/useMuseums';
import { useRoles } from '../hooks/useRoles';
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
    roleId: '',
    museumId: '',
    status: 'Active',
  });

  const { data: rolesData } = useRoles({ pageIndex: 1, pageSize: 10 });
  const { data: museumsData } = useMuseums({ pageIndex: 1, pageSize: 10 });

  useEffect(() => {
    if (account) {
      setFormData({
        email: account.email,
        fullName: account.fullName,
        password: '', // Don't pre-fill password
        roleId: account.roleId,
        museumId: account.museumId,
        status: account.status,
      });
    }
  }, [account]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Only send fields that are filled
    const dataToSubmit: UpdateAccountRequest = {
      email: formData.email,
      fullName: formData.fullName,
      roleId: formData.roleId,
      museumId: formData.museumId,
      status: formData.status,
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

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="roleId" className="block text-sm font-medium text-foreground mb-2">
                    Vai trò <span className="text-destructive">*</span>
                  </label>
                  <select
                    id="roleId"
                    value={formData.roleId}
                    onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                    required
                    disabled={isLoading}
                  >
                    <option value="">Chọn vai trò</option>
                    {rolesData?.items.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="museumId" className="block text-sm font-medium text-foreground mb-2">
                    Bảo tàng <span className="text-destructive">*</span>
                  </label>
                  <select
                    id="museumId"
                    value={formData.museumId}
                    onChange={(e) => setFormData({ ...formData, museumId: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                    required
                    disabled={isLoading}
                  >
                    <option value="">Chọn bảo tàng</option>
                    {museumsData?.items.map((museum) => (
                      <option key={museum.id} value={museum.id}>
                        {museum.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-foreground mb-2">
                  Trạng thái <span className="text-destructive">*</span>
                </label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Active' | 'Inactive' })}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading || account?.status === 'Inactive'}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
                {account?.status === 'Inactive' && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Không thể thay đổi trạng thái của tài khoản đã bị vô hiệu hóa
                  </p>
                )}
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
                disabled={
                  isLoading || !formData.email || !formData.fullName || !formData.roleId || !formData.museumId
                }
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

