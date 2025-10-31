'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { http } from '@/lib/api/client';
import { areaEndpoints } from '@/lib/api/endpoints';
import { mockAreas } from '@/lib/api/mockData';
import { USE_MOCK_DATA_ONLY } from '@/lib/api/config';
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from '@museum-manager/ui-core/client';
import { RefreshCw } from 'lucide-react';

import type { Area, PaginatedResponse, ApiResponse } from '@/lib/api/types';

export default function AreasPage() {
  const [areas, setAreas] = useState<Area[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [usingMockData, setUsingMockData] = useState<boolean>(false);

  const fetchAreas = async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true);
    
    if (USE_MOCK_DATA_ONLY) {
      // Use mock data directly
      setAreas(mockAreas);
      setError(null);
      setUsingMockData(true);
      setLoading(false);
      setRefreshing(false);
      return;
    }

    // Try API first, fallback to mock
    try {
      const res = await http<ApiResponse<Area[]> | PaginatedResponse<Area> | Area[]>(areaEndpoints.getAll);
      
      // Handle different response formats from museum-portal API
      let list: Area[] = [];
      if (Array.isArray(res)) {
        list = res;
      } else if ('data' in res && Array.isArray(res.data)) {
        list = res.data;
      } else if ('data' in res && 'success' in res && Array.isArray((res as ApiResponse<Area[]>).data)) {
        list = (res as ApiResponse<Area[]>).data;
      }
      
      // Filter: Only show active areas that are not deleted (sync with museum-portal logic)
      const activeAreas = list.filter(area => area.isActive && !area.isDeleted);
      
      setAreas(activeAreas);
      setError(null);
      setUsingMockData(false);
    } catch (e: unknown) {
      const err = e as Error;
      
      // Fallback to mock data for any error (filter active only)
      console.warn('[AreasPage] API error - using mock data');
      const activeMockAreas = mockAreas.filter(area => area.isActive && !area.isDeleted);
      setAreas(activeMockAreas);
      setError(null);
      setUsingMockData(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    let interval: NodeJS.Timeout | null = null;
    
    // Initial fetch
    fetchAreas();
    
    if (!USE_MOCK_DATA_ONLY) {
      // Auto-refresh every 10 seconds to sync with museum-portal changes quickly
      interval = setInterval(() => {
        if (!mounted) return;
        fetchAreas(true);
      }, 10000); // 10 seconds for faster sync
    }
    
    return () => { 
      mounted = false;
      if (interval) clearInterval(interval);
    };
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="inline-block px-4 py-2 bg-indigo-100 text-indigo-600 rounded-full text-sm font-semibold">🏛️ Khu Vực Trưng Bày</div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => fetchAreas(true)}
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Đang tải...' : 'Làm mới'}
          </Button>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Tất Cả Khu Vực</h1>
      </div>

      {loading && (
        <div className="text-center text-gray-500">Đang tải khu vực...</div>
      )}
      {error && !areas && (
        <div className="text-center text-red-600 mb-4">Không thể tải dữ liệu: {error}</div>
      )}
      {!loading && !error && areas && areas.length === 0 && (
        <div className="text-center text-gray-500">Chưa có khu vực nào.</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {(areas ?? []).map((area) => (
          <Link key={area.id} href={`/areas/${area.id}`} className="block">
            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-1 cursor-pointer">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">Khu vực</Badge>
                </div>
                <CardTitle className="text-xl group-hover:text-indigo-600 transition-colors">{area.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed min-h-16">
                  {area.description || 'Khu vực trưng bày trong bảo tàng.'}
                </p>
                <div className="mt-4 text-sm text-indigo-600 font-semibold group-hover:text-indigo-700 transition-colors">
                  Xem hiện vật →
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}


