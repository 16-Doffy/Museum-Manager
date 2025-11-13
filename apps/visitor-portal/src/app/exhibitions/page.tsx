'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@museum-manager/ui-core/card';
import { Button } from '@museum-manager/ui-core/button';
import { Input } from '@museum-manager/ui-core/input';
import { Calendar, MapPin, Clock, ArrowRight } from 'lucide-react';
import { getExhibitions, type ExhibitionSummary, getToken } from '@/lib/api';
import Link from 'next/link';

export default function ExhibitionsPage() {
  const router = useRouter();
  const [exhibitions, setExhibitions] = useState<ExhibitionSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace('/login');
      return;
    }

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const params: any = {
          pageIndex: 1,
          pageSize: 50,
        };
        if (searchTerm) params.name = searchTerm;
        if (statusFilter && statusFilter !== 'all') params.statusFilter = statusFilter;
        
        const list = await getExhibitions(params);
        // Filter out deleted exhibitions
        const activeExhibitions = list.filter((e: ExhibitionSummary) => e.status !== 'Deleted');
        setExhibitions(activeExhibitions);
      } catch (e: any) {
        // Handle permission errors gracefully
        if (e?.message?.includes('403') || e?.message?.includes('Forbidden') || e?.message?.includes('permission')) {
          // Visitor doesn't have permission - show empty state instead of error
          setError(null);
          setExhibitions([]);
        } else {
          setError(e?.message || 'Không tải được danh sách triển lãm');
          setExhibitions([]);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [router, searchTerm, statusFilter]);

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
      });
    } catch {
      return dateString;
    }
  };

  const isUpcoming = (exhibition: ExhibitionSummary) => {
    if (!exhibition.startDate) return false;
    return new Date(exhibition.startDate) > new Date();
  };

  const isActive = (exhibition: ExhibitionSummary) => {
    if (!exhibition.startDate || !exhibition.endDate) return exhibition.status === 'Active';
    const now = new Date();
    const start = new Date(exhibition.startDate);
    const end = new Date(exhibition.endDate);
    return now >= start && now <= end;
  };

  return (
    <div className="w-full min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-neutral-900 via-black to-neutral-800 py-16 px-6 md:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                Triển lãm
              </h1>
              <p className="text-white/70 text-lg">
                Khám phá các triển lãm đặc biệt tại bảo tàng
              </p>
            </div>
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              ← Quay lại
            </Button>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <div className="flex-1">
              <Input
                placeholder="Tìm kiếm triển lãm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-400 focus:border-white h-12"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 bg-neutral-800 border border-neutral-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white/20 h-12"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="Active">Đang diễn ra</option>
              <option value="Upcoming">Sắp diễn ra</option>
              <option value="Expired">Đã kết thúc</option>
              <option value="Daily">Hàng ngày</option>
            </select>
          </div>
        </div>
      </div>

      {/* Exhibitions List */}
      <div className="bg-neutral-900 py-16 px-6 md:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center text-white/60 py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white/30 border-t-white mx-auto mb-4"></div>
              Đang tải danh sách triển lãm...
            </div>
          ) : error ? (
            <div className="text-center text-red-400 py-12">{error}</div>
          ) : exhibitions.length === 0 ? (
            <div className="text-center text-white/60 py-12">
              {searchTerm || statusFilter !== 'all' 
                ? 'Không tìm thấy triển lãm nào phù hợp' 
                : 'Chưa có triển lãm nào'}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {exhibitions.map((exhibition) => (
                <Card
                  key={exhibition.id}
                  className="rounded-2xl border border-neutral-800 bg-neutral-800/50 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 backdrop-blur-sm overflow-hidden group"
                >
                  <CardHeader className="p-6 pb-4">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <CardTitle className="text-xl font-semibold text-white group-hover:text-white/80 transition-colors flex-1">
                        <Link href={`/exhibitions/${exhibition.id}`} className="hover:underline">
                          {exhibition.name}
                        </Link>
                      </CardTitle>
                      {exhibition.status && (
                        <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(exhibition.status)} whitespace-nowrap`}>
                          {getStatusLabel(exhibition.status)}
                        </span>
                      )}
                    </div>
                    {exhibition.description && (
                      <p className="text-sm text-white/70 line-clamp-2 mt-2">
                        {exhibition.description}
                      </p>
                    )}
                  </CardHeader>
                  <CardContent className="p-6 pt-0 space-y-4">
                    {/* Date Information */}
                    {(exhibition.startDate || exhibition.endDate) && (
                      <div className="space-y-2">
                        {exhibition.startDate && (
                          <div className="flex items-center gap-2 text-sm text-white/80">
                            <Calendar className="w-4 h-4 text-white/60" />
                            <span className="font-medium">Bắt đầu:</span>
                            <span>{formatDate(exhibition.startDate)}</span>
                          </div>
                        )}
                        {exhibition.endDate && (
                          <div className="flex items-center gap-2 text-sm text-white/80">
                            <Clock className="w-4 h-4 text-white/60" />
                            <span className="font-medium">Kết thúc:</span>
                            <span>{formatDate(exhibition.endDate)}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Museum */}
                    {exhibition.museum && (
                      <div className="flex items-center gap-2 text-sm text-white/80">
                        <MapPin className="w-4 h-4 text-white/60" />
                        <span>{exhibition.museum.name}</span>
                      </div>
                    )}

                    {/* Historical Contexts */}
                    {exhibition.historicalContexts && exhibition.historicalContexts.length > 0 && (
                      <div className="pt-2 border-t border-neutral-700">
                        <div className="text-xs text-white/60 mb-2">Ngữ cảnh lịch sử:</div>
                        <div className="flex flex-wrap gap-2">
                          {exhibition.historicalContexts.slice(0, 3).map((hc) => (
                            <span
                              key={hc.id}
                              className="px-2 py-1 text-xs bg-neutral-700/50 text-white/80 rounded"
                            >
                              {hc.title}
                            </span>
                          ))}
                          {exhibition.historicalContexts.length > 3 && (
                            <span className="px-2 py-1 text-xs text-white/60">
                              +{exhibition.historicalContexts.length - 3} khác
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* View Button */}
                    <Link href={`/exhibitions/${exhibition.id}`}>
                      <Button
                        variant="outline"
                        className="w-full mt-4 border-white/20 text-white hover:bg-white/10 group/btn"
                      >
                        Xem chi tiết
                        <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
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

