'use client';

import { DisplayPosition } from '../../lib/api/types';
import { FiX } from 'react-icons/fi';

interface DisplayPositionDetailProps {
  displayPosition: DisplayPosition;
  onClose: () => void;
  getAreaName?: (areaId: string) => string;
}

export function DisplayPositionDetail({ displayPosition, onClose, getAreaName }: DisplayPositionDetailProps) {
  const isActive = (displayPosition as any).isActive ?? ((displayPosition as any).status === 'Active');
  const isDeleted = (displayPosition as any).isDeleted ?? ((displayPosition as any).status === 'Deleted');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-emerald-600">Chi tiết vị trí trưng bày</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên vị trí</label>
              <p className="text-lg font-semibold text-gray-900">{displayPosition.displayPositionName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mã vị trí</label>
              <p className="text-lg font-mono text-gray-900">{displayPosition.positionCode}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Khu vực</label>
            <p className="text-gray-900">
              {displayPosition.area?.name || (getAreaName ? getAreaName(displayPosition.areaId) : '-')}
            </p>
          </div>

          {displayPosition.description && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
              <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">{displayPosition.description}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
            <span
              className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                isDeleted
                  ? 'bg-red-100 text-red-800'
                  : isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {isDeleted ? 'Đã xóa' : isActive ? 'Hoạt động' : 'Bảo trì'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ngày tạo</label>
              <p className="text-sm text-gray-600">
                {new Date(displayPosition.createdAt).toLocaleDateString('vi-VN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cập nhật lần cuối</label>
              <p className="text-sm text-gray-600">
                {new Date(displayPosition.updatedAt).toLocaleDateString('vi-VN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

