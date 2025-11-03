'use client';

import { useState, useCallback, useMemo } from 'react';
import { DisplayPosition } from '../../lib/api/types';
import { DisplayPositionForm } from './DisplayPositionForm';
import { DisplayPositionDetail } from './DisplayPositionDetail';

interface DisplayPositionTableProps {
  displayPositions: DisplayPosition[];
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
  areaName: string;
  setAreaName: (term: string) => void;
  includeDeleted: boolean;
  setIncludeDeleted: (include: boolean) => void;
  onPageChange: (page: number) => void;
  onEdit: (displayPosition: DisplayPosition) => void;
  onDelete: (id: string) => void;
  createDisplayPosition: (data: any) => Promise<DisplayPosition>;
  updateDisplayPosition: (id: string, data: any) => Promise<DisplayPosition>;
  activateDisplay?: (id: string) => Promise<any>;
  maintainDisplay?: (id: string) => Promise<any>;
  areas?: Array<{ id: string; name: string; description?: string }>;
}

export function DisplayPositionTable({
  displayPositions,
  loading,
  error,
  pagination,
  searchTerm,
  setSearchTerm,
  areaName,
  setAreaName,
  includeDeleted,
  setIncludeDeleted,
  onPageChange,
  onEdit,
  onDelete,
  createDisplayPosition,
  updateDisplayPosition,
  activateDisplay,
  maintainDisplay,
  areas = [],
}: DisplayPositionTableProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingPosition, setEditingPosition] = useState<DisplayPosition | undefined>();
  const [viewingPosition, setViewingPosition] = useState<DisplayPosition | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [changingId, setChangingId] = useState<string | null>(null);

  // Helper to get area name from areaId
  const getAreaName = useCallback((areaId: string) => {
    const area = areas.find(a => a.id === areaId);
    return area?.name || '-';
  }, [areas]);

  const handleCreate = useCallback(() => {
    setEditingPosition(undefined);
    setShowForm(true);
  }, []);

  const handleEdit = useCallback((position: DisplayPosition) => {
    setEditingPosition(position);
    setShowForm(true);
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa vị trí trưng bày này?')) {
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
      if (editingPosition) {
        // Update existing position
        await updateDisplayPosition(editingPosition.id, data);
        alert('Cập nhật vị trí trưng bày thành công');
      } else {
        // Create new position
        await createDisplayPosition(data);
        alert('Tạo vị trí trưng bày mới thành công');
      }
      setShowForm(false);
      setEditingPosition(undefined);
    } catch (error) {
      console.error('Save error:', error);
      alert('Lỗi khi lưu vị trí trưng bày');
    } finally {
      setIsSubmitting(false);
    }
  }, [editingPosition, createDisplayPosition, updateDisplayPosition]);

  const handleCancel = useCallback(() => {
    setShowForm(false);
    setEditingPosition(undefined);
  }, []);

  const filteredPositions = useMemo(() => {
    if (!displayPositions) return [];
    return displayPositions.filter(position => {
      if (!includeDeleted && position.isDeleted) return false;
      if (searchTerm && !position.displayPositionName.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      if (areaName && !position.area?.name.toLowerCase().includes(areaName.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [displayPositions, includeDeleted, searchTerm, areaName]);

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
            placeholder="Tìm kiếm vị trí trưng bày..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex-1">
          <input
            type="text"
            placeholder="Tìm kiếm theo khu vực..."
            value={areaName}
            onChange={(e) => setAreaName(e.target.value)}
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
            Thêm vị trí mới
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tên vị trí
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mã vị trí
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Khu vực
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mô tả
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
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  Đang tải...
                </td>
              </tr>
            ) : filteredPositions.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  Không có vị trí trưng bày nào
                </td>
              </tr>
            ) : (
              filteredPositions.map((position) => (
                <tr key={position.id} className={position.isDeleted ? 'bg-gray-100' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{position.displayPositionName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{position.positionCode}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{getAreaName(position.areaId || '')}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div
                      className="text-sm text-gray-900 max-w-xs cursor-pointer hover:text-blue-600 transition-colors"
                      title={position.description || undefined}
                      onClick={() => setViewingPosition(position)}
                    >
                      {position.description ? (
                        <>
                          <span className="line-clamp-2">{position.description}</span>
                          {position.description.length > 60 && (
                            <span className="text-blue-600 text-xs ml-1">(Xem chi tiết)</span>
                          )}
                        </>
                      ) : (
                        '-'
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {(() => {
                      const isActive = (position as any).isActive ?? ((position as any).status === 'Active');
                      const isDeleted = (position as any).isDeleted ?? ((position as any).status === 'Deleted');
                      return (
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            isDeleted
                              ? 'bg-red-100 text-red-800'
                              : isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {isDeleted ? 'Đã xóa' : isActive ? 'Hoạt động' : 'Không hoạt động'}
                        </span>
                      );
                    })()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setViewingPosition(position)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Xem
                      </button>
                      <button
                        onClick={() => handleEdit(position)}
                        className="text-blue-600 hover:text-blue-900"
                        disabled={position.isDeleted}
                      >
                        Sửa
                      </button>
                      {!((position as any).isDeleted ?? ((position as any).status === 'Deleted')) && (
                        (((position as any).isActive ?? ((position as any).status === 'Active'))) ? (
                          <button
                            onClick={async () => {
                              if (!maintainDisplay) return;
                              try {
                                setChangingId(position.id);
                                await maintainDisplay(position.id);
                              } catch (e: any) {
                                alert(e?.message || 'Không thể chuyển sang bảo trì');
                              } finally {
                                setChangingId(null);
                              }
                            }}
                            disabled={changingId === position.id}
                            className="text-yellow-600 hover:text-yellow-800 disabled:opacity-50"
                          >
                            {changingId === position.id ? 'Đang xử lý...' : 'Bảo trì'}
                          </button>
                        ) : (
                          <button
                            onClick={async () => {
                              if (!activateDisplay) return;
                              try {
                                setChangingId(position.id);
                                await activateDisplay(position.id);
                              } catch (e: any) {
                                alert(e?.message || 'Không thể kích hoạt');
                              } finally {
                                setChangingId(null);
                              }
                            }}
                            disabled={changingId === position.id}
                            className="text-green-600 hover:text-green-800 disabled:opacity-50"
                          >
                            {changingId === position.id ? 'Đang xử lý...' : 'Kích hoạt'}
                          </button>
                        )
                      )}
                      {!position.isDeleted && (
                        <button
                          onClick={() => handleDelete(position.id)}
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
            {pagination.totalItems} vị trí trưng bày
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
        <DisplayPositionForm
          displayPosition={editingPosition}
          onSave={handleSave}
          onCancel={handleCancel}
          loading={isSubmitting}
          areas={areas}
        />
      )}

      {/* Detail Modal */}
      {viewingPosition && (
        <DisplayPositionDetail
          displayPosition={viewingPosition}
          onClose={() => setViewingPosition(undefined)}
          getAreaName={getAreaName}
        />
      )}
    </div>
  );
}
