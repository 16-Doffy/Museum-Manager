import { Artifact } from '@/lib/api/types';
import { FiX, FiPrinter, FiDownload } from 'react-icons/fi';

interface ArtifactDetailProps {
  artifact: Artifact;
  onClose: () => void;
}

export default function ArtifactDetail({ artifact, onClose }: ArtifactDetailProps) {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Create a downloadable version of the artifact details
    const content = `
BẢO TÀNG LỊCH SỬ VIỆT NAM
========================

CHI TIẾT HIỆN VẬT
================

Mã hiện vật: ${artifact.code}
Tên hiện vật: ${artifact.name}
Mô tả: ${artifact.description}
Năm: ${artifact.year}
Thời kỳ: ${artifact.periodTime}
Trọng lượng: ${artifact.weight} kg
Kích thước: ${artifact.width}×${artifact.height}×${artifact.length} cm
Bản gốc: ${artifact.isOriginal ? 'Có' : 'Không'}
Khu vực: ${artifact.area?.name || 'Chưa xác định'}
Trạng thái: ${artifact.isActive ? 'Hoạt động' : 'Không hoạt động'}

Ngày tạo: ${new Date(artifact.createdAt).toLocaleDateString('vi-VN')}
Cập nhật lần cuối: ${new Date(artifact.updatedAt).toLocaleDateString('vi-VN')}

---
QR Code: ${artifact.code}
    `;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `artifact-${artifact.code}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-emerald-600">Chi tiết hiện vật</h2>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiPrinter className="w-4 h-4" />
              In
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <FiDownload className="w-4 h-4" />
              Tải xuống
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Thông tin cơ bản
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Mã hiện vật</label>
                  <p className="text-lg font-semibold text-emerald-600">{artifact.code}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Năm</label>
                  <p className="text-lg">{artifact.year}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Tên hiện vật</label>
                <p className="text-lg font-semibold text-gray-900">{artifact.name}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Mô tả</label>
                <p className="text-gray-900">{artifact.description}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Thời kỳ</label>
                <p className="text-gray-900">{artifact.periodTime}</p>
              </div>
            </div>

            {/* Physical Properties */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Đặc tính vật lý
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Trọng lượng (kg)</label>
                  <p className="text-lg">{artifact.weight}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Bản gốc</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    artifact.isOriginal ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {artifact.isOriginal ? 'Có' : 'Không'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Kích thước (cm)</label>
                <p className="text-gray-900">
                  {artifact.width} × {artifact.height} × {artifact.length}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Khu vực</label>
                <p className="text-gray-900">{artifact.area?.name || 'Chưa xác định'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  artifact.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {artifact.isActive ? 'Hoạt động' : 'Không hoạt động'}
                </span>
              </div>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">QR Code</h3>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center">
                <span className="text-xs text-gray-500">QR Code</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Mã QR: <span className="font-mono font-semibold">{artifact.code}</span></p>
                <p className="text-xs text-gray-500">Quét để xem thông tin chi tiết</p>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-gray-500">
            <div>
              <span className="font-medium">Ngày tạo:</span> {new Date(artifact.createdAt).toLocaleDateString('vi-VN')}
            </div>
            <div>
              <span className="font-medium">Cập nhật lần cuối:</span> {new Date(artifact.updatedAt).toLocaleDateString('vi-VN')}
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
