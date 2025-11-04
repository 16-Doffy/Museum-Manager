'use client';

import { useArtifacts, useAreas, useDisplayPositions } from '../../lib/api/hooks';
import { useState, useMemo, useCallback } from 'react';
import { useDebounce } from '../../lib/hooks/useDebounce';
import ArtifactForm from './ArtifactForm';
import ArtifactDetail from './ArtifactDetail';
import { Artifact, ArtifactCreateRequest, ArtifactUpdateRequest } from '../../lib/api/types';
import { apiClient } from '../../lib/api/client';
import { artifactEndpoints } from '../../lib/api/endpoints';
import { Plus } from 'lucide-react';

export default function CollectionTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const [pageIndex, setPageIndex] = useState(1);
  const pageSize = 10;
  const [showForm, setShowForm] = useState(false);
  const [editingArtifact, setEditingArtifact] = useState<Artifact | null>(null);
  const [viewingArtifact, setViewingArtifact] = useState<Artifact | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assigningArtifact, setAssigningArtifact] = useState<Artifact | null>(null);
  const [selectedDisplayId, setSelectedDisplayId] = useState<string>('');
  
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
    deleteArtifact,
    assignArtifactToDisplay,
    removeArtifactDisplay,
    addArtifactMedia,
    updateArtifactMedia,
    deleteArtifactMedia,
  } = useArtifacts(searchParams);

  // Get areas for dropdown
  const { areas } = useAreas({
    pageIndex: 1,
    pageSize: 100, // Get all areas
  });

  // Get display positions for assignment dropdown
  const { displayPositions } = useDisplayPositions({ pageIndex: 1, pageSize: 100 });

  // Helper to get area name from areaId
  const getAreaName = useCallback((areaId: string) => {
    const area = areas.find(a => a.id === areaId);
    return area?.name || 'N/A';
  }, [areas]);

  const getDimensionsText = useCallback((artifact: Artifact) => {
    const anyA = artifact as any;
    const w = anyA.width ?? anyA.w ?? anyA.sizeWidth ?? anyA.widthCm;
    const h = anyA.height ?? anyA.h ?? anyA.sizeHeight ?? anyA.heightCm;
    const l = anyA.length ?? anyA.l ?? anyA.sizeLength ?? anyA.lengthCm;
    const hasAny = [w, h, l].some(v => v !== undefined && v !== null && v !== '');
    if (!hasAny) return 'N/A';
    const x = `${w ?? '-'}×${h ?? '-'}×${l ?? '-'}cm`;
    return x;
  }, []);

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

  const handleAssign = useCallback(async () => {
    if (!assigningArtifact || !selectedDisplayId) return;
    try {
      setIsSubmitting(true);
      await assignArtifactToDisplay(assigningArtifact.id, selectedDisplayId);
      alert('Gán vị trí thành công');
      setAssigningArtifact(null);
      setSelectedDisplayId('');
    } catch (e) {
      alert('Không thể gán vị trí');
    } finally {
      setIsSubmitting(false);
    }
  }, [assigningArtifact, selectedDisplayId, assignArtifactToDisplay]);

  const handleRemoveAssign = useCallback(async (artifactId: string) => {
    try {
      setIsSubmitting(true);
      await removeArtifactDisplay(artifactId);
      alert('Bỏ gán vị trí thành công');
    } catch (e) {
      alert('Không thể bỏ gán vị trí');
    } finally {
      setIsSubmitting(false);
    }
  }, [removeArtifactDisplay]);

  // Media handlers
  const handleAddMedia = useCallback(async (artifactId: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        setIsSubmitting(true);
        await addArtifactMedia(artifactId, file);
        // Fetch fresh artifact detail to ensure correct shape (some upload APIs return only status)
        const fresh = await apiClient.get<Artifact>(artifactEndpoints.getById(artifactId));
        alert('Thêm media thành công');
        if (fresh?.data) setViewingArtifact(fresh.data);
      } catch (e) {
        alert('Lỗi khi thêm media');
      } finally {
        setIsSubmitting(false);
      }
    };
    input.click();
  }, [addArtifactMedia]);

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
        const updated = await updateArtifact(editingArtifact.id, updateData);
        alert('Cập nhật hiện vật thành công');
        // Liên kết 3 form: sau khi cập nhật mở ngay chi tiết với dữ liệu mới nhất
        if (updated) setViewingArtifact(updated as unknown as Artifact);
      } else {
        const created = await createArtifact(data as ArtifactCreateRequest);
        alert('Tạo hiện vật mới thành công');
        if (created) setViewingArtifact(created as unknown as Artifact);
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
      {/* Search Bar - Hidden */}
      {/* <div className="p-4 border-b border-gray-200">
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
      </div> */}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-emerald-50">
            <tr>
              <th className="p-3 text-emerald-700 font-semibold">Tên hiện vật</th>
              <th className="p-3 text-emerald-700 font-semibold">Thời kỳ</th>
              <th className="p-3 text-emerald-700 font-semibold">Kích thước</th>
              <th className="p-3 text-emerald-700 font-semibold">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {!artifacts || artifacts.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">
                  Không có hiện vật nào
                </td>
              </tr>
            ) : (
              artifacts?.map((artifact) => (
                <tr key={artifact.id} className="border-t hover:bg-gray-50">
                  <td className="p-3 text-gray-800 font-medium">{artifact.name}</td>
                  <td className="p-3 text-gray-700">{artifact.periodTime || '-'}</td>
                  <td className="p-3 text-gray-700">{getDimensionsText(artifact)}</td>
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
                      <button
                        onClick={() => setAssigningArtifact(artifact)}
                        className="text-indigo-600 hover:text-indigo-800 text-sm px-2 py-1 rounded hover:bg-indigo-50"
                      >
                        Gán vị trí
                      </button>
                      <button
                        onClick={() => handleRemoveAssign(artifact.id)}
                        className="text-yellow-700 hover:text-yellow-900 text-sm px-2 py-1 rounded hover:bg-yellow-50"
                      >
                        Bỏ vị trí
                      </button>
                      <button
                        onClick={() => handleAddMedia(artifact.id)}
                        className="text-gray-600 hover:text-gray-800 text-sm px-2 py-1 rounded hover:bg-gray-50"
                      >
                        Thêm media
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

      {/* Assign Display Modal */}
      {assigningArtifact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4">Gán vị trí cho: {assigningArtifact.name}</h3>
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">Chọn vị trí trưng bày</label>
              <select
                value={selectedDisplayId}
                onChange={(e) => setSelectedDisplayId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">-- Chọn vị trí --</option>
                {displayPositions.map(pos => (
                  <option key={pos.id} value={pos.id}>
                    {pos.displayPositionName} ({pos.positionCode}) - {pos.area?.name || 'Khu vực'}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => { setAssigningArtifact(null); setSelectedDisplayId(''); }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                disabled={isSubmitting}
              >
                Hủy
              </button>
              <button
                onClick={handleAssign}
                className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50"
                disabled={isSubmitting || !selectedDisplayId}
              >
                {isSubmitting ? 'Đang gán...' : 'Gán vị trí'}
              </button>
            </div>
          </div>
        </div>
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
