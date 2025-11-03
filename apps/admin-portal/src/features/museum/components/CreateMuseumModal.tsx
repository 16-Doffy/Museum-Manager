import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { CreateMuseumRequest } from '../types';

interface CreateMuseumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateMuseumRequest) => void;
  isLoading?: boolean;
}

export default function CreateMuseumModal({ isOpen, onClose, onSubmit, isLoading }: CreateMuseumModalProps) {
  const [formData, setFormData] = useState<CreateMuseumRequest>({
    name: '',
    location: '',
    description: '',
  });

  useEffect(() => {
    if (isOpen) {
      // Reset form when modal opens
      setFormData({
        name: '',
        location: '',
        description: '',
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
            <h2 className="text-xl font-semibold text-card-foreground">Thêm bảo tàng mới</h2>
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
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
                  Tên bảo tàng <span className="text-destructive">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-ring outline-none transition"
                  placeholder="Nhập tên bảo tàng"
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-foreground mb-1">
                  Vị trí <span className="text-destructive">*</span>
                </label>
                <input
                  id="location"
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-ring outline-none transition"
                  placeholder="Nhập vị trí"
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-foreground mb-1">
                  Mô tả <span className="text-destructive">*</span>
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-ring outline-none transition resize-none"
                  placeholder="Nhập mô tả"
                  rows={4}
                  required
                  disabled={isLoading}
                />
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
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow"
                disabled={isLoading}
              >
                {isLoading ? 'Đang tạo...' : 'Tạo bảo tàng'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

