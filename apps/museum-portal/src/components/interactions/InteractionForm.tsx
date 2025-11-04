'use client';

import { useState, useEffect } from 'react';
import { Interaction, InteractionCreateRequest, InteractionUpdateRequest, Visitor, Artifact } from '../../lib/api/types';

interface InteractionFormProps {
  interaction?: Interaction;
  onSave: (data: InteractionCreateRequest | InteractionUpdateRequest) => void;
  onCancel: () => void;
  isLoading?: boolean;
  visitors?: Visitor[];
  artifacts?: Artifact[];
}

export default function InteractionForm({ 
  interaction, 
  onSave, 
  onCancel, 
  isLoading = false, 
  visitors = [], 
  artifacts = [] 
}: InteractionFormProps) {
  const [formData, setFormData] = useState({
    visitorId: '',
    artifactId: '',
    interactionType: 'VIEW',
    comment: '',
    rating: 5,
  });

  // Remove mock data, use props instead
  const interactionTypes = [
    { value: 'VIEW', label: 'Xem' },
    { value: 'TOUCH', label: 'Chạm' },
    { value: 'COMMENT', label: 'Bình luận' },
    { value: 'RATING', label: 'Đánh giá' },
    { value: 'PHOTO', label: 'Chụp ảnh' },
  ];

  useEffect(() => {
    if (interaction) {
      setFormData({
        visitorId: interaction.visitorId,
        artifactId: interaction.artifactId,
        interactionType: interaction.interactionType,
        comment: interaction.comment || '',
        rating: interaction.rating || 5,
      });
    } else {
      setFormData({
        visitorId: '',
        artifactId: '',
        interactionType: 'VIEW',
        comment: '',
        rating: 5,
      });
    }
  }, [interaction]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.visitorId) {
      alert('Vui lòng chọn khách tham quan');
      return;
    }

    if (!formData.artifactId) {
      alert('Vui lòng chọn hiện vật');
      return;
    }

    if (!formData.interactionType) {
      alert('Vui lòng chọn loại tương tác');
      return;
    }

    onSave(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) : value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">
          {interaction ? 'Chỉnh sửa tương tác' : 'Thêm tương tác mới'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Khách tham quan *
            </label>
            <select
              name="visitorId"
              value={formData.visitorId}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              required
            >
              <option value="">Chọn khách tham quan</option>
              {visitors.map(visitor => (
                <option key={visitor.id} value={visitor.id}>
                  {visitor.phoneNumber} {visitor.name ? `(${visitor.name})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hiện vật *
            </label>
            <select
              name="artifactId"
              value={formData.artifactId}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              required
            >
              <option value="">Chọn hiện vật</option>
              {artifacts.map(artifact => (
                <option key={artifact.id} value={artifact.id}>
                  {artifact.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Loại tương tác *
            </label>
            <select
              name="interactionType"
              value={formData.interactionType}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              required
            >
              {interactionTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bình luận
            </label>
            <textarea
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              rows={3}
              placeholder="Nhập bình luận..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Đánh giá (1-5 sao)
            </label>
            <select
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value={1}>1 sao</option>
              <option value={2}>2 sao</option>
              <option value={3}>3 sao</option>
              <option value={4}>4 sao</option>
              <option value={5}>5 sao</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
              disabled={isLoading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Đang lưu...' : (interaction ? 'Cập nhật' : 'Tạo mới')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
