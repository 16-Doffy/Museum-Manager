'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@museum-manager/ui-core/card';
import { Button } from '@museum-manager/ui-core/button';
import { Badge } from '@museum-manager/ui-core/badge';
import { Input } from '@museum-manager/ui-core/input';
import { getMuseumDetail, getArtifactsByMuseum } from '@/lib/api';
import Link from 'next/link';

export default function MuseumDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [artifacts, setArtifacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        setLoading(true);
        const res = await getMuseumDetail(id);
        setData((res as any).data || res);
        const arts = await getArtifactsByMuseum(String(id), { pageIndex: 1, pageSize: 24 });
        setArtifacts(arts || []);
      } catch (e: any) {
        setError(e?.message || 'Không tải được thông tin bảo tàng');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  return (
    <div className="w-full max-w-7xl">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl shadow-lg mb-8">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(90deg, #F28076 0%, #FFB6AF 20%, #FAE0C7 45%, #FBC193 70%, #4EB09B 100%)',
            opacity: 0.35,
          }}
        />
        <div className="relative z-10 p-8 sm:p-12 md:p-14">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
                {data?.name || 'Thông tin bảo tàng'}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-neutral-800">
                {data?.location ? (
                  <span className="inline-flex rounded-full px-3 py-1 bg-[#FAE0C7]">
                    Địa điểm: {data.location}
                  </span>
                ) : null}
                <span className="inline-flex rounded-full px-3 py-1 bg-[#FFB6AF]">Mã: {data?.id}</span>
                <span className="inline-flex rounded-full px-3 py-1 bg-[#FBC193]">Số hiện vật: {artifacts.length}</span>
              </div>
              {data?.description ? (
                <p className="mt-5 max-w-4xl text-neutral-700 text-lg">{data.description}</p>
              ) : null}
            </div>
            <Button variant="outline" className="h-11 px-6 text-base" onClick={() => router.back()}>Quay lại</Button>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="mb-6 flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">Hiện vật</h2>
        <div className="w-72">
          <Input className="h-12 text-base" placeholder="Tìm hiện vật..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
      </div>

      {/* Artifacts */}
      {loading ? <div>Đang tải hiện vật...</div> : null}
      {!loading && artifacts.length === 0 ? (
        <div className="text-neutral-500">Chưa có hiện vật nào.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {artifacts
            .filter((a) => (query ? String(a.name || '').toLowerCase().includes(query.toLowerCase()) : true))
            .map((a) => (
              <Card key={a.id} className="rounded-2xl border-none shadow-xl hover:shadow-lg transition-transform hover:-translate-y-0.5" style={{ background: '#ede7dd' }}>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    <Link href={`/artifacts/${a.id}`} className="hover:underline">
                      {a.name}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-neutral-700 space-y-2">
                    {a.periodTime ? (
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Niên đại:</span>
                        <span className="inline-flex rounded-full px-2.5 py-1 text-xs" style={{ background: '#FFB6AF' }}>{a.periodTime}</span>
                      </div>
                    ) : null}
                    {a.areaName ? (
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Khu vực:</span>
                        <span className="inline-flex rounded-full px-2.5 py-1 text-xs" style={{ background: '#FAE0C7' }}>{a.areaName}</span>
                      </div>
                    ) : null}
                    {a.displayPositionName ? (
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Vị trí trưng bày:</span>
                        <span className="inline-flex rounded-full px-2.5 py-1 text-xs" style={{ background: '#FBC193' }}>{a.displayPositionName}</span>
                      </div>
                    ) : null}
                    {a.status ? (
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Trạng thái:</span>
                        <span className="inline-flex rounded-full px-2.5 py-1 text-xs text-white" style={{ background: '#4EB09B' }}>{a.status}</span>
                      </div>
                    ) : null}
                    <div className="text-neutral-400 text-xs break-all">ID: {a.id}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      )}
    </div>
  );
}


