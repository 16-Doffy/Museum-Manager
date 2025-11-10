'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@museum-manager/ui-core/card';
import { Button } from '@museum-manager/ui-core/button';
import { Input } from '@museum-manager/ui-core/input';
import { Star } from 'lucide-react';
import { getArtifactByCode, getArtifactDetail, postInteraction, getInteractionsByArtifact } from '@/lib/api';
import QRCode from 'react-qr-code';

export default function ArtifactByCodePage() {
  const { artifactCode } = useParams<{ artifactCode: string }>();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [interactions, setInteractions] = useState<any[]>([]);
  const [loadingInteractions, setLoadingInteractions] = useState(false);
  const [myRating, setMyRating] = useState<number>(0);
  const [myComment, setMyComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  async function loadInteractions() {
    if (!data?.id) return;
    try {
      setLoadingInteractions(true);
      const res = await getInteractionsByArtifact(String(data.id), { pageIndex: 1, pageSize: 50 });
      const items = res?.data?.items || res?.items || (Array.isArray(res) ? res : []);
      setInteractions(items);
    } catch (e: any) {
      console.error('Failed to load interactions:', e);
    } finally {
      setLoadingInteractions(false);
    }
  }

  async function handleSubmitInteraction() {
    if (!data?.id) return;
    if (!myRating && !myComment.trim()) {
      setSubmitError('Vui lòng nhập đánh giá hoặc bình luận');
      return;
    }
    try {
      setSubmitting(true);
      setSubmitError(null);
      await postInteraction({
        artifactId: String(data.id),
        rating: myRating || undefined,
        comment: myComment.trim() || undefined,
      });
      setMyRating(0);
      setMyComment('');
      await loadInteractions();
    } catch (e: any) {
      setSubmitError(e?.message || 'Gửi tương tác thất bại');
    } finally {
      setSubmitting(false);
    }
  }

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

        // Get artifact by code first to get the ID
        const artifact = await getArtifactByCode(code);
        const id = artifact?.id || artifact?.artifactId;
        
        if (!id) {
          throw new Error('Không tìm thấy ID hiện vật trong phản hồi từ server.');
        }
        
        // Get full artifact details
        const artifactDetail = await getArtifactDetail(String(id));
        setData(artifactDetail);
        
        // Load interactions
        await loadInteractions();
      } catch (e: any) {
        console.error('Error loading artifact by code:', e);
        setError(e?.message || `Không thể tải hiện vật với mã "${artifactCode}". Vui lòng kiểm tra lại mã QR code.`);
      } finally {
        setLoading(false);
      }
    })();
  }, [artifactCode]);

  useEffect(() => {
    if (data?.id) {
      loadInteractions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.id]);

  const img = data?.mediaItems?.[0]?.filePath;
  const ratings = interactions.filter((i) => i.rating && i.rating > 0).map((i) => i.rating);
  const avgRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
  const comments = interactions.filter((i) => i.comment && i.comment.trim());

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6">
        <Card className="border border-neutral-800 bg-neutral-800/50 shadow-xl backdrop-blur-sm max-w-md w-full">
          <CardHeader className="p-6">
            <CardTitle className="text-2xl font-bold text-white">Đang tải thông tin hiện vật</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <div className="text-white/80">Đang tìm kiếm hiện vật theo mã QR code...</div>
              </div>
              <p className="text-sm text-white/60">Vui lòng chờ trong giây lát</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6">
        <Card className="border border-neutral-800 bg-neutral-800/50 shadow-xl backdrop-blur-sm max-w-md w-full">
          <CardHeader className="p-6">
            <CardTitle className="text-2xl font-bold text-white">Lỗi</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="space-y-4">
              <div className="text-red-400 font-medium">Không thể tải hiện vật</div>
              <p className="text-sm text-white/80">{error}</p>
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

  if (!data) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/95 z-50 overflow-y-auto">
      {/* Close Button */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => router.back()}
          className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Modal Content */}
      <div className="w-full min-h-screen bg-black text-white">
        {/* Hero Section - British Museum Style */}
        <div className="relative w-full min-h-[60vh] flex flex-col">
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
            {/* Main Hero Content */}
            <div className="flex-1 flex flex-col justify-center px-6 md:px-12 lg:px-16 pb-16 pt-20">
              <div className="max-w-6xl w-full">
                {/* Welcome Text */}
                <div className="text-white/90 italic text-xl md:text-2xl lg:text-3xl font-sans mb-4 text-center font-light tracking-wide">
                  Chi tiết hiện vật
                </div>

                {/* Artifact Name - Large Typography */}
                <div className="mb-8 md:mb-12">
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-sans font-extrabold text-white leading-none tracking-tight">
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
                      className="w-full h-[300px] md:h-[400px] lg:h-[500px] object-cover rounded-lg shadow-2xl cursor-zoom-in"
                      onClick={() => {
                        setPreviewImage(img);
                        setPreviewOpen(true);
                      }}
                    />
                  </div>
                )}

                {/* Description at bottom left */}
                {data?.description && (
                  <div className="mt-8">
                    <p className="text-white/80 text-sm md:text-base leading-relaxed max-w-2xl">
                      {data.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="bg-neutral-900 py-16 px-6 md:px-12 lg:px-16">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Artifact Information */}
            <Card className="border border-neutral-800 bg-neutral-800/50 shadow-xl backdrop-blur-sm">
              <CardHeader className="p-6">
                <CardTitle className="text-2xl md:text-3xl font-bold text-white">Thông tin hiện vật</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-base">
                  {data?.artifactCode ? (
                    <div>
                      <div className="font-medium text-white/90 mb-2">Mã số / QR Code</div>
                      <div className="flex flex-col gap-2">
                        {/* Generate QR code with full URL */}
                        {typeof window !== 'undefined' && (
                          <div 
                            className="w-32 h-32 bg-white p-2 rounded-lg cursor-zoom-in hover:opacity-90 transition-opacity inline-flex items-center justify-center"
                            onClick={() => {
                              const qrUrl = `${window.location.origin}/artifacts/code/${encodeURIComponent(data.artifactCode)}`;
                              setPreviewImage(qrUrl);
                              setPreviewOpen(true);
                            }}
                          >
                            <QRCode
                              value={`${window.location.origin}/artifacts/code/${encodeURIComponent(data.artifactCode)}`}
                              size={120}
                              style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
                              viewBox="0 0 256 256"
                            />
                          </div>
                        )}
                        <p className="text-xs text-white/60">Click vào QR code để phóng to</p>
                      </div>
                    </div>
                  ) : null}
                  {data?.periodTime ? (
                    <div>
                      <div className="font-medium text-white/90 mb-2">Niên đại</div>
                      <span className="inline-flex rounded-full px-3 py-1.5 text-sm bg-neutral-700 text-white">{data.periodTime}</span>
                    </div>
                  ) : null}
                  {data?.isOriginal !== undefined ? (
                    <div>
                      <div className="font-medium text-white/90 mb-2">Tính chất</div>
                      <span className="inline-flex rounded-full px-3 py-1.5 text-sm bg-neutral-700 text-white">
                        {data.isOriginal ? 'Bản gốc' : 'Bản sao'}
                      </span>
                    </div>
                  ) : null}
                  {data?.status ? (
                    <div>
                      <div className="font-medium text-white/90 mb-2">Trạng thái</div>
                      <span className="inline-flex rounded-full px-3 py-1.5 text-sm bg-green-600/80 text-white">{data.status}</span>
                    </div>
                  ) : null}
                  {data?.areaName ? (
                    <div>
                      <div className="font-medium text-white/90 mb-2">Khu vực</div>
                      <div className="text-white/80">
                        <span className="inline-flex rounded-full px-3 py-1.5 text-sm bg-neutral-700 text-white mb-1">{data.areaName}</span>
                        {data?.areaDescription ? (
                          <p className="text-sm text-white/60 mt-1">{data.areaDescription}</p>
                        ) : null}
                      </div>
                    </div>
                  ) : null}
                  {data?.displayPositionName ? (
                    <div>
                      <div className="font-medium text-white/90 mb-2">Vị trí trưng bày</div>
                      <div className="text-white/80">
                        <span className="inline-flex rounded-full px-3 py-1.5 text-sm bg-neutral-700 text-white mb-1">{data.displayPositionName}</span>
                        {data?.displayPositionDescription ? (
                          <p className="text-sm text-white/60 mt-1">{data.displayPositionDescription}</p>
                        ) : null}
                      </div>
                    </div>
                  ) : null}
                </div>
                {/* Physical Dimensions */}
                {(data?.weight || data?.height || data?.width || data?.length) && (
                  <div className="mt-6 pt-6 border-t border-neutral-700">
                    <div className="font-medium text-white/90 mb-4 text-lg">Kích thước & Trọng lượng</div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {data?.weight !== undefined && data?.weight !== null ? (
                        <div>
                          <div className="text-sm text-white/60 mb-1">Trọng lượng</div>
                          <div className="text-white/80 font-medium">{data.weight} kg</div>
                        </div>
                      ) : null}
                      {data?.height !== undefined && data?.height !== null ? (
                        <div>
                          <div className="text-sm text-white/60 mb-1">Chiều cao</div>
                          <div className="text-white/80 font-medium">{data.height} cm</div>
                        </div>
                      ) : null}
                      {data?.width !== undefined && data?.width !== null ? (
                        <div>
                          <div className="text-sm text-white/60 mb-1">Chiều rộng</div>
                          <div className="text-white/80 font-medium">{data.width} cm</div>
                        </div>
                      ) : null}
                      {data?.length !== undefined && data?.length !== null ? (
                        <div>
                          <div className="text-sm text-white/60 mb-1">Chiều dài</div>
                          <div className="text-white/80 font-medium">{data.length} cm</div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                )}
                {/* Media Gallery */}
                {data?.mediaItems && Array.isArray(data.mediaItems) && data.mediaItems.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-neutral-700">
                    <div className="font-medium text-white/90 mb-4 text-lg">Hình ảnh</div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {data.mediaItems.map((media: any, idx: number) => (
                        <div
                          key={idx}
                          className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
                          onClick={() => {
                            if (media.filePath) {
                              setPreviewImage(media.filePath);
                              setPreviewOpen(true);
                            }
                          }}
                        >
                          <img
                            src={media.filePath}
                            alt={media.fileName || `Hình ảnh ${idx + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {/* Metadata */}
                {(data?.createdAt || data?.updatedAt) && (
                  <div className="mt-6 pt-6 border-t border-neutral-700">
                    <div className="font-medium text-white/90 mb-4 text-lg">Thông tin bổ sung</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      {data?.createdAt ? (
                        <div>
                          <div className="text-white/60 mb-1">Ngày tạo</div>
                          <div className="text-white/80">
                            {new Date(data.createdAt).toLocaleDateString('vi-VN', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </div>
                      ) : null}
                      {data?.updatedAt ? (
                        <div>
                          <div className="text-white/60 mb-1">Cập nhật lần cuối</div>
                          <div className="text-white/80">
                            {new Date(data.updatedAt).toLocaleDateString('vi-VN', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                )}
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

      {/* Image Preview Modal */}
      {previewOpen && previewImage && (
        <div
          className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-4"
          onClick={() => {
            setPreviewOpen(false);
            setPreviewImage(null);
          }}
        >
          <button
            className="absolute top-4 right-4 rounded-full bg-white/90 px-4 py-2 text-sm font-medium shadow text-black hover:bg-white transition-colors z-10"
            onClick={() => {
              setPreviewOpen(false);
              setPreviewImage(null);
            }}
          >
            Đóng
          </button>
          {previewImage.startsWith('http') && data?.artifactCode ? (
            // Show QR code if preview is a URL
            <div className="bg-white p-8 rounded-lg" onClick={(e) => e.stopPropagation()}>
              <QRCode
                value={previewImage}
                size={400}
                style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
                viewBox="0 0 256 256"
              />
            </div>
          ) : (
            <img
              src={previewImage}
              alt={data?.name || 'artifact'}
              className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          )}
        </div>
      )}
    </div>
  );
}
