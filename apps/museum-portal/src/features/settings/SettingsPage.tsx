import { useState, useEffect } from 'react';
import { useMuseum } from '../../lib/api/hooks';
import { useAuthStore } from '../../stores/auth-store';
import { apiClient } from '../../lib/api/client';
import { museumEndpoints } from '../../lib/api/endpoints';
import { Museum } from '../../lib/api/types';
import { Building2, Save, AlertCircle, CheckCircle2 } from 'lucide-react';

interface MuseumUpdateRequest {
  name?: string;
  location?: string; // Maps to address field in API
  description?: string;
}

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const { museum, loading, error: fetchError, refetch } = useMuseum(user?.museumId || '');

  const [formData, setFormData] = useState<MuseumUpdateRequest>({
    name: '',
    location: '',
    description: '',
  });

  useEffect(() => {
    if (museum) {
      setFormData({
        name: museum.name || '',
        location: museum.address || '', // API response uses 'address', but request uses 'location'
        description: museum.description || '',
      });
    }
  }, [museum]);

  const handleChange = (field: keyof MuseumUpdateRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
    setSuccess(null);
  };

  const handleSave = async () => {
    if (!user?.museumId) {
      setError('Không tìm thấy ID bảo tàng');
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      // Map location to address for API
      const updateData: any = {};
      if (formData.name) updateData.name = formData.name;
      if (formData.location) updateData.location = formData.location; // API uses 'location' field
      if (formData.description !== undefined) updateData.description = formData.description;

      await apiClient.put<Museum>(museumEndpoints.update(user.museumId), updateData);
      
      setSuccess('Cập nhật thông tin bảo tàng thành công!');
      setIsEditing(false);
      await refetch(); // Refresh data
    } catch (err: any) {
      const errorMessage = err?.message || 'Lỗi khi cập nhật thông tin bảo tàng';
      setError(errorMessage);
      console.error('Update museum error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (museum) {
      setFormData({
        name: museum.name || '',
        location: museum.address || '',
        description: museum.description || '',
      });
    }
    setIsEditing(false);
    setError(null);
    setSuccess(null);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-red-800">
            <AlertCircle className="w-5 h-5" />
            <p>Lỗi khi tải thông tin bảo tàng: {fetchError}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!museum) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-yellow-800">
            <AlertCircle className="w-5 h-5" />
            <p>Không tìm thấy thông tin bảo tàng</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Cài đặt</h1>
            <p className="text-gray-500 mt-1">Quản lý thông tin bảo tàng</p>
          </div>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>Chỉnh sửa</span>
          </button>
        ) : (
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Đang lưu...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Lưu thay đổi</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-green-800">
            <CheckCircle2 className="w-5 h-5" />
            <p>{success}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-red-800">
            <AlertCircle className="w-5 h-5" />
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Museum Information Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Thông tin Bảo tàng</h2>
        
        <div className="space-y-6">
          {/* Museum Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên bảo tàng <span className="text-red-500">*</span>
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Nhập tên bảo tàng"
              />
            ) : (
              <p className="text-lg text-gray-900">{museum.name || 'Chưa có thông tin'}</p>
            )}
          </div>

          {/* Location/Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Địa chỉ
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Nhập địa chỉ bảo tàng"
              />
            ) : (
              <p className="text-lg text-gray-900">{museum.address || 'Chưa có thông tin'}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mô tả
            </label>
            {isEditing ? (
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Nhập mô tả về bảo tàng"
              />
            ) : (
              <p className="text-lg text-gray-900 whitespace-pre-wrap">
                {museum.description || 'Chưa có thông tin'}
              </p>
            )}
          </div>

          {/* Read-only fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-200">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-2">Email</label>
              <p className="text-gray-900">{museum.email || 'Chưa có thông tin'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-2">Số điện thoại</label>
              <p className="text-gray-900">{museum.phone || 'Chưa có thông tin'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-2">Website</label>
              <p className="text-gray-900">
                {museum.website ? (
                  <a href={museum.website} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
                    {museum.website}
                  </a>
                ) : (
                  'Chưa có thông tin'
                )}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-2">Trạng thái</label>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                museum.isActive 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {museum.isActive ? 'Đang hoạt động' : 'Không hoạt động'}
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-2">Ngày tạo</label>
              <p className="text-gray-900">
                {museum.createdAt ? new Date(museum.createdAt).toLocaleDateString('vi-VN') : 'Chưa có thông tin'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-2">Cập nhật lần cuối</label>
              <p className="text-gray-900">
                {museum.updatedAt ? new Date(museum.updatedAt).toLocaleDateString('vi-VN') : 'Chưa có thông tin'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Lưu ý:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Bạn chỉ có thể chỉnh sửa tên, địa chỉ và mô tả của bảo tàng</li>
              <li>Các thông tin khác (email, số điện thoại, website) cần liên hệ SuperAdmin để thay đổi</li>
              <li>Chỉ SuperAdmin mới có quyền tạo mới hoặc xóa bảo tàng</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
