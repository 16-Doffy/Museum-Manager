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
    <div className="w-full min-h-screen bg-black text-white">
      {/* Hero Section - British Museum Style */}
      <div className="relative w-full min-h-[90vh] flex flex-col">
        {/* Background Image */}
        {img ? (
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${img})`,
            }}
          >
            <div className="absolute inset-0 bg-black/70" />
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
                Chi tiết hiện vật
              </div>

              {/* Artifact Name - Large Typography */}
              <div className="mb-8 md:mb-12">
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-sans font-extrabold text-white leading-none tracking-tight">
                  <span className="block text-left">{data?.name?.split(' ').slice(0, Math.ceil((data?.name?.split(' ').length || 1) / 2)).join(' ') || 'HIỆN VẬT'}</span>
                  {data?.name && data.name.split(' ').length > 1 && (
                    <span className="block text-right mt-2">
                      {data.name.split(' ').slice(Math.ceil((data.name.split(' ').length || 1) / 2)).join(' ')}
                    </span>
                  )}
                </h1>
              </div>

              {/* Center Image Section */}
              {img && (
                <div className="my-8 md:my-12">
                  <img
                    src={img}
                    alt={data?.name || 'Hiện vật'}
                    className="w-full h-[400px] md:h-[500px] lg:h-[600px] object-cover rounded-lg shadow-2xl cursor-zoom-in"
                    onClick={() => setPreviewOpen(true)}
                  />
                  {previewOpen ? (
                    <div
                      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
                      onClick={() => setPreviewOpen(false)}
                    >
                      <button
                        className="absolute top-4 right-4 rounded-full bg-white/90 px-4 py-2 text-sm font-medium shadow text-black hover:bg-white transition-colors"
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
                </div>
              )}

              {/* Call to Action Button - Scroll to details */}
              <div className="flex justify-end mt-8 md:mt-12">
                <button
                  onClick={() => {
                    const detailsSection = document.getElementById('details-section');
                    detailsSection?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full border-2 border-white/80 hover:border-white transition-all flex items-center justify-center group"
                >
                  <span className="text-white text-sm md:text-base font-medium text-center px-4 group-hover:scale-105 transition-transform">
                    XEM CHI TIẾT
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

      {/* Details Section */}
      <div id="details-section" className="bg-neutral-900 py-16 px-6 md:px-12 lg:px-16">
        <div className="max-w-6xl mx-auto space-y-8">
          {error ? <div className="text-red-400 text-sm bg-red-900/20 p-4 rounded-lg">{error}</div> : null}
          
          {/* Artifact Information */}
          <Card className="border border-neutral-800 bg-neutral-800/50 shadow-xl backdrop-blur-sm">
            <CardHeader className="p-6">
              <CardTitle className="text-2xl md:text-3xl font-bold text-white">Thông tin hiện vật</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-base">
                {data?.artifactCode ? (
                  <div>
                    <div className="font-medium text-white/90 mb-2">Mã số</div>
                    <div className="text-white/80">{data?.artifactCode}</div>
                  </div>
                ) : null}
                {data?.periodTime ? (
                  <div>
                    <div className="font-medium text-white/90 mb-2">Niên đại</div>
                    <span className="inline-flex rounded-full px-3 py-1.5 text-sm bg-neutral-700 text-white">{data.periodTime}</span>
                  </div>
                ) : null}
                {data?.areaName ? (
                  <div>
                    <div className="font-medium text-white/90 mb-2">Khu vực</div>
                    <span className="inline-flex rounded-full px-3 py-1.5 text-sm bg-neutral-700 text-white">{data.areaName}</span>
                  </div>
                ) : null}
                {data?.displayPositionName ? (
                  <div>
                    <div className="font-medium text-white/90 mb-2">Vị trí trưng bày</div>
                    <span className="inline-flex rounded-full px-3 py-1.5 text-sm bg-neutral-700 text-white">{data.displayPositionName}</span>
                  </div>
                ) : null}
                {data?.status ? (
                  <div>
                    <div className="font-medium text-white/90 mb-2">Trạng thái</div>
                    <span className="inline-flex rounded-full px-3 py-1.5 text-sm bg-green-600/80 text-white">{data.status}</span>
                  </div>
                ) : null}
              </div>
            </CardContent>
          </Card>

          {/* Interactions Section */}
          <Card className="border border-neutral-800 bg-neutral-800/50 shadow-xl backdrop-blur-sm">
            <CardHeader className="p-6">
              <CardTitle className="text-2xl md:text-3xl font-bold text-white">Đánh giá & Bình luận</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-6">
              {/* Rating Summary */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="text-4xl font-bold text-white">{avgRating > 0 ? avgRating.toFixed(1) : '—'}</div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-6 h-6 ${star <= Math.round(avgRating) ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-600'}`}
                      />
                    ))}
                  </div>
                </div>
                <div className="text-sm text-white/60">
                  ({ratings.length} đánh giá{ratings.length !== 1 ? '' : ''})
                </div>
              </div>

              {/* Submit Interaction Form */}
              <div className="space-y-4 pt-4 border-t border-neutral-700">
                <div>
                  <label className="text-sm font-medium mb-2 block text-white/90">Đánh giá của bạn</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setMyRating(star)}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`w-6 h-6 transition-colors ${star <= myRating ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-600 hover:text-yellow-400'}`}
                        />
                      </button>
                    ))}
                    {myRating > 0 ? (
                      <span className="text-sm text-white/60 ml-2">{myRating} sao</span>
                    ) : null}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block text-white/90">Bình luận của bạn</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Chia sẻ suy nghĩ của bạn về hiện vật này..."
                      value={myComment}
                      onChange={(e) => setMyComment(e.target.value)}
                      className="flex-1 bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-400 focus:border-white"
                    />
                    <Button
                      onClick={handleSubmitInteraction}
                      disabled={submitting || (!myRating && !myComment.trim())}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      {submitting ? 'Đang gửi...' : 'Gửi'}
                    </Button>
                  </div>
                </div>
                {submitError ? <div className="text-sm text-red-400 bg-red-900/20 p-3 rounded-lg">{submitError}</div> : null}
              </div>

              {/* Comments List */}
              {loadingInteractions ? (
                <div className="text-sm text-white/60 text-center py-8">Đang tải bình luận...</div>
              ) : comments.length > 0 ? (
                <div className="space-y-4 pt-4 border-t border-neutral-700">
                  <div className="font-medium text-base text-white">Bình luận ({comments.length})</div>
                  <div className="space-y-3">
                    {comments.slice(0, 20).map((interaction, idx) => (
                      <div key={idx} className="bg-neutral-800/50 rounded-lg p-4 space-y-2 border border-neutral-700">
                        <div className="flex items-center justify-between gap-2">
                          <div className="font-medium text-sm text-white">
                            {interaction.visitorName || interaction.visitor?.username || interaction.username || 'Người dùng'}
                          </div>
                          {interaction.createdAt ? (
                            <div className="text-xs text-white/50">
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
                                className={`w-4 h-4 ${star <= interaction.rating ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-600'}`}
                              />
                            ))}
                          </div>
                        ) : null}
                        {interaction.comment ? (
                          <p className="text-sm text-white/80">{interaction.comment}</p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-sm text-white/60 pt-4 border-t border-neutral-700 text-center py-8">
                  Chưa có bình luận nào. Hãy là người đầu tiên đánh giá!
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


