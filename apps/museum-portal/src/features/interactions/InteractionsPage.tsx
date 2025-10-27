import { useState, useMemo, useCallback } from 'react';
import { useInteractions } from '../../lib/api/hooks';
import { useDebounce } from '../../lib/hooks/useDebounce';
import InteractionForm from '../../components/interactions/InteractionForm';
import { Interaction, InteractionCreateRequest, InteractionUpdateRequest } from '../../lib/api/types';
import { Plus, Users, Eye, MessageSquare, Star } from 'lucide-react';

export default function InteractionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [pageIndex, setPageIndex] = useState(1);
  const pageSize = 10;
  const [showForm, setShowForm] = useState(false);
  const [editingInteraction, setEditingInteraction] = useState<Interaction | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const searchParams = useMemo(() => ({
    pageIndex,
    pageSize,
    ...(debouncedSearchTerm && { search: debouncedSearchTerm }),
  }), [pageIndex, pageSize, debouncedSearchTerm]);

  const {
    interactions,
    loading,
    error,
    pagination,
    fetchInteractions,
    createInteraction,
    updateInteraction,
    deleteInteraction,
  } = useInteractions(searchParams);

  const handleCreate = useCallback(() => {
    setEditingInteraction(null);
    setShowForm(true);
  }, []);

  const handleEdit = useCallback((interaction: Interaction) => {
    setEditingInteraction(interaction);
    setShowForm(true);
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tương tác này?')) {
      try {
        await deleteInteraction(id);
        alert('Xóa tương tác thành công');
      } catch (error) {
        console.error('Delete error:', error);
        alert('Lỗi khi xóa tương tác');
      }
    }
  }, [deleteInteraction]);

  const handleSave = useCallback(async (data: InteractionCreateRequest | InteractionUpdateRequest) => {
    try {
      setIsSubmitting(true);
      
      if (editingInteraction) {
        await updateInteraction(editingInteraction.id, data);
        alert('Cập nhật tương tác thành công');
      } else {
        await createInteraction(data as InteractionCreateRequest);
        alert('Tạo tương tác mới thành công');
      }
      setShowForm(false);
      setEditingInteraction(null);
    } catch (error) {
      console.error('Save error:', error);
      alert('Lỗi khi lưu tương tác');
    } finally {
      setIsSubmitting(false);
    }
  }, [editingInteraction, createInteraction, updateInteraction]);

  const handleCancel = useCallback(() => {
    setShowForm(false);
    setEditingInteraction(null);
  }, []);

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    setPageIndex(1);
  }, []);

  const onPageChange = useCallback((newPage: number) => {
    setPageIndex(newPage);
  }, []);

  if (loading && interactions.length === 0) {
    return <div className="text-center py-8">Đang tải tương tác...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Lỗi: {error}</div>;
  }

  return (
    <>
      {showForm && (
        <InteractionForm
          interaction={editingInteraction || undefined}
          onSave={handleSave}
          onCancel={handleCancel}
          isLoading={isSubmitting}
        />
      )}
      
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý Tương tác</h1>
            <p className="text-gray-600">Hệ thống quản lý bảo tàng</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng tương tác</p>
                <p className="text-2xl font-bold text-gray-900">{pagination.totalItems}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Lượt xem</p>
                <p className="text-2xl font-bold text-gray-900">
                  {interactions.filter(i => i.interactionType === 'VIEW').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <MessageSquare className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Bình luận</p>
                <p className="text-2xl font-bold text-gray-900">
                  {interactions.filter(i => i.interactionType === 'COMMENT').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Đánh giá TB</p>
                <p className="text-2xl font-bold text-gray-900">
                  {interactions.length > 0 
                    ? (interactions.reduce((sum, i) => sum + (i.rating || 0), 0) / interactions.length).toFixed(1)
                    : '0.0'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Actions */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1 max-w-md">
              <input
                type="text"
                placeholder="Tìm kiếm tương tác..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <button
              onClick={handleCreate}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm tương tác</span>
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-emerald-50">
                <tr>
                  <th className="p-3 text-emerald-700 font-semibold">Khách tham quan</th>
                  <th className="p-3 text-emerald-700 font-semibold">Hiện vật</th>
                  <th className="p-3 text-emerald-700 font-semibold">Loại tương tác</th>
                  <th className="p-3 text-emerald-700 font-semibold">Bình luận</th>
                  <th className="p-3 text-emerald-700 font-semibold">Đánh giá</th>
                  <th className="p-3 text-emerald-700 font-semibold">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {!interactions || interactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-3 text-center text-gray-500">
                      Không có tương tác nào.
                    </td>
                  </tr>
                ) : (
                  interactions.map((interaction) => (
                    <tr key={interaction.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50">
                      <td className="p-3 text-gray-800">{interaction.visitorId}</td>
                      <td className="p-3 text-gray-800">{interaction.artifactId}</td>
                      <td className="p-3 text-gray-800">{interaction.interactionType}</td>
                      <td className="p-3 text-gray-800">{interaction.comment || 'N/A'}</td>
                      <td className="p-3 text-gray-800">
                        {interaction.rating ? `${interaction.rating}/5` : 'N/A'}
                      </td>
                      <td className="p-3 text-sm">
                        <button onClick={() => handleEdit(interaction)} className="text-emerald-600 hover:text-emerald-800 mr-3">
                          Sửa
                        </button>
                        <button onClick={() => handleDelete(interaction.id)} className="text-red-600 hover:text-red-800">
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="p-4 flex justify-between items-center border-t border-gray-200">
              <span className="text-sm text-gray-600">
                Hiển thị {((pagination.pageIndex - 1) * pagination.pageSize) + 1} -{' '}
                {Math.min(pagination.pageIndex * pagination.pageSize, pagination.totalItems)} trên {pagination.totalItems}
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => onPageChange(pagination.pageIndex - 1)}
                  disabled={pagination.pageIndex === 1}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50"
                >
                  Trước
                </button>
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`px-3 py-1 border border-gray-300 rounded-md text-sm ${
                      pagination.pageIndex === page ? 'bg-emerald-600 text-white' : 'hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => onPageChange(pagination.pageIndex + 1)}
                  disabled={pagination.pageIndex === pagination.totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50"
                >
                  Sau
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
