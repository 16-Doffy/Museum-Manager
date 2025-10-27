'use client';

import { useState, useEffect } from 'react';
import { DisplayPosition, DisplayPositionCreateRequest, DisplayPositionUpdateRequest } from '../../lib/api/types';

interface DisplayPositionFormProps {
  displayPosition?: DisplayPosition;
  onSave: (data: DisplayPositionCreateRequest | DisplayPositionUpdateRequest) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  areas?: Array<{ id: string; name: string }>;
}

export function DisplayPositionForm({ displayPosition, onSave, onCancel, loading = false, areas = [] }: DisplayPositionFormProps) {
  const [formData, setFormData] = useState({
    displayPositionName: '',
    positionCode: '',
    description: '',
    areaId: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Use areas from props or fallback to mock data
  const availableAreas = areas.length > 0 ? areas : [
    { id: '1', name: 'Khu vực Lịch sử Cổ đại' },
    { id: '2', name: 'Khu vực Nghệ thuật Đương đại' },
    { id: '3', name: 'Khu vực Văn hóa Dân tộc' },
  ];

  useEffect(() => {
    if (displayPosition) {
      setFormData({
        displayPositionName: displayPosition.displayPositionName,
        positionCode: displayPosition.positionCode,
        description: displayPosition.description || '',
        areaId: displayPosition.areaId,
      });
    } else {
      setFormData({
        displayPositionName: '',
        positionCode: '',
        description: '',
        areaId: '',
      });
    }
  }, [displayPosition]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.displayPositionName.trim()) {
      newErrors.displayPositionName = 'Tên vị trí trưng bày là bắt buộc';
    }

    if (!formData.positionCode.trim()) {
      newErrors.positionCode = 'Mã vị trí là bắt buộc';
    }

    if (!formData.areaId) {
      newErrors.areaId = 'Khu vực là bắt buộc';
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
      console.error('Error saving display position:', error);
    }
  };

  const handleChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
          {displayPosition ? 'Chỉnh sửa vị trí trưng bày' : 'Thêm vị trí trưng bày mới'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="displayPositionName" className="block text-sm font-medium text-gray-700 mb-1">
              Tên vị trí trưng bày *
            </label>
            <input
              type="text"
              id="displayPositionName"
              value={formData.displayPositionName}
              onChange={handleChange('displayPositionName')}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.displayPositionName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Nhập tên vị trí trưng bày"
              disabled={loading}
            />
            {errors.displayPositionName && (
              <p className="text-red-500 text-sm mt-1">{errors.displayPositionName}</p>
            )}
          </div>

          <div>
            <label htmlFor="positionCode" className="block text-sm font-medium text-gray-700 mb-1">
              Mã vị trí *
            </label>
            <input
              type="text"
              id="positionCode"
              value={formData.positionCode}
              onChange={handleChange('positionCode')}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.positionCode ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Nhập mã vị trí"
              disabled={loading}
            />
            {errors.positionCode && (
              <p className="text-red-500 text-sm mt-1">{errors.positionCode}</p>
            )}
          </div>

          <div>
            <label htmlFor="areaId" className="block text-sm font-medium text-gray-700 mb-1">
              Khu vực *
            </label>
            <select
              id="areaId"
              value={formData.areaId}
              onChange={handleChange('areaId')}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.areaId ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={loading}
            >
              <option value="">Chọn khu vực</option>
              {availableAreas.map(area => (
                <option key={area.id} value={area.id}>
                  {area.name}
                </option>
              ))}
            </select>
            {errors.areaId && (
              <p className="text-red-500 text-sm mt-1">{errors.areaId}</p>
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
              placeholder="Nhập mô tả vị trí trưng bày"
              rows={3}
              disabled={loading}
            />
          </div>

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
              {loading ? 'Đang lưu...' : (displayPosition ? 'Cập nhật' : 'Tạo mới')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
