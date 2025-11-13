'use client';

import { useState, useEffect } from 'react';
import { Exhibition, HistoricalContext, RemoveHistoricalContextRequest } from '../../lib/api/types';
import { ExhibitionService } from '../../lib/api/exhibitionService';
import { useHistoricalContexts } from '../../lib/api/hooks';
import { FiX } from 'react-icons/fi';

interface ExhibitionDetailProps {
  exhibition: Exhibition;
  onClose: () => void;
  onRefresh: () => void;
}

export function ExhibitionDetail({ exhibition, onClose, onRefresh }: ExhibitionDetailProps) {
  const { historicalContexts, fetchHistoricalContexts } = useHistoricalContexts({ pageIndex: 1, pageSize: 100 });
  const [selectedHistoricalContexts, setSelectedHistoricalContexts] = useState<string[]>([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchHistoricalContexts();
  }, [fetchHistoricalContexts]);

  const handleRemoveHistoricalContexts = async () => {
    if (selectedHistoricalContexts.length === 0) {
      alert('Vui lòng chọn ít nhất một ngữ cảnh lịch sử để xóa');
      return;
    }

    if (!window.confirm(`Bạn có chắc chắn muốn xóa ${selectedHistoricalContexts.length} ngữ cảnh lịch sử khỏi triển lãm này?`)) {
      return;
    }

    try {
      setLoading(true);
      const data: RemoveHistoricalContextRequest = {
        historicalContextIds: selectedHistoricalContexts,
      };
      await ExhibitionService.removeHistoricalContexts(exhibition.id, data);
      alert('Xóa ngữ cảnh lịch sử thành công');
      setShowRemoveModal(false);
      setSelectedHistoricalContexts([]);
      onRefresh();
    } catch (error) {
      console.error('Error removing historical contexts:', error);
      alert('Lỗi khi xóa ngữ cảnh lịch sử');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-blue-600">Chi tiết triển lãm</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên triển lãm</label>
              <p className="text-lg font-semibold text-gray-900">{exhibition.name}</p>
            </div>

            {exhibition.description && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">{exhibition.description}</p>
              </div>
            )}

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Độ ưu tiên</label>
                <p className="text-gray-900">{exhibition.priority}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                <p className="text-gray-900">{exhibition.status}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày bắt đầu</label>
                <p className="text-gray-900">
                  {new Date(exhibition.startDate).toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày kết thúc</label>
                <p className="text-gray-900">
                  {new Date(exhibition.endDate).toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>

            {/* Historical Contexts Section */}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Ngữ cảnh lịch sử ({exhibition.historicalContexts?.length || 0})
                </label>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowRemoveModal(true)}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                    disabled={!exhibition.historicalContexts || exhibition.historicalContexts.length === 0}
                  >
                    Xóa ngữ cảnh lịch sử
                  </button>
                </div>
              </div>
              {exhibition.historicalContexts && exhibition.historicalContexts.length > 0 ? (
                <div className="space-y-2">
                  {exhibition.historicalContexts.map((hc) => (
                    <div key={hc.id} className="p-3 bg-gray-50 rounded-md">
                      <p className="font-medium text-gray-900">{hc.title}</p>
                      {hc.period && <p className="text-sm text-gray-600">Thời kỳ: {hc.period}</p>}
                      {hc.description && (
                        <p className="text-sm text-gray-600 mt-1">{hc.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Chưa có ngữ cảnh lịch sử nào</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày tạo</label>
                <p className="text-sm text-gray-600">
                  {new Date(exhibition.createdAt).toLocaleDateString('vi-VN', {
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
                  {new Date(exhibition.updatedAt).toLocaleDateString('vi-VN', {
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

      {/* Remove Historical Contexts Modal */}
      {showRemoveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Xóa ngữ cảnh lịch sử</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chọn ngữ cảnh lịch sử để xóa:
              </label>
              <select
                multiple
                value={selectedHistoricalContexts}
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions, option => option.value);
                  setSelectedHistoricalContexts(selected);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                size={5}
              >
                {exhibition.historicalContexts?.map((hc) => (
                  <option key={hc.id} value={hc.id}>
                    {hc.title} {hc.period ? `(${hc.period})` : ''}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Giữ Ctrl (hoặc Cmd trên Mac) để chọn nhiều
              </p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowRemoveModal(false);
                  setSelectedHistoricalContexts([]);
                }}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                disabled={loading}
              >
                Hủy
              </button>
              <button
                onClick={handleRemoveHistoricalContexts}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
                disabled={loading || selectedHistoricalContexts.length === 0}
              >
                {loading ? 'Đang xóa...' : 'Xóa'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

