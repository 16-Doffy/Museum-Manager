import { useParams } from 'react-router-dom';

export default function RolePermissionsPage() {
  const { roleId } = useParams<{ roleId: string }>();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Quyền của vai trò #{roleId}</h1>
        <p className="text-muted-foreground">Quản lý quyền cho vai trò</p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <p className="text-muted-foreground">Tính năng đang được phát triển...</p>
      </div>
    </div>
  );
}

