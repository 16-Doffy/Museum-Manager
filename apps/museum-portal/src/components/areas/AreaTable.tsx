'use client';

import { useState, useCallback, useMemo } from 'react';
import { Area } from '../../lib/api/types';
import { AreaForm } from './AreaForm';

interface AreaTableProps {
  areas: Area[];
  loading: boolean;
  error: string | null;
  pagination: {
    pageIndex: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  includeDeleted: boolean;
  setIncludeDeleted: (include: boolean) => void;
  onPageChange: (page: number) => void;
  onCreate: () => void;
  onEdit: (area: Area) => void;
  onDelete: (id: string) => void;
  onActivate: (id: string) => void;
  createArea: (data: any) => Promise<Area>;
  updateArea: (id: string, data: any) => Promise<Area>;
  museums?: Array<{ id: string; name: string }>;
}

export function AreaTable({
  areas,
  loading,
  error,
  pagination,
  searchTerm,
  setSearchTerm,
  includeDeleted,
  setIncludeDeleted,
  onPageChange,
  onCreate,
  onEdit,
  onDelete,
  onActivate,
  createArea,
  updateArea,
  museums = [],
}: AreaTableProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingArea, setEditingArea] = useState<Area | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = useCallback(() => {
    setEditingArea(undefined);
    setShowForm(true);
  }, []);

  const handleEdit = useCallback((area: Area) => {
    setEditingArea(area);
    setShowForm(true);
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa khu vực này?')) {
      try {
        await onDelete(id);
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
  }, [onDelete]);

  const handleActivate = useCallback(async (id: string) => {
    try {
      await onActivate(id);
    } catch (error) {
      console.error('Activate error:', error);
    }
  }, [onActivate]);

  const handleSave = useCallback(async (data: any) => {
    setIsSubmitting(true);
    try {
      if (editingArea) {
        // Update existing area
        await updateArea(editingArea.id, data);
        alert('Cập nhật khu vực thành công');
      } else {
        // Create new area
        await createArea(data);
        alert('Tạo khu vực mới thành công');
      }
      setShowForm(false);
      setEditingArea(undefined);
    } catch (error) {
      console.error('Save error:', error);
      alert('Lỗi khi lưu khu vực');
    } finally {
      setIsSubmitting(false);
    }
  }, [editingArea, createArea, updateArea]);

  const handleCancel = useCallback(() => {
    setShowForm(false);
    setEditingArea(undefined);
  }, []);

  const filteredAreas = useMemo(() => {
    if (!areas) return [];
    return areas.filter(area => {
      if (!includeDeleted && area.isDeleted) return false;
      if (searchTerm && !area.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [areas, includeDeleted, searchTerm]);

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-600">Lỗi: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Tìm kiếm khu vực..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={includeDeleted}
              onChange={(e) => setIncludeDeleted(e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm text-gray-600">Bao gồm đã xóa</span>
          </label>
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Thêm khu vực mới
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tên khu vực
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mô tả
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bảo tàng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  Đang tải...
                </td>
              </tr>
            ) : filteredAreas.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  Không có khu vực nào
                </td>
              </tr>
            ) : (
              filteredAreas.map((area) => (
                <tr key={area.id} className={area.isDeleted ? 'bg-gray-100' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{area.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {area.description || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{area.museum?.name || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      area.isDeleted 
                        ? 'bg-red-100 text-red-800' 
                        : area.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {area.isDeleted ? 'Đã xóa' : area.isActive ? 'Hoạt động' : 'Không hoạt động'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(area)}
                        className="text-blue-600 hover:text-blue-900"
                        disabled={area.isDeleted}
                      >
                        Sửa
                      </button>
                      {!area.isActive && !area.isDeleted && (
                        <button
                          onClick={() => handleActivate(area.id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Kích hoạt
                        </button>
                      )}
                      {!area.isDeleted && (
                        <button
                          onClick={() => handleDelete(area.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Xóa
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Hiển thị {((pagination.pageIndex - 1) * pagination.pageSize) + 1} đến{' '}
            {Math.min(pagination.pageIndex * pagination.pageSize, pagination.totalItems)} trong tổng số{' '}
            {pagination.totalItems} khu vực
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onPageChange(pagination.pageIndex - 1)}
              disabled={pagination.pageIndex <= 1}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Trước
            </button>
            <span className="px-3 py-1 text-sm">
              {pagination.pageIndex} / {pagination.totalPages}
            </span>
            <button
              onClick={() => onPageChange(pagination.pageIndex + 1)}
              disabled={pagination.pageIndex >= pagination.totalPages}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sau
            </button>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <AreaForm
          area={editingArea}
          onSave={handleSave}
          onCancel={handleCancel}
          loading={isSubmitting}
          museums={museums}
        />
      )}
    </div>
  );
}
