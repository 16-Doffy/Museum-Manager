import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiClient } from '@/lib/api/client';
import { visitorPublicEndpoints } from '@/lib/api/endpoints';
import { Artifact } from '@/lib/api/types';
import { FiPrinter, FiDownload, FiArrowLeft } from 'react-icons/fi';

// Helper: Auto-register anonymous visitor and get token (1 time, reuse stored token)
async function getVisitorToken(): Promise<string | null> {
  const STORAGE_KEY = 'visitor_anonymous_token';
  // 1) Prefer public token from env if provided (simple, works for everyone scanning QR)
  const envToken = import.meta.env.VITE_PUBLIC_VISITOR_TOKEN as string | undefined;
  if (envToken && envToken.trim().length > 10) {
    // Strip "Bearer " prefix if present, we'll add it back when sending
    const cleanToken = envToken.trim().startsWith('Bearer ') 
      ? envToken.trim().substring(7).trim()
      : envToken.trim();
    console.log('Using public visitor token from env');
    return cleanToken;
  }
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    console.log('Using stored visitor token');
    return stored;
  }

  try {
    // Auto-register anonymous visitor (generate random email)
    const randomEmail = `visitor_${Date.now()}_${Math.random().toString(36).substring(7)}@anonymous.local`;
    const registerResponse = await apiClient.post<{ token?: string; data?: { token?: string } }>(
      visitorPublicEndpoints.register,
      {
        email: randomEmail,
        password: 'anonymous123',
        name: 'Anonymous Visitor',
      }
    );
    
    // Extract token from response (could be in token or data.token)
    const token = registerResponse?.data?.token || (registerResponse?.data as any)?.data?.token || null;
    if (token) {
      localStorage.setItem(STORAGE_KEY, token);
      return token;
    }
  } catch (err) {
    console.error('Auto-register visitor failed:', err);
  }
  
  return null;
}

