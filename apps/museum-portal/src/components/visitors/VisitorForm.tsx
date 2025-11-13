'use client';

import { useState, useEffect } from 'react';
import { Visitor, VisitorCreateRequest, VisitorUpdateRequest } from '../../lib/api/types';

interface VisitorFormProps {
  visitor?: Visitor;
  onSave: (data: VisitorCreateRequest | VisitorUpdateRequest) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function VisitorForm({ visitor, onSave, onCancel, isLoading = false }: VisitorFormProps) {
  const [formData, setFormData] = useState({
    phoneNumber: '',
    name: '',
    email: '',
    status: 'Active',
  });

  useEffect(() => {
    if (visitor) {
      setFormData({
        phoneNumber: visitor.phoneNumber || '',
        name: visitor.name || '',
        email: visitor.email || '',
        status: visitor.status || 'Active',
      });
    } else {
      setFormData({
        phoneNumber: '',
        name: '',
        email: '',
        status: 'Active',
      });
    }
  }, [visitor]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.phoneNumber.trim()) {
      alert('Vui lòng nhập số điện thoại');
      return;
    }

    // Validate phone number format
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      alert('Số điện thoại phải có 10-11 chữ số');
      return;
    }

    // Validate email format if provided
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      alert('Email không đúng định dạng');
      return;
    }

    onSave(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-semibold mb-4">
          {visitor ? 'Chỉnh sửa khách tham quan' : 'Thêm khách tham quan mới'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số điện thoại *
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Nhập số điện thoại"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên khách tham quan
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Nhập tên khách tham quan"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Nhập email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trạng thái *
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              required
            >
              <option value="Active">Hoạt động</option>
              <option value="Inactive">Không hoạt động</option>
              <option value="Suspended">Tạm ngưng</option>
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
              {isLoading ? 'Đang lưu...' : (visitor ? 'Cập nhật' : 'Tạo mới')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
