'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@museum-manager/ui-core/card';
import { Button } from '@museum-manager/ui-core/button';
import { Badge } from '@museum-manager/ui-core/badge';
import { Input } from '@museum-manager/ui-core/input';
import { getArtifactDetail, postInteraction, getInteractionsByArtifact, getInteractions, visitorMe } from '@/lib/api';
import { Star } from 'lucide-react';

export default function ArtifactDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [interactions, setInteractions] = useState<any[]>([]);
  const [loadingInteractions, setLoadingInteractions] = useState(false);
  const [myRating, setMyRating] = useState<number>(0);
  const [myComment, setMyComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<{ username?: string } | null>(null);

  async function loadInteractions() {
    if (!id) return;
    try {
      setLoadingInteractions(true);
      // Use getInteractionsByArtifact to get ALL interactions for this artifact (all users)
      const res = await getInteractionsByArtifact(String(id), { pageIndex: 1, pageSize: 50 });
      const items = res?.data?.items || res?.items || (Array.isArray(res) ? res : []);
      setInteractions(items);
    } catch (e: any) {
      console.error('Failed to load interactions:', e);
      // Fallback: try to get all interactions and filter client-side (only works for current user)
      try {
        const res = await getInteractions({ pageIndex: 1, pageSize: 100 });
        const items = res?.data?.items || res?.items || [];
        const artifactInteractions = items.filter((i: any) => i.artifactId === id);
        setInteractions(artifactInteractions);
      } catch (e2) {
        console.error('Fallback also failed:', e2);
      }
    } finally {
      setLoadingInteractions(false);
    }
  }

  async function loadCurrentUser() {
    try {
      const session = typeof window !== 'undefined' ? localStorage.getItem('vp_session_user') : null;
      if (session) {
        try {
          const parsed = JSON.parse(session);
          setCurrentUser(parsed);
        } catch {}
      }
      // Also try to get from API
      const me = await visitorMe();
      if (me && (me.username || me.email)) {
        setCurrentUser({ username: me.username || me.email || 'visitor' });
      }
    } catch (e) {
      // Ignore if not logged in
    }
  }

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await getArtifactDetail(String(id));
        setData(res);
      } catch (e: any) {
        setError(e?.message || 'Không tải được thông tin hiện vật');
      }
    })();
    // Load current user info
    loadCurrentUser();
    // Load interactions (all users)
    loadInteractions();
  }, [id]);

  async function handleSubmitInteraction() {
    if (!id || (!myRating && !myComment.trim())) {
      setSubmitError('Vui lòng nhập đánh giá hoặc bình luận');
      return;
    }
    try {
      setSubmitting(true);
      setSubmitError(null);
      await postInteraction({
        artifactId: String(id),
        rating: myRating || undefined,
        comment: myComment.trim() || undefined,
      });
      // Reset form
      setMyComment('');
      // Reload interactions
      await loadInteractions();
    } catch (e: any) {
      setSubmitError(e?.message || 'Gửi tương tác thất bại');
    } finally {
      setSubmitting(false);
    }
  }

  // Calculate average rating
  const ratings = interactions.filter((i) => i.rating && i.rating > 0).map((i) => i.rating);
  const avgRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
  const comments = interactions.filter((i) => i.comment && i.comment.trim());

  const img = data?.mediaItems?.[0]?.filePath;

  return (
    <div className="w-full max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold">Chi tiết hiện vật</h1>
        <Button variant="outline" className="h-11 px-6 text-base" onClick={() => router.back()}>Quay lại</Button>
      </div>
      {error ? <div className="text-red-600 text-sm">{error}</div> : null}
      <Card className="border-none shadow-xl" style={{ background: '#ede7dd' }}>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">{data?.name || 'Hiện vật'}</CardTitle>
        </CardHeader>
        <CardContent>
          {img ? (
            <>
              <img
                src={img}
                alt={data?.name || 'artifact'}
                className="w-full h-[28rem] object-cover rounded-xl mb-5 cursor-zoom-in shadow"
                onClick={() => setPreviewOpen(true)}
              />
              {previewOpen ? (
                <div
                  className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
                  onClick={() => setPreviewOpen(false)}
                >
                  <button
                    className="absolute top-4 right-4 rounded-full bg-white/90 px-3 py-1 text-sm font-medium shadow"
                    onClick={() => setPreviewOpen(false)}
                  >
                    Đóng
                  </button>
                  <img
                    src={img}
                    alt={data?.name || 'artifact'}
                    className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              ) : null}
            </>
          ) : null}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="font-medium">Mã hiện vật</div>
              <div>{data?.id}</div>
            </div>
            <div>
              <div className="font-medium">Mã số</div>
              <div>{data?.artifactCode}</div>
            </div>
            {data?.periodTime ? (
              <div>
                <div className="font-medium">Niên đại</div>
                <span className="inline-flex rounded-full px-2.5 py-1 text-xs" style={{ background: '#FFB6AF' }}>{data.periodTime}</span>
              </div>
            ) : null}
            {data?.areaName ? (
              <div>
                <div className="font-medium">Khu vực</div>
                <span className="inline-flex rounded-full px-2.5 py-1 text-xs" style={{ background: '#FAE0C7' }}>{data.areaName}</span>
              </div>
            ) : null}
            {data?.displayPositionName ? (
              <div>
                <div className="font-medium">Vị trí trưng bày</div>
                <span className="inline-flex rounded-full px-2.5 py-1 text-xs" style={{ background: '#FBC193' }}>{data.displayPositionName}</span>
              </div>
            ) : null}
            {data?.status ? (
              <div>
                <div className="font-medium">Trạng thái</div>
                <span className="inline-flex rounded-full px-2.5 py-1 text-xs text-white" style={{ background: '#4EB09B' }}>{data.status}</span>
              </div>
            ) : null}
          </div>
          {data?.description ? (
            <div className="mt-4">
              <div className="font-medium">Mô tả</div>
              <p className="text-neutral-700">{data.description}</p>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {/* Interactions Section */}
      <Card className="border-none shadow-xl" style={{ background: '#ede7dd' }}>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Đánh giá & Bình luận</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Rating Summary */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="text-3xl font-bold">{avgRating > 0 ? avgRating.toFixed(1) : '—'}</div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${star <= Math.round(avgRating) ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-300'}`}
                  />
                ))}
              </div>
            </div>
            <div className="text-sm text-neutral-600">
              ({ratings.length} đánh giá{ratings.length !== 1 ? '' : ''})
            </div>
          </div>

          {/* Submit Interaction Form */}
          <div className="space-y-4 pt-4 border-t border-neutral-300">
            <div>
              <label className="text-sm font-medium mb-2 block">Đánh giá của bạn</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setMyRating(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-6 h-6 transition-colors ${star <= myRating ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-300 hover:text-yellow-300'}`}
                    />
                  </button>
                ))}
                {myRating > 0 ? (
                  <span className="text-sm text-neutral-600 ml-2">{myRating} sao</span>
                ) : null}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Bình luận của bạn</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Chia sẻ suy nghĩ của bạn về hiện vật này..."
                  value={myComment}
                  onChange={(e) => setMyComment(e.target.value)}
                  className="flex-1"
                />
                <Button
                  onClick={handleSubmitInteraction}
                  disabled={submitting || (!myRating && !myComment.trim())}
                  style={{ background: '#4EB09B' }}
                >
                  {submitting ? 'Đang gửi...' : 'Gửi'}
                </Button>
              </div>
            </div>
            {submitError ? <div className="text-sm text-red-600">{submitError}</div> : null}
          </div>

          {/* Comments List */}
          {loadingInteractions ? (
            <div className="text-sm text-neutral-500">Đang tải bình luận...</div>
          ) : comments.length > 0 ? (
            <div className="space-y-4 pt-4 border-t border-neutral-300">
              <div className="font-medium text-sm">Bình luận ({comments.length})</div>
              <div className="space-y-3">
                {comments.slice(0, 20).map((interaction, idx) => (
                  <div key={idx} className="bg-white/60 rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-medium text-sm text-neutral-800">
                        {interaction.visitorName || interaction.visitor?.username || interaction.username || 'Người dùng'}
                      </div>
                      {interaction.createdAt ? (
                        <div className="text-xs text-neutral-500">
                          {new Date(interaction.createdAt).toLocaleDateString('vi-VN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      ) : null}
                    </div>
                    {interaction.rating && interaction.rating > 0 ? (
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${star <= interaction.rating ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-300'}`}
                          />
                        ))}
                      </div>
                    ) : null}
                    {interaction.comment ? (
                      <p className="text-sm text-neutral-700">{interaction.comment}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-sm text-neutral-500 pt-4 border-t border-neutral-300">
              Chưa có bình luận nào. Hãy là người đầu tiên đánh giá!
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