export default function PublicArtifactDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [artifact, setArtifact] = useState<Artifact | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError('Không tìm thấy ID hiện vật');
      setLoading(false);
      return;
    }

    const fetchArtifact = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Auto-get visitor token (register if needed, reuse stored token)
        const visitorToken = await getVisitorToken();
        if (!visitorToken) {
          setError('Không thể khởi tạo phiên truy cập');
          setLoading(false);
          return;
        }

        // Temporarily set visitor token for this request
        const originalToken = localStorage.getItem('auth_token');
        localStorage.setItem('auth_token', visitorToken);
        
        try {
          const response = await apiClient.get<Artifact>(visitorPublicEndpoints.getArtifactById(id));
          if (response?.data) {
            setArtifact(response.data);
          } else {
            setError('Không tìm thấy hiện vật');
          }
        } finally {
          // Restore original token (if was admin/staff token)
          if (originalToken) {
            localStorage.setItem('auth_token', originalToken);
          } else {
            localStorage.removeItem('auth_token');
          }
        }
      } catch (err: any) {
        console.error('Failed to fetch artifact:', err);
        setError(err?.message || 'Không thể tải thông tin hiện vật');
      } finally {
        setLoading(false);
      }
    };

    fetchArtifact();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (!artifact) return;
    const content = `
BẢO TÀNG LỊCH SỬ VIỆT NAM
========================

CHI TIẾT HIỆN VẬT
================

Mã hiện vật: ${artifact.code}
Tên hiện vật: ${artifact.name}
Mô tả: ${artifact.description || '-'}
Năm: ${artifact.year || '-'}
Thời kỳ: ${artifact.periodTime || '-'}
Trọng lượng: ${artifact.weight || '-'} kg
Kích thước: ${(artifact as any).width || '-'} × ${(artifact as any).height || '-'} × ${(artifact as any).length || '-'} cm
Bản gốc: ${artifact.isOriginal ? 'Có' : 'Không'}
Khu vực: ${(artifact as any).area?.name || (artifact as any).areaName || 'Chưa xác định'}

Ngày tạo: ${new Date(artifact.createdAt).toLocaleDateString('vi-VN')}
Cập nhật lần cuối: ${new Date(artifact.updatedAt).toLocaleDateString('vi-VN')}
    `;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `artifact-${artifact.code || id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Extract media from artifact (support multiple API shapes)
  function extractMedia(obj: any): any[] {
    if (!obj || typeof obj !== 'object') return [];
    const direct = obj.media || obj.medias || obj.artifactMedias || obj.mediantens || obj.mediaItems || obj.mediaList;
    if (Array.isArray(direct) && direct.length > 0) {
      return direct.filter((m: any) => m && m.isDeleted !== true && m.isActive !== false);
    }
    // Fallback: search any array field that looks like media
    for (const key of Object.keys(obj)) {
      const val = (obj as any)[key];
      if (Array.isArray(val) && val.length > 0 && typeof val[0] === 'object') {
        const first = val[0] as any;
        if ('filePath' in first || 'url' in first || 'mediaType' in first || 'type' in first) {
          return (val as any[]).filter((m: any) => m && m.isDeleted !== true && m.isActive !== false);
        }
      }
    }
    return [];
  }

  const mediaList = artifact ? extractMedia(artifact as any) : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải thông tin hiện vật...</p>
        </div>
      </div>
    );
  }

  if (error || !artifact) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy hiện vật</h2>
          <p className="text-gray-600 mb-4">{error || 'Hiện vật không tồn tại hoặc đã bị xóa'}</p>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  const resolvedAreaName = (artifact as any).area?.name || (artifact as any).areaName || (artifact as any).displayPosition?.area?.name;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <FiArrowLeft className="w-5 h-5" />
              <span>Quay lại</span>
            </button>
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
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6">
            {/* Title + primary stats */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {artifact.name}{artifact.year ? ` - ${artifact.year}` : ''}
              </h1>
              <div className="text-lg text-gray-700">
                Trọng lượng: <span className="font-semibold">{artifact.weight ?? '-'} kg</span>
              </div>
            </div>

            {/* Media Gallery */}
            {Array.isArray(mediaList) && mediaList.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Hình ảnh/Media</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {mediaList.map((m: any, idx: number) => {
                    const src = m.url || m.filePath;
                    const type = m.type || m.mediaType;
                    const isImage = type === 'Image' || /\.(png|jpg|jpeg|gif|webp)$/i.test(String(src || ''));
                    return (
                      <div key={idx} className="relative border rounded-lg overflow-hidden bg-gray-50">
                        {isImage ? (
                          <img src={src} alt={m.caption || `Media ${idx + 1}`} className="w-full h-48 object-cover" />
                        ) : (
                          <div className="h-48 flex items-center justify-center text-sm text-gray-600">
                            {type || 'Media'}
                          </div>
                        )}
                        {m.caption && (
                          <div className="p-2 text-xs text-gray-700 bg-white">{m.caption}</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                <p className="text-gray-900 whitespace-pre-wrap">{artifact.description || '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Thời kỳ</label>
                <p className="text-gray-900">{artifact.periodTime || '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kích thước (cm)</label>
                <p className="text-gray-900">
                  {(artifact as any).width ?? '-'} × {(artifact as any).height ?? '-'} × {(artifact as any).length ?? '-'}
                </p>
              </div>
              {resolvedAreaName && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Khu vực</label>
                  <p className="text-gray-900">{resolvedAreaName}</p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bản gốc</label>
                <p className="text-gray-900">{artifact.isOriginal ? 'Có' : 'Không'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mã hiện vật</label>
                <p className="text-gray-900 font-mono">{artifact.code || '-'}</p>
              </div>
            </div>

            {/* QR Code Section */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">QR Code</h3>
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center">
                  <img
                    alt="QR Code"
                    width={84}
                    height={84}
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(`${window.location.origin}/visitor/artifacts/${artifact.id}`)}`}
                  />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Mã QR: <span className="font-mono font-semibold">{artifact.code || artifact.id}</span></p>
                  <p className="text-xs text-gray-500">Quét để xem thông tin chi tiết</p>
                </div>
              </div>
            </div>

            {/* Timestamps */}
            <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-gray-500 pt-6 border-t border-gray-200">
              <div>
                <span className="font-medium">Ngày tạo:</span> {new Date(artifact.createdAt).toLocaleDateString('vi-VN')}
              </div>
              <div>
                <span className="font-medium">Cập nhật lần cuối:</span> {new Date(artifact.updatedAt).toLocaleDateString('vi-VN')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

