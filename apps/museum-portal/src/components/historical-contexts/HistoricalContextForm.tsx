'use client';

import { useState, useEffect } from 'react';
import { HistoricalContext, HistoricalContextCreateRequest, HistoricalContextUpdateRequest } from '../../lib/api/types';
import { useArtifacts } from '../../lib/api/hooks';

interface HistoricalContextFormProps {
  historicalContext?: HistoricalContext;
  onSave: (data: HistoricalContextCreateRequest | HistoricalContextUpdateRequest) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export function HistoricalContextForm({ historicalContext, onSave, onCancel, loading = false }: HistoricalContextFormProps) {
  const { artifacts } = useArtifacts({ pageIndex: 1, pageSize: 100 });
  const [formData, setFormData] = useState({
    title: '',
    period: '',
    description: '',
    artifactIds: [] as string[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (historicalContext) {
      setFormData({
        title: historicalContext.title,
        period: historicalContext.period || '',
        description: historicalContext.description || '',
        artifactIds: historicalContext.artifacts?.map(a => a.id) || [],
      });
    } else {
      setFormData({
        title: '',
        period: '',
        description: '',
        artifactIds: [],
      });
    }
  }, [historicalContext]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Tiêu đề là bắt buộc';
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
      const submitData: HistoricalContextCreateRequest | HistoricalContextUpdateRequest = {
        title: formData.title,
        period: formData.period || undefined,
        description: formData.description || undefined,
        ...(formData.artifactIds.length > 0 ? { artifactIds: formData.artifactIds } : {}),
      };
      await onSave(submitData);
    } catch (error) {
      console.error('Error saving historical context:', error);
    }
  };

  const handleChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    if (field === 'artifactIds') {
      const select = e.target as HTMLSelectElement;
      const selectedIds = Array.from(select.selectedOptions, option => option.value);
      setFormData(prev => ({ ...prev, [field]: selectedIds }));
    } else {
      setFormData(prev => ({ ...prev, [field]: e.target.value }));
    }
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">
          {historicalContext ? 'Chỉnh sửa ngữ cảnh lịch sử' : 'Thêm ngữ cảnh lịch sử mới'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Tiêu đề *
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={handleChange('title')}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Nhập tiêu đề ngữ cảnh lịch sử"
              disabled={loading}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          <div>
            <label htmlFor="period" className="block text-sm font-medium text-gray-700 mb-1">
              Thời kỳ
            </label>
            <input
              type="text"
              id="period"
              value={formData.period}
              onChange={handleChange('period')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập thời kỳ (ví dụ: Thế kỷ 19)"
              disabled={loading}
            />
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
              placeholder="Nhập mô tả ngữ cảnh lịch sử"
              rows={4}
              disabled={loading}
            />
          </div>

          {!historicalContext && (
            <div>
              <label htmlFor="artifactIds" className="block text-sm font-medium text-gray-700 mb-1">
                Hiện vật (tùy chọn)
              </label>
              <select
                id="artifactIds"
                multiple
                value={formData.artifactIds}
                onChange={handleChange('artifactIds')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
                size={5}
              >
                {artifacts.map((artifact) => (
                  <option key={artifact.id} value={artifact.id}>
                    {artifact.name} {artifact.code ? `(${artifact.code})` : ''}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Giữ Ctrl (hoặc Cmd trên Mac) để chọn nhiều hiện vật
              </p>
            </div>
          )}

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
              {loading ? 'Đang lưu...' : (historicalContext ? 'Cập nhật' : 'Tạo mới')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

