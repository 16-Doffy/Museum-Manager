'use client';

import { useState, useCallback, useMemo } from 'react';
import { HistoricalContext } from '../../lib/api/types';
import { HistoricalContextForm } from './HistoricalContextForm';
import { HistoricalContextDetail } from './HistoricalContextDetail';

interface HistoricalContextTableProps {
  historicalContexts: HistoricalContext[];
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
  onEdit: (historicalContext: HistoricalContext) => void;
  onDelete: (id: string) => void;
  createHistoricalContext: (data: any) => Promise<HistoricalContext>;
  updateHistoricalContext: (id: string, data: any) => Promise<HistoricalContext>;
}

export function HistoricalContextTable({
  historicalContexts,
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
  createHistoricalContext,
  updateHistoricalContext,
}: HistoricalContextTableProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingHistoricalContext, setEditingHistoricalContext] = useState<HistoricalContext | undefined>();
  const [viewingHistoricalContext, setViewingHistoricalContext] = useState<HistoricalContext | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = useCallback(() => {
    setEditingHistoricalContext(undefined);
    setShowForm(true);
  }, []);

  const handleEdit = useCallback((historicalContext: HistoricalContext) => {
    setEditingHistoricalContext(historicalContext);
    setShowForm(true);
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa ngữ cảnh lịch sử này?')) {
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
      if (editingHistoricalContext) {
        await updateHistoricalContext(editingHistoricalContext.id, data);
        alert('Cập nhật ngữ cảnh lịch sử thành công');
      } else {
        await createHistoricalContext(data);
        alert('Tạo ngữ cảnh lịch sử mới thành công');
      }
      setShowForm(false);
      setEditingHistoricalContext(undefined);
    } catch (error) {
      console.error('Save error:', error);
      alert('Lỗi khi lưu ngữ cảnh lịch sử');
    } finally {
      setIsSubmitting(false);
    }
  }, [editingHistoricalContext, createHistoricalContext, updateHistoricalContext]);

  const handleCancel = useCallback(() => {
    setShowForm(false);
    setEditingHistoricalContext(undefined);
  }, []);

  const filteredHistoricalContexts = useMemo(() => {
    if (!historicalContexts) return [];
    return historicalContexts.filter(hc => {
      if (statusFilter && statusFilter !== '-' && hc.status !== statusFilter) {
        return false;
      }
      if (searchTerm && !hc.title.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [historicalContexts, statusFilter, searchTerm]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
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
            placeholder="Tìm kiếm ngữ cảnh lịch sử..."
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
            <option value="Active">Hoạt động</option>
            <option value="Deleted">Đã xóa</option>
          </select>
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Thêm ngữ cảnh lịch sử mới
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tiêu đề
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thời kỳ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mô tả
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Số hiện vật
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
            ) : filteredHistoricalContexts.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  Không có ngữ cảnh lịch sử nào
                </td>
              </tr>
            ) : (
              filteredHistoricalContexts.map((hc) => (
                <tr key={hc.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{hc.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{hc.period || '-'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div
                      className="text-sm text-gray-900 max-w-xs cursor-pointer hover:text-blue-600 transition-colors"
                      title={hc.description || undefined}
                      onClick={() => setViewingHistoricalContext(hc)}
                    >
                      {hc.description ? (
                        <>
                          <span className="line-clamp-2">{hc.description}</span>
                          {hc.description.length > 60 && (
                            <span className="text-blue-600 text-xs ml-1">(Xem chi tiết)</span>
                          )}
                        </>
                      ) : (
                        '-'
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(hc.status)}`}>
                      {hc.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{hc.artifacts?.length || 0}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setViewingHistoricalContext(hc)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Xem
                      </button>
                      <button
                        onClick={() => handleEdit(hc)}
                        className="text-blue-600 hover:text-blue-900"
                        disabled={hc.status === 'Deleted'}
                      >
                        Sửa
                      </button>
                      {hc.status !== 'Deleted' && (
                        <button
                          onClick={() => handleDelete(hc.id)}
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
            {pagination.totalItems} ngữ cảnh lịch sử
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
        <HistoricalContextForm
          historicalContext={editingHistoricalContext}
          onSave={handleSave}
          onCancel={handleCancel}
          loading={isSubmitting}
        />
      )}

      {/* Detail Modal */}
      {viewingHistoricalContext && (
        <HistoricalContextDetail 
          historicalContext={viewingHistoricalContext} 
          onClose={() => setViewingHistoricalContext(undefined)}
          onRefresh={() => window.location.reload()}
        />
      )}
    </div>
  );
}

