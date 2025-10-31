'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { http } from '@/lib/api/client';
import { areaEndpoints, artifactEndpoints } from '@/lib/api/endpoints';
import { mockAreas, mockArtifacts } from '@/lib/api/mockData';
import { USE_MOCK_DATA_ONLY } from '@/lib/api/config';
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from '@museum-manager/ui-core/client';
import { ArrowLeft, Calendar, MapPin, RefreshCw } from 'lucide-react';
import type { Artifact, PaginatedResponse, ApiResponse, Area } from '@/lib/api/types';

export default function AreaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const areaId = params.areaId as string;

  const [area, setArea] = useState<Area | null>(null);
  const [artifacts, setArtifacts] = useState<Artifact[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [usingMockData, setUsingMockData] = useState<boolean>(false);

  const fetchData = async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true);
    
    if (USE_MOCK_DATA_ONLY) {
      // Use mock data directly (filter active only)
      const mockArea = mockAreas.find((a) => a.id === areaId && a.isActive && !a.isDeleted);
      if (mockArea && mockArea.museumId) {
        setArea({
          ...mockArea,
          museumId: mockArea.museumId, // Ensure museumId exists
        } as Area);
      } else {
        setArea(null);
      }
      
      // Filter artifacts by areaId from mock data (active only)
      const filtered = mockArtifacts.filter((art) => 
        art.areaId === areaId && art.isActive && !art.isDeleted
      );
      setArtifacts(filtered as unknown as Artifact[]);
      
      setError(null);
      setUsingMockData(true);
      setLoading(false);
      setRefreshing(false);
      return;
    }

    // Try API first, fallback to mock
    try {
      // Fetch area info
      try {
        const areaRes = await http<ApiResponse<Area> | Area>(areaEndpoints.getById(areaId));
        const areaData = 'data' in areaRes && 'success' in areaRes 
          ? (areaRes as ApiResponse<Area>).data 
          : (areaRes as Area);
        
        // Only use if area is active and not deleted
        if (areaData && areaData.isActive && !areaData.isDeleted) {
          setArea(areaData);
        } else {
          throw new Error('Area not found or inactive');
        }
      } catch (e) {
        const mockArea = mockAreas.find((a) => a.id === areaId && a.isActive && !a.isDeleted);
        if (mockArea && mockArea.museumId) {
          setArea({
            ...mockArea,
            museumId: mockArea.museumId,
          } as Area);
        } else {
          setArea(null);
        }
      }

      // Fetch artifacts for this area
      try {
        const artifactsRes = await http<ApiResponse<Artifact[]> | PaginatedResponse<Artifact> | Artifact[]>(artifactEndpoints.getAll);
        
        // Handle different response formats
        let allArtifacts: Artifact[] = [];
        if (Array.isArray(artifactsRes)) {
          allArtifacts = artifactsRes;
        } else if ('data' in artifactsRes && Array.isArray(artifactsRes.data)) {
          allArtifacts = artifactsRes.data;
        } else if ('data' in artifactsRes && 'success' in artifactsRes && Array.isArray((artifactsRes as ApiResponse<Artifact[]>).data)) {
          allArtifacts = (artifactsRes as ApiResponse<Artifact[]>).data;
        }
        
        // Filter: artifacts by areaId, active only, not deleted (sync with museum-portal)
        const filtered = allArtifacts.filter((art) => 
          (art.areaId === areaId || art.area?.id === areaId) &&
          art.isActive && 
          !art.isDeleted
        );
        
        setArtifacts(filtered);
        setError(null);
        setUsingMockData(false);
      } catch (e: unknown) {
        // Fallback to mock data (filter active only)
        const filtered = mockArtifacts.filter((art) => 
          art.areaId === areaId && art.isActive && !art.isDeleted
        );
        setArtifacts(filtered as unknown as Artifact[]);
        setUsingMockData(true);
        setError(null);
      }
    } catch (e: unknown) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    let interval: NodeJS.Timeout | null = null;
    
    // Initial fetch
    fetchData();
    
    if (!USE_MOCK_DATA_ONLY) {
      // Auto-refresh every 10 seconds to sync with museum-portal changes quickly
      interval = setInterval(() => {
        if (!mounted) return;
        fetchData(true);
      }, 10000); // 10 seconds for faster sync
    }
    
    return () => { 
      mounted = false;
      if (interval) clearInterval(interval);
    };
  }, [areaId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center text-gray-500">Đang tải dữ liệu...</div>
      </div>
    );
  }

  if (!area) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Khu vực không tồn tại</h1>
          <Button asChild variant="outline">
            <Link href="/areas">← Quay lại danh sách khu vực</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Back Button */}
      <Button asChild variant="ghost" className="mb-6">
        <Link href="/areas" className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Quay lại danh sách khu vực
        </Link>
      </Button>

      {/* Area Header */}
      <div className="mb-12">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="inline-block px-4 py-2 bg-indigo-100 text-indigo-600 rounded-full text-sm font-semibold">
            🏛️ Khu Vực
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => fetchData(true)}
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Đang tải...' : 'Làm mới'}
          </Button>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{area.name}</h1>
        {area.description && (
          <p className="text-xl text-gray-600 max-w-3xl leading-relaxed">{area.description}</p>
        )}
      </div>

      {/* Artifacts Section */}
      <div>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Hiện Vật Trong Khu Vực
          </h2>
          <Badge className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-lg px-4 py-2">
            {artifacts?.length || 0} hiện vật
          </Badge>
        </div>

        {error && (
          <div className="text-center text-red-600 mb-4">Không thể tải dữ liệu: {error}</div>
        )}

        {!loading && artifacts && artifacts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">Chưa có hiện vật nào trong khu vực này.</p>
            <Button asChild variant="outline">
              <Link href="/areas">← Quay lại danh sách khu vực</Link>
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(artifacts ?? []).map((artifact) => (
            <Card key={artifact.id} className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-1">
              <div className="relative overflow-hidden">
                <div className="aspect-[4/3] bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                  {artifact.media && artifact.media.length > 0 ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={artifact.media[0].url} 
                      alt={artifact.name} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-2xl">🏺</span>
                      </div>
                      <p className="text-gray-600 font-medium">Hình ảnh hiện vật</p>
                    </div>
                  )}
                </div>
              </div>

              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="text-xs bg-indigo-50 text-indigo-600 border-indigo-200 font-semibold px-3 py-1 rounded-full">
                    {artifact.code}
                  </Badge>
                </div>
                <CardTitle className="text-xl group-hover:text-indigo-600 transition-colors">
                  {artifact.name}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                {artifact.description && (
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                    {artifact.description}
                  </p>
                )}

                <div className="space-y-2 text-sm text-gray-500">
                  {artifact.periodTime && (
                    <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-lg">
                      <Calendar className="w-4 h-4 text-indigo-500" />
                      <span className="font-medium">{artifact.periodTime}</span>
                    </div>
                  )}
                  {artifact.year && (
                    <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-lg">
                      <MapPin className="w-4 h-4 text-green-500" />
                      <span className="font-medium">Niên đại: {artifact.year}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

