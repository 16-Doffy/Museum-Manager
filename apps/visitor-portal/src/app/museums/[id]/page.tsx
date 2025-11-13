'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@museum-manager/ui-core/card';
import { Button } from '@museum-manager/ui-core/button';
import { Badge } from '@museum-manager/ui-core/badge';
import { Input } from '@museum-manager/ui-core/input';
import { getMuseumDetail, getArtifactsByMuseum, getExhibitionsByMuseum } from '@/lib/api';
import Link from 'next/link';

export default function MuseumDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [artifacts, setArtifacts] = useState<any[]>([]);
  const [exhibitions, setExhibitions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        setLoading(true);
        const res = await getMuseumDetail(id);
        setData((res as any).data || res);
        
        // Load artifacts with error handling
        try {
          const arts = await getArtifactsByMuseum(String(id), { pageIndex: 1, pageSize: 100 });
          setArtifacts(arts || []);
        } catch (e: any) {
          // If 403 or permission error, show empty list
          if (e?.message?.includes('403') || e?.message?.includes('Forbidden') || e?.message?.includes('permission')) {
            setArtifacts([]);
          } else {
            // Other errors - still show empty list
            setError(e?.message || 'Không tải được danh sách hiện vật');
            setArtifacts([]);
          }
        }
        // Load exhibitions for this museum (silently fail if no permission)
        try {
          const exhs = await getExhibitionsByMuseum(String(id), { 
            pageIndex: 1, 
            pageSize: 10,
            statusFilter: 'Active' // Only show active exhibitions
          });
          // Filter out deleted exhibitions
          setExhibitions(exhs.filter((e: any) => e.status !== 'Deleted') || []);
        } catch (e: any) {
          // Silently handle permission errors (403) - visitor may not have access to exhibitions
          if (e?.message?.includes('403') || e?.message?.includes('Forbidden') || e?.message?.includes('permission')) {
            // Visitor doesn't have permission - just don't show exhibitions section
            setExhibitions([]);
          } else {
            // Other errors - silently fail
            setExhibitions([]);
          }
        }
      } catch (e: any) {
        setError(e?.message || 'Không tải được thông tin bảo tàng');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  return (
    <div className="w-full min-h-screen bg-black text-white">
      {/* Hero Section - British Museum Style */}
      <div className="relative w-full min-h-[90vh] flex flex-col">
        {/* Background Image */}
        {data?.thumbnailUrl ? (
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${data.thumbnailUrl})`,
            }}
          >
            <div className="absolute inset-0 bg-black/60" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-black to-neutral-800" />
        )}

        {/* Content */}
        <div className="relative z-10 flex-1 flex flex-col">
          {/* Header with back button */}
          <div className="flex items-center justify-between p-6 md:p-8">
            <button
              onClick={() => router.back()}
              className="text-white/80 hover:text-white transition-colors"
            >
              ← Quay lại
            </button>
          </div>

          {/* Main Hero Content */}
          <div className="flex-1 flex flex-col justify-center px-6 md:px-12 lg:px-16 pb-16">
            <div className="max-w-6xl w-full">
              {/* Welcome Text */}
              <div className="text-white/90 italic text-xl md:text-2xl lg:text-3xl font-sans mb-4 text-center font-light tracking-wide">
                Chào mừng đến với
              </div>

              {/* Museum Name - Large Typography */}
              <div className="mb-8 md:mb-12">
                <h1 className="text-6xl md:text-8xl lg:text-9xl font-sans font-extrabold text-white leading-none tracking-tight">
                  <span className="block text-left">{data?.name?.split(' ').slice(0, Math.ceil((data?.name?.split(' ').length || 1) / 2)).join(' ') || 'BẢO TÀNG'}</span>
                  <span className="block text-right mt-2">
                    {data?.name?.split(' ').slice(Math.ceil((data?.name?.split(' ').length || 1) / 2)).join(' ') || 'VIỆT NAM'}
                  </span>
                </h1>
              </div>

              {/* Center Image Section */}
              {data?.thumbnailUrl && (
                <div className="my-8 md:my-12">
                  <img
                    src={data.thumbnailUrl}
                    alt={data?.name || 'Bảo tàng'}
                    className="w-full h-[400px] md:h-[500px] lg:h-[600px] object-cover rounded-lg shadow-2xl"
                  />
                </div>
              )}

              {/* Call to Action Button */}
              <div className="flex justify-end mt-8 md:mt-12">
                <button
                  onClick={() => {
                    const artifactsSection = document.getElementById('artifacts-section');
                    artifactsSection?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full border-2 border-white/80 hover:border-white transition-all flex items-center justify-center group"
                >
                  <span className="text-white text-sm md:text-base font-medium text-center px-4 group-hover:scale-105 transition-transform">
                    KHÁM PHÁ<br />HIỆN VẬT
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Description at bottom left */}
          {data?.description && (
            <div className="absolute bottom-8 left-6 md:left-12 lg:left-16 max-w-md">
              <p className="text-white/80 text-sm md:text-base leading-relaxed">
                {data.description}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Exhibitions Section */}
      {exhibitions.length > 0 && (
        <div className="bg-neutral-900 py-16 px-6 md:px-12 lg:px-16">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-sans font-bold text-white mb-2">Triển lãm</h2>
              <p className="text-white/60">Các triển lãm đang diễn ra tại bảo tàng này</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {exhibitions.map((exhibition) => (
                <Link key={exhibition.id} href={`/exhibitions/${exhibition.id}`}>
                  <Card className="rounded-2xl border border-neutral-800 bg-neutral-800/50 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 backdrop-blur-sm cursor-pointer">
                    <CardHeader className="p-6">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <CardTitle className="text-lg font-semibold text-white line-clamp-2">
                          {exhibition.name}
                        </CardTitle>
                        {exhibition.status && (
                          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${
                            exhibition.status === 'Active' 
                              ? 'bg-green-600/20 text-green-400 border-green-600/50'
                              : exhibition.status === 'Upcoming'
                              ? 'bg-blue-600/20 text-blue-400 border-blue-600/50'
                              : 'bg-neutral-700/50 text-neutral-300 border-neutral-600/50'
                          }`}>
                            {exhibition.status === 'Active' ? 'Đang diễn ra' : 
                             exhibition.status === 'Upcoming' ? 'Sắp diễn ra' : 
                             exhibition.status}
                          </span>
                        )}
                      </div>
                      {exhibition.description && (
                        <p className="text-sm text-white/70 line-clamp-2 mt-2">
                          {exhibition.description}
                        </p>
                      )}
                    </CardHeader>
                    <CardContent className="p-6 pt-0">
                      {(exhibition.startDate || exhibition.endDate) && (
                        <div className="text-xs text-white/60 space-y-1">
                          {exhibition.startDate && (
                            <div>
                              Bắt đầu: {new Date(exhibition.startDate).toLocaleDateString('vi-VN')}
                            </div>
                          )}
                          {exhibition.endDate && (
                            <div>
                              Kết thúc: {new Date(exhibition.endDate).toLocaleDateString('vi-VN')}
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Artifacts Section */}
      <div id="artifacts-section" className="bg-neutral-900 py-16 px-6 md:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto">

          {/* Toolbar */}
          <div className="mb-8 flex items-center justify-between gap-3">
            <h2 className="text-3xl md:text-4xl font-sans font-bold text-white">Hiện vật</h2>
            <div className="w-72">
              <Input 
                className="h-12 text-base bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-400 focus:border-white" 
                placeholder="Tìm hiện vật..." 
                value={query} 
                onChange={(e) => setQuery(e.target.value)} 
              />
            </div>
          </div>

          {/* Artifacts */}
          {loading ? (
            <div className="text-white/60 text-center py-12">Đang tải hiện vật...</div>
          ) : null}
          {!loading && artifacts.length === 0 ? (
            <div className="text-white/60 text-center py-12">
              <div>Chưa có hiện vật nào.</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-8">
              {artifacts
                .filter((a) => (query ? String(a.name || '').toLowerCase().includes(query.toLowerCase()) : true))
                .map((a) => (
                  <Card key={a.id} className="rounded-2xl border border-neutral-800 bg-neutral-800/50 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 backdrop-blur-sm">
                    <CardHeader className="p-6">
                      <CardTitle className="text-xl font-semibold text-white">
                        <Link href={`/artifacts/${a.id}`} className="hover:text-white/80 transition-colors">
                          {a.name}
                        </Link>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 pt-0">
                      <div className="text-base text-white/80 space-y-3">
                        {a.periodTime ? (
                          <div className="flex items-center gap-3">
                            <span className="font-medium text-base text-white/90">Niên đại:</span>
                            <span className="inline-flex rounded-full px-3 py-1.5 text-sm bg-neutral-700 text-white">{a.periodTime}</span>
                          </div>
                        ) : null}
                        {a.areaName ? (
                          <div className="flex items-center gap-3">
                            <span className="font-medium text-base text-white/90">Khu vực:</span>
                            <span className="inline-flex rounded-full px-3 py-1.5 text-sm bg-neutral-700 text-white">{a.areaName}</span>
                          </div>
                        ) : null}
                        {a.displayPositionName ? (
                          <div className="flex items-center gap-3">
                            <span className="font-medium text-base text-white/90">Vị trí trưng bày:</span>
                            <span className="inline-flex rounded-full px-3 py-1.5 text-sm bg-neutral-700 text-white">{a.displayPositionName}</span>
                          </div>
                        ) : null}
                        {/* Ẩn trạng thái hiện vật theo yêu cầu */}
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


