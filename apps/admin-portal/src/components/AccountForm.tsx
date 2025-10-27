"use client";

import { useState, useEffect } from 'react';
import { Account, AccountCreateRequest, AccountUpdateRequest } from '../lib/api/types';
import { useRoles } from '../lib/hooks/useRoles';

interface AccountFormProps {
  account?: Account;
  onSave: (data: AccountCreateRequest & { roleId: string; museumId: string }) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function AccountForm({ account, onSave, onCancel, isLoading = false }: AccountFormProps) {
  const { roles } = useRoles();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    roleId: '',
    museumId: '70215e6b-b55a-455f-8db5-fded0645dbef', // Default museum ID
  });

  useEffect(() => {
    if (account) {
      setFormData({
        email: account.email,
        password: '', // Don't pre-fill password for security
        fullName: account.fullName,
        roleId: account.roleId,
        museumId: account.museumId || '70215e6b-b55a-455f-8db5-fded0645dbef',
      });
    } else {
      setFormData({
        email: '',
        password: '',
        fullName: '',
        roleId: '164159b2-7719-4e99-a04f-c8f0fcb037ad', // Default to Admin UUID
        museumId: '70215e6b-b55a-455f-8db5-fded0645dbef', // Default to first museum UUID
      });
    }
  }, [account]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email.trim() || !formData.fullName.trim()) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (!account && !formData.password.trim()) {
      alert('Vui lòng nhập mật khẩu cho tài khoản mới');
      return;
    }

    // Ensure password is not empty for new accounts
    const submitData = {
      ...formData,
      password: formData.password || 'defaultPassword123!', // Fallback password
    };

    onSave(submitData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
          {account ? 'Chỉnh sửa tài khoản' : 'Tạo tài khoản mới'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Nhập email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu {!account && '*'}
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder={account ? "Để trống nếu không muốn thay đổi" : "Nhập mật khẩu"}
              required={!account}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Họ tên *
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Nhập họ tên"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vai trò *
            </label>
            <select
              name="roleId"
              value={formData.roleId}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              <option value="">Chọn vai trò</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bảo tàng *
            </label>
            <select
              name="museumId"
              value={formData.museumId}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              <option value="70215e6b-b55a-455f-8db5-fded0645dbef">Bảo tàng quân đội HCM</option>
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
              className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Đang lưu...' : (account ? 'Cập nhật' : 'Tạo mới')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
