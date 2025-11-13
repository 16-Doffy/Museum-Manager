'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@museum-manager/ui-core/card';
import { Button } from '@museum-manager/ui-core/button';
import { Badge } from '@museum-manager/ui-core/badge';
import { Calendar, MapPin, Clock, ArrowLeft, BookOpen } from 'lucide-react';
import { getExhibitionDetail, getToken } from '@/lib/api';
import Link from 'next/link';

export default function ExhibitionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace('/login');
      return;
    }

    if (!id) {
      setError('ID triển lãm không hợp lệ');
      setLoading(false);
      return;
    }

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getExhibitionDetail(String(id));
        setData((res as any).data || res);
      } catch (e: any) {
        setError(e?.message || 'Không tải được thông tin triển lãm');
      } finally {
        setLoading(false);
      }
    })();
  }, [id, router]);

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-600/20 text-green-400 border-green-600/50';
      case 'Upcoming':
        return 'bg-blue-600/20 text-blue-400 border-blue-600/50';
      case 'Expired':
        return 'bg-gray-600/20 text-gray-400 border-gray-600/50';
      case 'Daily':
        return 'bg-purple-600/20 text-purple-400 border-purple-600/50';
      default:
        return 'bg-neutral-700/50 text-neutral-300 border-neutral-600/50';
    }
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case 'Active':
        return 'Đang diễn ra';
      case 'Upcoming':
        return 'Sắp diễn ra';
      case 'Expired':
        return 'Đã kết thúc';
      case 'Daily':
        return 'Hàng ngày';
      default:
        return status || 'Không xác định';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white/30 border-t-white mx-auto mb-4"></div>
          <p className="text-white/60">Đang tải thông tin triển lãm...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="w-full min-h-screen bg-black text-white flex items-center justify-center p-6">
        <Card className="border border-neutral-800 bg-neutral-800/50 shadow-xl backdrop-blur-sm max-w-md w-full">
          <CardHeader className="p-6">
            <CardTitle className="text-2xl font-bold text-white">Lỗi</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="space-y-4">
              <div className="text-red-400 font-medium">{error || 'Không tìm thấy triển lãm'}</div>
              <div className="flex gap-3">
                <Button
                  onClick={() => router.back()}
                  className="flex-1 bg-neutral-700 hover:bg-neutral-600 text-white"
                >
                  Quay lại
                </Button>
                <Button
                  onClick={() => router.push('/select-museum')}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  Trang chủ
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative w-full min-h-[60vh] flex flex-col">
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-black to-neutral-800" />

        {/* Content */}
        <div className="relative z-10 flex-1 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 md:p-8">
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </Button>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col justify-center px-6 md:px-12 lg:px-16 pb-16">
            <div className="max-w-6xl w-full">
              {/* Status Badge */}
              {data.status && (
                <div className="mb-6">
                  <span className={`px-4 py-2 text-sm font-medium rounded-full border ${getStatusColor(data.status)}`}>
                    {getStatusLabel(data.status)}
                  </span>
                </div>
              )}

              {/* Title */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-sans font-extrabold text-white leading-none tracking-tight mb-8">
                {data.name || 'Triển lãm'}
              </h1>

              {/* Description */}
              {data.description && (
                <p className="text-white/80 text-lg md:text-xl leading-relaxed max-w-3xl mb-8">
                  {data.description}
                </p>
              )}

              {/* Date and Museum Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {data.startDate && (
                  <div className="flex items-center gap-3 text-white/80">
                    <Calendar className="w-5 h-5 text-white/60" />
                    <div>
                      <div className="text-sm text-white/60 mb-1">Ngày bắt đầu</div>
                      <div className="font-medium">{formatDate(data.startDate)}</div>
                    </div>
                  </div>
                )}
                {data.endDate && (
                  <div className="flex items-center gap-3 text-white/80">
                    <Clock className="w-5 h-5 text-white/60" />
                    <div>
                      <div className="text-sm text-white/60 mb-1">Ngày kết thúc</div>
                      <div className="font-medium">{formatDate(data.endDate)}</div>
                    </div>
                  </div>
                )}
                {data.museum && (
                  <div className="flex items-center gap-3 text-white/80">
                    <MapPin className="w-5 h-5 text-white/60" />
                    <div>
                      <div className="text-sm text-white/60 mb-1">Bảo tàng</div>
                      <div className="font-medium">{data.museum.name}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="bg-neutral-900 py-16 px-6 md:px-12 lg:px-16">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Historical Contexts */}
          {data.historicalContexts && Array.isArray(data.historicalContexts) && data.historicalContexts.length > 0 && (
            <Card className="border border-neutral-800 bg-neutral-800/50 shadow-xl backdrop-blur-sm">
              <CardHeader className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <BookOpen className="w-6 h-6 text-white/80" />
                  <CardTitle className="text-2xl md:text-3xl font-bold text-white">
                    Ngữ cảnh Lịch sử
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.historicalContexts.map((hc: any) => (
                    <div
                      key={hc.id}
                      className="p-4 bg-neutral-700/30 rounded-lg border border-neutral-700 hover:border-neutral-600 transition-colors"
                    >
                      <h3 className="text-lg font-semibold text-white mb-2">{hc.title}</h3>
                      {hc.period && (
                        <div className="text-sm text-white/60 mb-2">
                          <span className="font-medium">Thời kỳ:</span> {hc.period}
                        </div>
                      )}
                      {hc.description && (
                        <p className="text-sm text-white/80 line-clamp-3">{hc.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Additional Information */}
          <Card className="border border-neutral-800 bg-neutral-800/50 shadow-xl backdrop-blur-sm">
            <CardHeader className="p-6">
              <CardTitle className="text-2xl md:text-3xl font-bold text-white">
                Thông tin bổ sung
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-base">
                {data.museum && (
                  <div>
                    <div className="font-medium text-white/90 mb-2">Bảo tàng</div>
                    <div className="text-white/80">{data.museum.name}</div>
                  </div>
                )}
                {data.status && (
                  <div>
                    <div className="font-medium text-white/90 mb-2">Trạng thái</div>
                    <span className={`inline-flex px-3 py-1.5 text-sm font-medium rounded-full border ${getStatusColor(data.status)}`}>
                      {getStatusLabel(data.status)}
                    </span>
                  </div>
                )}
                {data.startDate && (
                  <div>
                    <div className="font-medium text-white/90 mb-2">Ngày bắt đầu</div>
                    <div className="text-white/80">{formatDate(data.startDate)}</div>
                  </div>
                )}
                {data.endDate && (
                  <div>
                    <div className="font-medium text-white/90 mb-2">Ngày kết thúc</div>
                    <div className="text-white/80">{formatDate(data.endDate)}</div>
                  </div>
                )}
                {data.createdAt && (
                  <div>
                    <div className="font-medium text-white/90 mb-2">Ngày tạo</div>
                    <div className="text-white/80">
                      {new Date(data.createdAt).toLocaleDateString('vi-VN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                  </div>
                )}
                {data.updatedAt && (
                  <div>
                    <div className="font-medium text-white/90 mb-2">Cập nhật lần cuối</div>
                    <div className="text-white/80">
                      {new Date(data.updatedAt).toLocaleDateString('vi-VN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

