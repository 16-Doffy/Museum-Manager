'use client';

import { useState, useMemo, useCallback } from 'react';
import { useDebounce } from '../../lib/hooks/useDebounce';
import { useVisitors } from '../../lib/api/hooks';
import { Visitor, VisitorCreateRequest, VisitorUpdateRequest } from '../../lib/api/types';
import VisitorForm from './VisitorForm';

interface VisitorTableProps {
  onCreate: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function VisitorTable({ onCreate, onEdit, onDelete }: VisitorTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [pageIndex, setPageIndex] = useState(1);
  const pageSize = 10;
  const [showForm, setShowForm] = useState(false);
  const [editingVisitor, setEditingVisitor] = useState<Visitor | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Debounce search term to avoid too many API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  const searchParams = useMemo(() => ({
    pageIndex,
    pageSize,
    search: debouncedSearchTerm,
  }), [pageIndex, pageSize, debouncedSearchTerm]);

  const { 
    visitors, 
    loading, 
    error, 
    pagination,
    fetchVisitors,
    createVisitor,
    updateVisitor,
    deleteVisitor
  } = useVisitors(searchParams);

  const handleSearch = useCallback((newSearchTerm: string) => {
    setSearchTerm(newSearchTerm);
    setPageIndex(1); // Reset to first page when searching
  }, []);

  const handleCreate = useCallback(() => {
    setEditingVisitor(null);
    setShowForm(true);
  }, []);

  const handleEdit = useCallback((id: string) => {
    const visitor = visitors.find(v => v.id === id);
    if (visitor) {
      setEditingVisitor(visitor);
      setShowForm(true);
    }
  }, [visitors]);

  const handleSave = useCallback(async (data: VisitorCreateRequest | VisitorUpdateRequest) => {
    setIsSubmitting(true);
    try {
      if (editingVisitor) {
        await updateVisitor(editingVisitor.id, data as VisitorUpdateRequest);
      } else {
        await createVisitor(data as VisitorCreateRequest);
      }
      setShowForm(false);
      setEditingVisitor(null);
    } catch (err) {
      alert(`Lỗi khi lưu khách tham quan: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsSubmitting(false);
    }
  }, [editingVisitor, createVisitor, updateVisitor]);

  const handleDelete = useCallback(async (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa khách tham quan này?')) {
      try {
        setIsSubmitting(true);
        await deleteVisitor(id);
      } catch (err) {
        alert(`Lỗi khi xóa khách tham quan: ${err instanceof Error ? err.message : String(err)}`);
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [deleteVisitor]);

  if (loading) return <div className="text-center p-8">Đang tải khách tham quan...</div>;
  if (error) return <div className="text-center p-8 text-red-600">Lỗi: {error}</div>;

  return (
    <>
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Tìm kiếm khách tham quan..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <div className="text-sm text-gray-500">
              {pagination.totalItems} khách tham quan
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-emerald-50">
              <tr>
                <th className="p-3 text-emerald-700 font-semibold">Số điện thoại</th>
                <th className="p-3 text-emerald-700 font-semibold">Trạng thái</th>
                <th className="p-3 text-emerald-700 font-semibold">Ngày tạo</th>
                <th className="p-3 text-emerald-700 font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {visitors.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">
                    Không có khách tham quan nào
                  </td>
                </tr>
              ) : (
                visitors.map((visitor) => (
                  <tr key={visitor.id} className="border-t hover:bg-gray-50">
                    <td className="p-3 text-gray-800 font-medium">{visitor.phoneNumber}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        visitor.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {visitor.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                      </span>
                    </td>
                    <td className="p-3 text-gray-700">
                      {new Date(visitor.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="p-3">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleEdit(visitor.id)}
                          className="text-emerald-600 hover:text-emerald-800 text-sm px-2 py-1 rounded hover:bg-emerald-50"
                        >
                          Sửa
                        </button>
                        <button 
                          onClick={() => handleDelete(visitor.id)}
                          className="text-red-600 hover:text-red-800 text-sm px-2 py-1 rounded hover:bg-red-50"
                        >
                          Xóa
                        </button>
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
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Trang {pagination.pageIndex} / {pagination.totalPages}
              </div>
              <div className="flex space-x-2">
                <button
                  disabled={pagination.pageIndex === 1}
                  onClick={() => setPageIndex(prev => prev - 1)}
                  className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Trước
                </button>
                <button
                  disabled={pagination.pageIndex === pagination.totalPages}
                  onClick={() => setPageIndex(prev => prev + 1)}
                  className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Sau
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Visitor Form Modal */}
        {showForm && (
          <VisitorForm
            visitor={editingVisitor || undefined}
            onSave={handleSave}
            onCancel={() => {
              setShowForm(false);
              setEditingVisitor(null);
            }}
            isLoading={isSubmitting}
          />
        )}
      </div>
    </>
  );
}
