import { useMuseums } from '@/features/museum/hooks/useMuseums';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRoles } from '../hooks/useRoles';
import { CreateAccountRequest } from '../types';

interface CreateAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateAccountRequest) => void;
  isLoading?: boolean;
}

export default function CreateAccountModal({ isOpen, onClose, onSubmit, isLoading }: CreateAccountModalProps) {
  const { data: rolesData } = useRoles({ pageIndex: 1, pageSize: 10 });
  // Only fetch Active museums for account creation
  const { data: museumsData } = useMuseums({ pageIndex: 1, pageSize: 10, Status: 'Active' });

  const [formData, setFormData] = useState<CreateAccountRequest>({
    email: '',
    fullName: '',
    password: '',
    roleId: '',
    museumId: '',
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        email: '',
        fullName: '',
        password: '',
        roleId: '',
        museumId: '',
      });
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-lg bg-card rounded-xl border border-border shadow-lg">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 className="text-xl font-semibold text-card-foreground">Tạo tài khoản mới</h2>
            <button
              onClick={onClose}
              className="rounded-lg p-2 hover:bg-accent transition-colors"
              disabled={isLoading}
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-4">
            <div className="space-y-4">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                  Email <span className="text-destructive">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-ring outline-none transition"
                  placeholder="user@museum.com"
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-foreground mb-1">
                  Họ tên <span className="text-destructive">*</span>
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-ring outline-none transition"
                  placeholder="Nguyễn Văn A"
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
                  Mật khẩu <span className="text-destructive">*</span>
                </label>
                <input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-ring outline-none transition"
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                  minLength={6}
                />
                <p className="text-xs text-muted-foreground mt-1">Tối thiểu 6 ký tự</p>
              </div>

              {/* Role */}
              <div>
                <label htmlFor="roleId" className="block text-sm font-medium text-foreground mb-1">
                  Vai trò <span className="text-destructive">*</span>
                </label>
                <select
                  id="roleId"
                  value={formData.roleId}
                  onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-ring outline-none transition"
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

              {/* Museum (Optional) */}
              <div>
                <label htmlFor="museumId" className="block text-sm font-medium text-foreground mb-1">
                  Bảo tàng <span className="text-muted-foreground text-xs">(Tùy chọn)</span>
                </label>
                <select
                  id="museumId"
                  value={formData.museumId || ''}
                  onChange={(e) => setFormData({ ...formData, museumId: e.target.value || undefined })}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-ring outline-none transition"
                  disabled={isLoading}
                >
                  <option value="">Không chọn (tạo Pending account)</option>
                  {museumsData?.items.map((museum) => (
                    <option key={museum.id} value={museum.id}>
                      {museum.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground mt-1">
                  Nếu không chọn bảo tàng, tài khoản sẽ ở trạng thái Pending và cần phê duyệt sau
                </p>
              </div>

            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-border">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-border bg-background text-foreground hover:bg-accent transition-colors"
                disabled={isLoading}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? 'Đang tạo...' : 'Tạo tài khoản'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

