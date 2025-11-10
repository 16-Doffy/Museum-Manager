'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@museum-manager/ui-core/card';

export default function ArtifactByCodePage() {
  const { artifactCode } = useParams<{ artifactCode: string }>();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!artifactCode) return;
    (async () => {
      try {
        setError(null);
        // Call the same base as other APIs. We avoid importing api.ts here to keep this file lightweight.
        const API_BASE =
          process.env.NEXT_PUBLIC_API_BASE ||
          process.env.VITE_API_URL ||
          'https://museum-system-api-160202770359.asia-southeast1.run.app/api/v1';

        const res = await fetch(`${API_BASE}/artifacts/code/${encodeURIComponent(String(artifactCode))}`, {
          headers: { 'Content-Type': 'application/json' },
        });
        if (!res.ok) {
          const txt = await res.text().catch(() => '');
          throw new Error(txt || `Không tìm thấy hiện vật với mã "${artifactCode}"`);
        }
        const data = await res.json().catch(() => null);
        const artifact = data?.data || data;
        const id = artifact?.id || artifact?.artifactId;
        if (!id) throw new Error('Phản hồi không hợp lệ từ server.');
        router.replace(`/artifacts/${id}`);
      } catch (e: any) {
        setError(e?.message || 'Không thể tải hiện vật theo mã.');
      }
    })();
  }, [artifactCode, router]);

  return (
    <div className="w-full max-w-3xl mx-auto">
      <Card className="border-none shadow-xl" style={{ background: '#ede7dd' }}>
        <CardHeader>
          <CardTitle className="text-xl">Đang mở hiện vật theo mã</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-neutral-700">
            {error ? (
              <div className="text-red-600">{error}</div>
            ) : (
              <div>Vui lòng chờ trong giây lát…</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


