import { useParams } from 'react-router-dom';

export default function MuseumRequestDetailPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Chi tiết yêu cầu #{id}</h1>
        <p className="text-muted-foreground">Xem xét và phê duyệt yêu cầu đăng ký bảo tàng</p>
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <p className="text-muted-foreground">Tính năng đang được phát triển...</p>
      </div>
    </div>
  );
}

