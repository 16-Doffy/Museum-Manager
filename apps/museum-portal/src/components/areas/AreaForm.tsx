'use client';

import { useState, useEffect } from 'react';
import { Area, AreaCreateRequest, AreaUpdateRequest } from '../../lib/api/types';
import { useAuthStore } from '../../stores/auth-store';

interface AreaFormProps {
  area?: Area;
  onSave: (data: AreaCreateRequest | AreaUpdateRequest) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  museums?: Array<{ id: string; name: string }>;
}

export function AreaForm({ area, onSave, onCancel, loading = false, museums = [] }: AreaFormProps) {
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    museumId: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (area) {
      setFormData({
        name: area.name,
        description: area.description || '',
        museumId: area.museumId || user?.museumId || '',
      });
    } else {
      setFormData({
        name: '',
        description: '',
        museumId: user?.museumId || '',
      });
    }
  }, [area, user?.museumId]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Tên khu vực là bắt buộc';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSave(formData);
    } catch (error) {
      console.error('Error saving area:', error);
    }
  };

  const handleChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-semibold mb-4">
          {area ? 'Chỉnh sửa khu vực' : 'Thêm khu vực mới'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Tên khu vực *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleChange('name')}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Nhập tên khu vực"
              disabled={loading}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={handleChange('description')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập mô tả khu vực"
              rows={3}
              disabled={loading}
            />
          </div>

          {museums.length > 0 ? (
            <div>
              <label htmlFor="museumId" className="block text-sm font-medium text-gray-700 mb-1">
                Bảo tàng
              </label>
              <select
                id="museumId"
                value={formData.museumId}
                onChange={handleChange('museumId')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              >
                <option value="">Chọn bảo tàng</option>
                {museums.map(museum => (
                  <option key={museum.id} value={museum.id}>
                    {museum.name}
                  </option>
                ))}
              </select>
            </div>
          ) : null}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Đang lưu...' : (area ? 'Cập nhật' : 'Tạo mới')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
