'use client';

import { useState, useEffect } from 'react';
import { Artifact, ArtifactCreateRequest, ArtifactUpdateRequest } from '../../lib/api/types';

interface ArtifactFormProps {
  artifact?: Artifact;
  onSave: (data: ArtifactCreateRequest | ArtifactUpdateRequest) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ArtifactForm({ artifact, onSave, onCancel, isLoading }: ArtifactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    periodTime: '',
    isOriginal: true,
    weight: '',
    height: '',
    width: '',
    length: '',
  });

  useEffect(() => {
    if (artifact) {
      setFormData({
        name: artifact.name || '',
        description: artifact.description || '',
        periodTime: artifact.periodTime || '',
        isOriginal: artifact.isOriginal ?? true,
        weight: artifact.weight?.toString() || '',
        height: artifact.height?.toString() || '',
        width: artifact.width?.toString() || '',
        length: artifact.length?.toString() || '',
      });
    }
  }, [artifact]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      name: formData.name,
      description: formData.description,
      periodTime: formData.periodTime,
      isOriginal: formData.isOriginal,
      weight: formData.weight ? parseFloat(formData.weight) : undefined,
      height: formData.height ? parseFloat(formData.height) : undefined,
      width: formData.width ? parseFloat(formData.width) : undefined,
      length: formData.length ? parseFloat(formData.length) : undefined,
    };

    onSave(submitData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {artifact ? 'Chỉnh sửa hiện vật' : 'Thêm hiện vật mới'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên hiện vật *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Nhập tên hiện vật"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              rows={3}
              placeholder="Nhập mô tả hiện vật"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Thời kỳ
            </label>
            <input
              type="text"
              value={formData.periodTime}
              onChange={(e) => setFormData(prev => ({ ...prev, periodTime: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Nhập thời kỳ"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isOriginal"
              checked={formData.isOriginal}
              onChange={(e) => setFormData(prev => ({ ...prev, isOriginal: e.target.checked }))}
              className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
            />
            <label htmlFor="isOriginal" className="ml-2 block text-sm text-gray-700">
              Hiện vật gốc
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trọng lượng (kg)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.weight}
                onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="0.0"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chiều cao (cm)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.height}
                onChange={(e) => setFormData(prev => ({ ...prev, height: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="0.0"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chiều rộng (cm)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.width}
                onChange={(e) => setFormData(prev => ({ ...prev, width: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="0.0"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chiều dài (cm)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.length}
                onChange={(e) => setFormData(prev => ({ ...prev, length: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="0.0"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              disabled={isLoading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Đang lưu...' : (artifact ? 'Cập nhật' : 'Tạo mới')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}