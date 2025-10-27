import { useParams } from 'react-router-dom';

export default function MuseumDetailPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Chi tiết bảo tàng #{id}</h1>
        <p className="text-muted-foreground">Thông tin chi tiết về bảo tàng</p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <p className="text-muted-foreground">Tính năng đang được phát triển...</p>
      </div>
    </div>
  );
}

