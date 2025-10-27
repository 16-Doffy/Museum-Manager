'use client';

import { useArtifacts, useAreas } from '../../lib/api/hooks';
import { useState, useMemo, useCallback } from 'react';
import { useDebounce } from '../../lib/hooks/useDebounce';
import ArtifactForm from './ArtifactForm';
import ArtifactDetail from './ArtifactDetail';
import { Artifact, ArtifactCreateRequest, ArtifactUpdateRequest } from '../../lib/api/types';
import { Plus } from 'lucide-react';

export default function CollectionTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const [pageIndex, setPageIndex] = useState(1);
  const pageSize = 10;
  const [showForm, setShowForm] = useState(false);
  const [editingArtifact, setEditingArtifact] = useState<Artifact | null>(null);
  const [viewingArtifact, setViewingArtifact] = useState<Artifact | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Debounce search term to avoid too many API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  const searchParams = useMemo(() => ({
    pageIndex,
    pageSize,
    search: debouncedSearchTerm,
  }), [pageIndex, pageSize, debouncedSearchTerm]);

  const { 
    artifacts, 
    loading, 
    error, 
    pagination,
    fetchArtifacts,
    createArtifact,
    updateArtifact,
    deleteArtifact
  } = useArtifacts(searchParams);

  // Get areas for dropdown
  const { areas } = useAreas({
    pageIndex: 1,
    pageSize: 100, // Get all areas
  });

  // Helper to get area name from areaId
  const getAreaName = useCallback((areaId: string) => {
    const area = areas.find(a => a.id === areaId);
    return area?.name || 'N/A';
  }, [areas]);

  const handleSearch = useCallback((newSearchTerm: string) => {
    setSearchTerm(newSearchTerm);
    setPageIndex(1); // Reset to first page when searching
  }, []);

  const handleCreate = useCallback(() => {
    setEditingArtifact(null);
    setShowForm(true);
  }, []);

  const handleEdit = useCallback((id: string) => {
    const artifact = artifacts.find(a => a.id === id);
    if (artifact) {
      setEditingArtifact(artifact);
      setShowForm(true);
    }
  }, [artifacts]);

  const handleView = useCallback((id: string) => {
    const artifact = artifacts.find(a => a.id === id);
    if (artifact) {
      setViewingArtifact(artifact);
    }
  }, [artifacts]);

  const handleDelete = useCallback(async (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa hiện vật này?')) {
      try {
        setIsSubmitting(true);
        await deleteArtifact(id);
        alert('Xóa hiện vật thành công');
      } catch (error) {
        console.error('Delete error:', error);
        alert('Lỗi khi xóa hiện vật');
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [deleteArtifact]);

  const handleSave = useCallback(async (data: ArtifactCreateRequest | ArtifactUpdateRequest) => {
    try {
      setIsSubmitting(true);
      
      // Validate required fields
      if (!data.name?.trim()) {
        alert('Tên hiện vật là bắt buộc');
        return;
      }
      
      if (editingArtifact) {
        // For update, send all form data
        const updateData: ArtifactUpdateRequest = {
          name: data.name,
          description: data.description,
          periodTime: data.periodTime,
          year: data.year,
          isOriginal: data.isOriginal,
          weight: data.weight,
          height: data.height,
          width: data.width,
          length: data.length,
          areaId: data.areaId,
        };
        
        await updateArtifact(editingArtifact.id, updateData);
        alert('Cập nhật hiện vật thành công');
      } else {
        await createArtifact(data as ArtifactCreateRequest);
        alert('Tạo hiện vật mới thành công');
      }
      setShowForm(false);
      setEditingArtifact(null);
    } catch (error) {
      console.error('Save error:', error);
      alert('Lỗi khi lưu hiện vật');
    } finally {
      setIsSubmitting(false);
    }
  }, [editingArtifact, createArtifact, updateArtifact]);

  const handleCancel = useCallback(() => {
    setShowForm(false);
    setEditingArtifact(null);
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="p-8 text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Lỗi tải dữ liệu</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => fetchArtifacts()}
            className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {showForm && (
        <ArtifactForm
          artifact={editingArtifact || undefined}
          onSave={handleSave}
          onCancel={handleCancel}
          isLoading={isSubmitting}
          areas={areas.map(area => ({ id: area.id, name: area.name }))}
        />
      )}
      
      <div className="bg-white rounded-xl shadow overflow-hidden">
      {/* Search Bar */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Tìm kiếm hiện vật..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm hiện vật</span>
          </button>
          <div className="text-sm text-gray-500">
            {pagination.totalItems} hiện vật
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-emerald-50">
            <tr>
              <th className="p-3 text-emerald-700 font-semibold">Mã hiện vật</th>
              <th className="p-3 text-emerald-700 font-semibold">Tên hiện vật</th>
              <th className="p-3 text-emerald-700 font-semibold">Thời kỳ</th>
              <th className="p-3 text-emerald-700 font-semibold">Kích thước</th>
              <th className="p-3 text-emerald-700 font-semibold">Khu vực</th>
              <th className="p-3 text-emerald-700 font-semibold">Trạng thái</th>
              <th className="p-3 text-emerald-700 font-semibold">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {!artifacts || artifacts.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-500">
                  Không có hiện vật nào
                </td>
              </tr>
            ) : (
              artifacts?.map((artifact) => (
                <tr key={artifact.id} className="border-t hover:bg-gray-50">
                  <td className="p-3 text-gray-800 font-medium">{artifact.code || 'N/A'}</td>
                  <td className="p-3 text-gray-800 font-medium">{artifact.name}</td>
                  <td className="p-3 text-gray-700">{artifact.periodTime || 'N/A'}</td>
                  <td className="p-3 text-gray-700">
                    {artifact.width && artifact.height && artifact.length 
                      ? `${artifact.width}×${artifact.height}×${artifact.length}cm`
                      : 'N/A'
                    }
                  </td>
                  <td className="p-3 text-gray-700">{getAreaName(artifact.areaId || '')}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      artifact.status === 'Active' || artifact.isActive
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {artifact.status === 'Active' || artifact.isActive ? 'Hoạt động' : 'Không hoạt động'}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleView(artifact.id)}
                        className="text-blue-600 hover:text-blue-800 text-sm px-2 py-1 rounded hover:bg-blue-50"
                      >
                        Xem
                      </button>
                      <button 
                        onClick={() => handleEdit(artifact.id)}
                        className="text-emerald-600 hover:text-emerald-800 text-sm px-2 py-1 rounded hover:bg-emerald-50"
                      >
                        Sửa
                      </button>
                      <button 
                        onClick={() => handleDelete(artifact.id)}
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

      {/* Artifact Detail Modal */}
      {viewingArtifact && (
        <ArtifactDetail
          artifact={viewingArtifact}
          onClose={() => setViewingArtifact(null)}
        />
      )}

      {/* Artifact Form Modal */}
      {showForm && (
        <ArtifactForm
          artifact={editingArtifact}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingArtifact(null);
          }}
          isLoading={isSubmitting}
          areas={areas.map(area => ({ id: area.id, name: area.name }))}
        />
      )}
    </div>
    </>
  );
}
