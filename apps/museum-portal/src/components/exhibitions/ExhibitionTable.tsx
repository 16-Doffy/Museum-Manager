'use client';

import { useState, useCallback, useMemo } from 'react';
import { Exhibition } from '../../lib/api/types';
import { ExhibitionForm } from './ExhibitionForm';
import { ExhibitionDetail } from './ExhibitionDetail';

interface ExhibitionTableProps {
  exhibitions: Exhibition[];
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
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  onPageChange: (page: number) => void;
  onEdit: (exhibition: Exhibition) => void;
  onDelete: (id: string) => void;
  createExhibition: (data: any) => Promise<Exhibition>;
  updateExhibition: (id: string, data: any) => Promise<Exhibition>;
}

export function ExhibitionTable({
  exhibitions,
  loading,
  error,
  pagination,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  onPageChange,
  onEdit,
  onDelete,
  createExhibition,
  updateExhibition,
}: ExhibitionTableProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingExhibition, setEditingExhibition] = useState<Exhibition | undefined>();
  const [viewingExhibition, setViewingExhibition] = useState<Exhibition | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = useCallback(() => {
    setEditingExhibition(undefined);
    setShowForm(true);
  }, []);

  const handleEdit = useCallback((exhibition: Exhibition) => {
    setEditingExhibition(exhibition);
    setShowForm(true);
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa triển lãm này?')) {
      try {
        await onDelete(id);
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
  }, [onDelete]);

  const handleSave = useCallback(async (data: any) => {
    setIsSubmitting(true);
    try {
      if (editingExhibition) {
        await updateExhibition(editingExhibition.id, data);
        alert('Cập nhật triển lãm thành công');
      } else {
        await createExhibition(data);
        alert('Tạo triển lãm mới thành công');
      }
      setShowForm(false);
      setEditingExhibition(undefined);
    } catch (error) {
      console.error('Save error:', error);
      alert('Lỗi khi lưu triển lãm');
    } finally {
      setIsSubmitting(false);
    }
  }, [editingExhibition, createExhibition, updateExhibition]);

  const handleCancel = useCallback(() => {
    setShowForm(false);
    setEditingExhibition(undefined);
  }, []);

  const filteredExhibitions = useMemo(() => {
    if (!exhibitions) return [];
    return exhibitions.filter(exhibition => {
      if (statusFilter && statusFilter !== '-' && exhibition.status !== statusFilter) {
        return false;
      }
      if (searchTerm && !exhibition.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [exhibitions, statusFilter, searchTerm]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'Expired':
        return 'bg-gray-100 text-gray-800';
      case 'Daily':
        return 'bg-purple-100 text-purple-800';
      case 'Deleted':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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
            placeholder="Tìm kiếm triển lãm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="-">Tất cả trạng thái</option>
            <option value="Upcoming">Sắp diễn ra</option>
            <option value="Active">Đang diễn ra</option>
            <option value="Expired">Đã kết thúc</option>
            <option value="Daily">Hàng ngày</option>
            <option value="Deleted">Đã xóa</option>
          </select>
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Thêm triển lãm mới
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tên triển lãm
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mô tả
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày bắt đầu
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày kết thúc
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  Đang tải...
                </td>
              </tr>
            ) : filteredExhibitions.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  Không có triển lãm nào
                </td>
              </tr>
            ) : (
              filteredExhibitions.map((exhibition) => (
                <tr key={exhibition.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{exhibition.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div
                      className="text-sm text-gray-900 max-w-xs cursor-pointer hover:text-blue-600 transition-colors"
                      title={exhibition.description || undefined}
                      onClick={() => setViewingExhibition(exhibition)}
                    >
                      {exhibition.description ? (
                        <>
                          <span className="line-clamp-2">{exhibition.description}</span>
                          {exhibition.description.length > 60 && (
                            <span className="text-blue-600 text-xs ml-1">(Xem chi tiết)</span>
                          )}
                        </>
                      ) : (
                        '-'
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(exhibition.status)}`}>
                      {exhibition.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(exhibition.startDate).toLocaleDateString('vi-VN')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(exhibition.endDate).toLocaleDateString('vi-VN')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setViewingExhibition(exhibition)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Xem
                      </button>
                      <button
                        onClick={() => handleEdit(exhibition)}
                        className="text-blue-600 hover:text-blue-900"
                        disabled={exhibition.status === 'Deleted'}
                      >
                        Sửa
                      </button>
                      {exhibition.status !== 'Deleted' && (
                        <button
                          onClick={() => handleDelete(exhibition.id)}
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
            {pagination.totalItems} triển lãm
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
        <ExhibitionForm
          exhibition={editingExhibition}
          onSave={handleSave}
          onCancel={handleCancel}
          loading={isSubmitting}
        />
      )}

      {/* Detail Modal */}
      {viewingExhibition && (
        <ExhibitionDetail 
          exhibition={viewingExhibition} 
          onClose={() => setViewingExhibition(undefined)}
          onRefresh={() => window.location.reload()}
        />
      )}
    </div>
  );
}

