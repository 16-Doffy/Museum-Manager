import { Artifact } from '@/lib/api/types';
import { useAreas } from '@/lib/api/hooks';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api/client';
import { artifactEndpoints } from '@/lib/api/endpoints';
import { FiX, FiPrinter, FiDownload } from 'react-icons/fi';

interface ArtifactDetailProps {
  artifact: Artifact;
  onClose: () => void;
}

export default function ArtifactDetail({ artifact, onClose }: ArtifactDetailProps) {
  const [current, setCurrent] = useState<Artifact>(artifact);
  const [coverId, setCoverId] = useState<string | null>(null);
  const [removedMediaIds, setRemovedMediaIds] = useState<Set<string>>(new Set());

  // Load removed media ids from localStorage (persist across reopen)
  useEffect(() => {
    if (!artifact?.id) return;
    try {
      const raw = localStorage.getItem(`artifact_removed_media:${artifact.id}`);
      if (raw) setRemovedMediaIds(new Set(JSON.parse(raw)));
    } catch {}
  }, [artifact?.id]);

  const persistRemovedIds = (ids: Set<string>) => {
    try {
      localStorage.setItem(`artifact_removed_media:${current.id}`, JSON.stringify(Array.from(ids)));
    } catch {}
  };
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

  // Support multiple API shapes for media list
  function extractMedia(obj: any): any[] {
    if (!obj || typeof obj !== 'object') return [];
    const direct = obj.media || obj.medias || obj.artifactMedias || obj.mediantens || obj.mediaItems || obj.mediaList;
    const baseFilter = (m: any) => {
      const mid = (m?.id ?? m?.mediaId ?? m?._id) as string;
      return m && m.isDeleted !== true && m.isActive !== false && !removedMediaIds.has(mid);
    };
    if (Array.isArray(direct) && direct.length > 0) return direct.filter(baseFilter);
    // Fallback: search any array field that looks like media (has url/filePath)
    for (const key of Object.keys(obj)) {
      const val = (obj as any)[key];
      if (Array.isArray(val) && val.length > 0 && typeof val[0] === 'object') {
        const first = val[0] as any;
        if ('filePath' in first || 'url' in first || 'mediaType' in first || 'type' in first) {
          return (val as any[]).filter(baseFilter);
        }
      }
    }
    return [];
  }

  const mediaList = extractMedia(current as any);
  const getMediaId = (m: any) => m?.id ?? m?.mediaId ?? m?._id;
  const sortedMedia = Array.isArray(mediaList)
    ? [...mediaList].sort((a: any, b: any) => (getMediaId(a) === coverId ? -1 : getMediaId(b) === coverId ? 1 : 0))
    : [];

  const handleSetCover = (id: string) => {
    setCoverId(id);
  };

  const handleDeleteMedia = async (id: string) => {
    try {
      if (!current?.id) return;
      const resp = await apiClient.delete<any>(artifactEndpoints.deleteMedia(current.id, id));
      // Some APIs return { code, message, data: true/void }
      if (resp) {
        // Optimistic local removal
        setRemovedMediaIds(prev => {
          const next = new Set(prev).add(id);
          persistRemovedIds(next);
          return next;
        });
        setCurrent(prev => {
          if (!prev) return prev as any;
          const copy: any = { ...prev };
          const keys = ['media', 'medias', 'artifactMedias', 'mediantens', 'mediaItems', 'mediaList'];
          for (const k of keys) {
            if (Array.isArray(copy[k])) copy[k] = copy[k].filter((m: any) => (m?.id ?? m?.mediaId ?? m?._id) !== id);
          }
          return copy;
        });
        // Then refetch to ensure consistency
        const fresh = await apiClient.get<Artifact>(artifactEndpoints.getById(current.id), {
          includeDeleted: false,
          _t: Date.now(),
        });
        if (fresh?.data) setCurrent(fresh.data);
      }
      alert('Đã xóa media');
    } catch (err) {
      console.error('Delete media failed', err);
      alert('Xóa media thất bại');
    }
  };

  // Resolve area name from multiple sources (area.name, areaName, displayPosition.area, areas list)
  const { areas } = useAreas({ pageIndex: 1, pageSize: 100 });
  const resolvedAreaName =
    (current as any).area?.name
    || (current as any).areaName
    || (current as any).displayPosition?.area?.name
    || (areas.find(a => a.id === (current as any).areaId)?.name);

  // Ensure we refresh once after open to include latest media
  useEffect(() => {
    const hasMedia = Array.isArray(mediaList) && mediaList.length > 0;
    if (!hasMedia && current?.id) {
      apiClient
        .get<Artifact>(artifactEndpoints.getById(current.id), { includeDeleted: false, _t: Date.now() })
        .then(r => {
          if (r?.data) setCurrent(r.data);
        })
        .catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current?.id]);

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
          {/* Title + primary stats */}
          <div className="mb-4">
            <div className="text-2xl font-bold text-gray-900">
              {current.name}{current.year ? ` - ${current.year}` : ''}
            </div>
            <div className="mt-1 text-gray-700">
              Trọng lượng: <span className="font-semibold">{current.weight ?? '-'} kg</span>
            </div>
          </div>

          {/* Media Gallery */}
          {Array.isArray(sortedMedia) && sortedMedia.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Hình ảnh/Media</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {sortedMedia.map((m: any) => {
                  const mid = getMediaId(m);
                  const src = m.url || m.filePath;
                  const type = m.type || m.mediaType;
                  const isImage = type === 'Image' || /\.(png|jpg|jpeg|gif|webp)$/i.test(String(src || ''));
                  return (
                  <div key={mid} className="relative border rounded-lg overflow-hidden bg-gray-50">
                    {isImage ? (
                      <img src={src} alt={m.caption || 'media'} className="w-full h-48 object-cover" />
                    ) : (
                      <div className="h-48 flex items-center justify-center text-sm text-gray-600">
                        {type || 'Media'}
                      </div>
                    )}
                    {m.caption && (
                      <div className="p-2 text-xs text-gray-700">{m.caption}</div>
                    )}
                    <div className="absolute top-2 right-2 flex gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleSetCover(mid); }}
                        className="px-2 py-1 text-xs bg-white/80 hover:bg-white rounded border border-gray-300"
                        title="Đặt làm ảnh chính"
                      >
                        {coverId === mid ? 'Ảnh chính' : 'Đặt chính'}
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteMedia(mid); }}
                        className="px-2 py-1 text-xs bg-red-50 hover:bg-red-100 text-red-700 rounded border border-red-200"
                        title="Xóa ảnh"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Minimal secondary info (optional) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Kích thước (cm)</label>
              <p className="text-gray-900">{(current as any).width ?? '-'} × {(current as any).height ?? '-'} × {(current as any).length ?? '-'}</p>
            </div>
            {resolvedAreaName && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Khu vực</label>
                <p className="text-gray-900">{resolvedAreaName}</p>
              </div>
            )}
          </div>

          {/* QR Code Section */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">QR Code</h3>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center">
                <span className="text-xs text-gray-500">QR Code</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Mã QR: <span className="font-mono font-semibold">{current.code}</span></p>
                <p className="text-xs text-gray-500">Quét để xem thông tin chi tiết</p>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-gray-500">
            <div>
              <span className="font-medium">Ngày tạo:</span> {new Date(current.createdAt).toLocaleDateString('vi-VN')}
            </div>
            <div>
              <span className="font-medium">Cập nhật lần cuối:</span> {new Date(current.updatedAt).toLocaleDateString('vi-VN')}
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
