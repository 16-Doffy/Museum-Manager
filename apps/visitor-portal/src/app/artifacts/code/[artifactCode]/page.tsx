'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@museum-manager/ui-core/card';
import { getArtifactByCode } from '@/lib/api';

export default function ArtifactByCodePage() {
  const { artifactCode } = useParams<{ artifactCode: string }>();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!artifactCode) {
      setError('Mã hiện vật không hợp lệ');
      setLoading(false);
      return;
    }

    (async () => {
      try {
        setError(null);
        setLoading(true);
        
        // Decode artifactCode if it's URL encoded
        let code = decodeURIComponent(String(artifactCode));
        
        // If the code contains a URL, extract the code from it
        // Example: https://domain.com/artifacts/code/BAO-ART-0003 -> BAO-ART-0003
        if (code.includes('/artifacts/code/')) {
          code = code.split('/artifacts/code/').pop() || code;
        }
        // If it's a full URL, try to extract the code
        else if (code.startsWith('http')) {
          const url = new URL(code);
          const pathParts = url.pathname.split('/');
          const codeIndex = pathParts.indexOf('code');
          if (codeIndex !== -1 && pathParts[codeIndex + 1]) {
            code = pathParts[codeIndex + 1];
          }
        }

        // Get artifact by code
        const artifact = await getArtifactByCode(code);
        const id = artifact?.id || artifact?.artifactId;
        
        if (!id) {
          throw new Error('Không tìm thấy ID hiện vật trong phản hồi từ server.');
        }
        
        // Redirect to artifact detail page
        router.replace(`/artifacts/${id}`);
      } catch (e: any) {
        console.error('Error loading artifact by code:', e);
        setError(e?.message || `Không thể tải hiện vật với mã "${artifactCode}". Vui lòng kiểm tra lại mã QR code.`);
        setLoading(false);
      }
    })();
  }, [artifactCode, router]);

  return (
    <div className="w-full min-h-screen bg-black text-white flex items-center justify-center p-6">
      <Card className="border border-neutral-800 bg-neutral-800/50 shadow-xl backdrop-blur-sm max-w-md w-full">
        <CardHeader className="p-6">
          <CardTitle className="text-2xl font-bold text-white">Đang tải thông tin hiện vật</CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          {loading && !error ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <div className="text-white/80">Đang tìm kiếm hiện vật theo mã QR code...</div>
              </div>
              <p className="text-sm text-white/60">Vui lòng chờ trong giây lát</p>
            </div>
          ) : error ? (
            <div className="space-y-4">
              <div className="text-red-400 font-medium">Không thể tải hiện vật</div>
              <p className="text-sm text-white/80">{error}</p>
              <button
                onClick={() => router.push('/select-museum')}
                className="mt-4 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg transition-colors"
              >
                Quay lại trang chủ
              </button>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}


