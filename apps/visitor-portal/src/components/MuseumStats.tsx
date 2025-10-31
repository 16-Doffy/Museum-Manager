import { Card, CardContent } from '@museum-manager/ui-core/client';
import { Users, Calendar, MapPin, Award } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { http } from '@/lib/api/client';
import { areaEndpoints, artifactEndpoints, visitorEndpoints } from '@/lib/api/endpoints';
import { mockAreas, mockArtifacts, mockVisitors } from '@/lib/api/mockData';
import { USE_MOCK_DATA_ONLY } from '@/lib/api/config';

type StatItem = {
  icon: typeof Users;
  value: string;
  label: string;
  description: string;
  color: string;
  bgColor: string;
};

export function MuseumStats() {
  const [counts, setCounts] = useState<{ visitors: number; artifacts: number; areas: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    let interval: NodeJS.Timeout | null = null;
    
    if (USE_MOCK_DATA_ONLY) {
      // Use mock data directly
      setCounts({ 
        visitors: mockVisitors.length, 
        artifacts: mockArtifacts.length, 
        areas: mockAreas.length 
      });
      setError(null);
      return () => { mounted = false; };
    }
    
    const fetchCounts = async () => {
      try {
        const [visitors, artifacts, areas] = await Promise.all([
          http<any>(visitorEndpoints.getAll),
          http<any>(artifactEndpoints.getAll),
          http<any>(areaEndpoints.getAll),
        ]);

        if (!mounted) return;

        const visitorsCount = Array.isArray(visitors?.data) ? visitors.data.length : (Array.isArray(visitors) ? visitors.length : 0);
        const artifactsCount = Array.isArray(artifacts?.data) ? artifacts.data.length : (Array.isArray(artifacts) ? artifacts.length : 0);
        const areasCount = Array.isArray(areas?.data) ? areas.data.length : (Array.isArray(areas) ? areas.length : 0);

        setCounts({ visitors: visitorsCount, artifacts: artifactsCount, areas: areasCount });
        setError(null);
      } catch (e: unknown) {
        // Fallback to mock data counts
        setCounts({ 
          visitors: mockVisitors.length, 
          artifacts: mockArtifacts.length, 
          areas: mockAreas.length 
        });
        setError(null);
      }
    };
    
    // Initial fetch
    fetchCounts();
    
    // Auto-refresh every 10 seconds to sync with museum-portal changes quickly
    interval = setInterval(() => {
      if (!mounted) return;
      fetchCounts();
    }, 10000); // 10 seconds for faster sync
    
    return () => {
      mounted = false;
      if (interval) clearInterval(interval);
    };
  }, []);

  const stats: StatItem[] = useMemo(() => {
    return [
      {
        icon: Users,
        value: counts ? `${counts.visitors}` : '—',
        label: 'Khách Tham Quan',
        description: 'Tổng số lượt khách đã ghi nhận',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
      },
      {
        icon: Calendar,
        value: counts ? `${counts.areas}` : '—',
        label: 'Khu Vực Trưng Bày',
        description: 'Các khu vực trong bảo tàng',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
      },
      {
        icon: MapPin,
        value: counts ? `${counts.artifacts}` : '—',
        label: 'Hiện Vật',
        description: 'Hiện vật và tài liệu lịch sử',
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
      },
      {
        icon: Award,
        value: '25+',
        label: 'Giải Thưởng',
        description: 'Giải thưởng và danh hiệu quốc tế',
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
      },
    ];
  }, [counts]);

  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiPjxyZWN0IHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIvPjxyZWN0IHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCIgeD0iMTUiIHk9IjE1Ii8+PC9nPjwvZz48L3N2Zz4=')]"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-semibold mb-6">
            📊 Thống kê ấn tượng
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
            Bảo Tàng Lịch Sử Việt Nam
          </h2>
          <p className="text-slate-300 max-w-3xl mx-auto text-xl leading-relaxed">
            Một trong những bảo tàng lịch sử hàng đầu Việt Nam với bề dày lịch sử và 
            bộ sưu tập hiện vật phong phú, đa dạng.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="text-center hover:shadow-2xl transition-all duration-500 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 group">
                <CardContent className="p-8">
                  <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl ${stat.bgColor} mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <Icon className={`h-10 w-10 ${stat.color}`} />
                  </div>
                  <div className="text-4xl font-bold text-white mb-3 group-hover:text-yellow-300 transition-colors">
                    {stat.value}
                  </div>
                  <div className="text-xl font-bold text-gray-200 mb-3">
                    {stat.label}
                  </div>
                  <div className="text-sm text-gray-300 leading-relaxed">
                    {stat.description}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-8 bg-white/10 backdrop-blur-md rounded-2xl px-8 py-4 border border-white/20">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-gray-200">Đang mở cửa</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-blue-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-gray-200">Có hướng dẫn viên</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-purple-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-gray-200">Tham quan ảo có sẵn</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

