'use client';

import { useState } from 'react';
import { HistoricalContext, AssignArtifactsRequest, RemoveArtifactsRequest } from '../../lib/api/types';
import { HistoricalContextService } from '../../lib/api/historicalContextService';
import { useArtifacts } from '../../lib/api/hooks';
import { FiX } from 'react-icons/fi';

interface HistoricalContextDetailProps {
  historicalContext: HistoricalContext;
  onClose: () => void;
  onRefresh: () => void;
}

export function HistoricalContextDetail({ historicalContext, onClose, onRefresh }: HistoricalContextDetailProps) {
  const { artifacts, fetchArtifacts } = useArtifacts({ pageIndex: 1, pageSize: 100 });
  const [selectedArtifacts, setSelectedArtifacts] = useState<string[]>([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAssignArtifacts = async () => {
    if (selectedArtifacts.length === 0) {
      alert('Vui lòng chọn ít nhất một hiện vật để gán');
      return;
    }

    try {
      setLoading(true);
      const data: AssignArtifactsRequest = {
        artifactIds: selectedArtifacts,
      };
      await HistoricalContextService.assignArtifacts(historicalContext.id, data);
      alert('Gán hiện vật thành công');
      setShowAssignModal(false);
      setSelectedArtifacts([]);
      onRefresh();
    } catch (error) {
      console.error('Error assigning artifacts:', error);
      alert('Lỗi khi gán hiện vật');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveArtifacts = async () => {
    if (selectedArtifacts.length === 0) {
      alert('Vui lòng chọn ít nhất một hiện vật để xóa');
      return;
    }

    if (!window.confirm(`Bạn có chắc chắn muốn xóa ${selectedArtifacts.length} hiện vật khỏi ngữ cảnh lịch sử này?`)) {
      return;
    }

    try {
      setLoading(true);
      const data: RemoveArtifactsRequest = {
        artifactIds: selectedArtifacts,
      };
      await HistoricalContextService.removeArtifacts(historicalContext.id, data);
      alert('Xóa hiện vật thành công');
      setShowRemoveModal(false);
      setSelectedArtifacts([]);
      onRefresh();
    } catch (error) {
      console.error('Error removing artifacts:', error);
      alert('Lỗi khi xóa hiện vật');
    } finally {
      setLoading(false);
    }
  };

  // Get available artifacts (not already assigned)
  const availableArtifacts = artifacts.filter(
    artifact => !historicalContext.artifacts?.some(a => a.id === artifact.id)
  );

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-green-600">Chi tiết ngữ cảnh lịch sử</h2>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề</label>
              <p className="text-lg font-semibold text-gray-900">{historicalContext.title}</p>
            </div>

            {historicalContext.period && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Thời kỳ</label>
                <p className="text-gray-900">{historicalContext.period}</p>
              </div>
            )}

            {historicalContext.description && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">{historicalContext.description}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
              <p className="text-gray-900">{historicalContext.status}</p>
            </div>

            {/* Artifacts Section */}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Hiện vật ({historicalContext.artifacts?.length || 0})
                </label>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      fetchArtifacts();
                      setShowAssignModal(true);
                    }}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Gán hiện vật
                  </button>
                  <button
                    onClick={() => setShowRemoveModal(true)}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                    disabled={!historicalContext.artifacts || historicalContext.artifacts.length === 0}
                  >
                    Xóa hiện vật
                  </button>
                </div>
              </div>
              {historicalContext.artifacts && historicalContext.artifacts.length > 0 ? (
                <div className="space-y-2">
                  {historicalContext.artifacts.map((artifact) => (
                    <div key={artifact.id} className="p-3 bg-gray-50 rounded-md">
                      <p className="font-medium text-gray-900">{artifact.name}</p>
                      {artifact.code && <p className="text-sm text-gray-600">Mã: {artifact.code}</p>}
                      {artifact.periodTime && <p className="text-sm text-gray-600">Thời kỳ: {artifact.periodTime}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Chưa có hiện vật nào</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày tạo</label>
                <p className="text-sm text-gray-600">
                  {new Date(historicalContext.createdAt).toLocaleDateString('vi-VN', {
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
                  {new Date(historicalContext.updatedAt).toLocaleDateString('vi-VN', {
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

      {/* Assign Artifacts Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Gán hiện vật</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chọn hiện vật để gán:
              </label>
              <select
                multiple
                value={selectedArtifacts}
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions, option => option.value);
                  setSelectedArtifacts(selected);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                size={5}
              >
                {availableArtifacts.map((artifact) => (
                  <option key={artifact.id} value={artifact.id}>
                    {artifact.name} {artifact.code ? `(${artifact.code})` : ''}
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
                  setShowAssignModal(false);
                  setSelectedArtifacts([]);
                }}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                disabled={loading}
              >
                Hủy
              </button>
              <button
                onClick={handleAssignArtifacts}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                disabled={loading || selectedArtifacts.length === 0}
              >
                {loading ? 'Đang gán...' : 'Gán'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remove Artifacts Modal */}
      {showRemoveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Xóa hiện vật</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chọn hiện vật để xóa:
              </label>
              <select
                multiple
                value={selectedArtifacts}
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions, option => option.value);
                  setSelectedArtifacts(selected);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                size={5}
              >
                {historicalContext.artifacts?.map((artifact) => (
                  <option key={artifact.id} value={artifact.id}>
                    {artifact.name} {artifact.code ? `(${artifact.code})` : ''}
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
                  setSelectedArtifacts([]);
                }}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                disabled={loading}
              >
                Hủy
              </button>
              <button
                onClick={handleRemoveArtifacts}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
                disabled={loading || selectedArtifacts.length === 0}
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

