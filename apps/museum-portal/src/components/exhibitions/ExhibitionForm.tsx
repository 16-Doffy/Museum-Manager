'use client';

import { useState, useEffect } from 'react';
import { Exhibition, ExhibitionCreateRequest, ExhibitionUpdateRequest, HistoricalContext } from '../../lib/api/types';
import { useHistoricalContexts } from '../../lib/api/hooks';

interface ExhibitionFormProps {
  exhibition?: Exhibition;
  onSave: (data: ExhibitionCreateRequest | ExhibitionUpdateRequest) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export function ExhibitionForm({ exhibition, onSave, onCancel, loading = false }: ExhibitionFormProps) {
  const {
    historicalContexts,
    loading: loadingHistoricalContexts,
    fetchHistoricalContexts,
  } = useHistoricalContexts({
    pageIndex: 1,
    pageSize: 100,
    statusFilter: 'Active',
  });
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    priority: 10,
    startDate: '',
    endDate: '',
    historicalContextIds: [] as string[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchHistoricalContexts();
  }, [fetchHistoricalContexts]);

  useEffect(() => {
    if (exhibition) {
      setFormData({
        name: exhibition.name,
        description: exhibition.description || '',
        priority: exhibition.priority,
        startDate: exhibition.startDate ? new Date(exhibition.startDate).toISOString().slice(0, 16) : '',
        endDate: exhibition.endDate ? new Date(exhibition.endDate).toISOString().slice(0, 16) : '',
        historicalContextIds: exhibition.historicalContexts?.map(hc => hc.id) || [],
      });
    } else {
      setFormData({
        name: '',
        description: '',
        priority: 10,
        startDate: '',
        endDate: '',
        historicalContextIds: [],
      });
    }
  }, [exhibition]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Tên triển lãm là bắt buộc';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Ngày bắt đầu là bắt buộc';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'Ngày kết thúc là bắt buộc';
    }

    if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
      newErrors.endDate = 'Ngày kết thúc phải sau ngày bắt đầu';
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
      const submitData: ExhibitionCreateRequest | ExhibitionUpdateRequest = {
        name: formData.name,
        description: formData.description || undefined,
        priority: formData.priority,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        ...(formData.historicalContextIds.length > 0
          ? { historicalContextIds: formData.historicalContextIds }
          : {}),
      };
      await onSave(submitData);
    } catch (error) {
      console.error('Error saving exhibition:', error);
    }
  };

  const handleChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    if (field === 'historicalContextIds') {
      const select = e.target as HTMLSelectElement;
      const selectedIds = Array.from(select.selectedOptions, option => option.value);
      setFormData(prev => ({ ...prev, [field]: selectedIds }));
    } else if (field === 'priority') {
      setFormData(prev => ({ ...prev, [field]: parseInt(e.target.value) || 10 }));
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
          {exhibition ? 'Chỉnh sửa triển lãm' : 'Thêm triển lãm mới'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Tên triển lãm *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleChange('name')}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Nhập tên triển lãm"
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
              placeholder="Nhập mô tả triển lãm"
              rows={3}
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                Độ ưu tiên
              </label>
              <input
                type="number"
                id="priority"
                value={formData.priority}
                onChange={handleChange('priority')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                disabled={loading}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                Ngày bắt đầu *
              </label>
              <input
                type="datetime-local"
                id="startDate"
                value={formData.startDate}
                onChange={handleChange('startDate')}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.startDate ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={loading}
              />
              {errors.startDate && (
                <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>
              )}
            </div>

            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                Ngày kết thúc *
              </label>
              <input
                type="datetime-local"
                id="endDate"
                value={formData.endDate}
                onChange={handleChange('endDate')}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.endDate ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={loading}
              />
              {errors.endDate && (
                <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>
              )}
            </div>
          </div>

          {!exhibition && (
            <div>
              <label htmlFor="historicalContextIds" className="block text-sm font-medium text-gray-700 mb-1">
                Ngữ cảnh lịch sử (tùy chọn)
              </label>
              <select
                id="historicalContextIds"
                multiple
                value={formData.historicalContextIds}
                onChange={handleChange('historicalContextIds')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
                size={5}
              >
                {loadingHistoricalContexts ? (
                  <option disabled>Đang tải dữ liệu...</option>
                ) : historicalContexts.length === 0 ? (
                  <option disabled>Không có ngữ cảnh lịch sử khả dụng</option>
                ) : (
                  historicalContexts.map((hc) => (
                    <option key={hc.id} value={hc.id}>
                      {hc.title} {hc.period ? `(${hc.period})` : ''}
                    </option>
                  ))
                )}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Giữ Ctrl (hoặc Cmd trên Mac) để chọn nhiều ngữ cảnh lịch sử
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
              {loading ? 'Đang lưu...' : (exhibition ? 'Cập nhật' : 'Tạo mới')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

