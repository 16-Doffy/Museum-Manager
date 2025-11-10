import { getErrorMessage } from '@/lib/error-utils';
import { useState } from 'react';
import { toast } from 'sonner';
import { useMuseums } from '../museum/hooks/useMuseums';
import { Museum } from '../museum/types';
import { useAccounts } from '../users/hooks/useAccounts';
import { Account } from '../users/types';
import AssignMuseumModal from './components/AssignMuseumModal';
import { useAssignMuseum } from './hooks/useAssignMuseum';

export default function MuseumApprovalPage() {
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  // Fetch pending accounts (no museum assigned yet)
  const { data: accountsData, isLoading: accountsLoading } = useAccounts({ pageIndex: 1, pageSize: 100 });

  // Fetch pending museums
  const { data: museumsData, isLoading: museumsLoading } = useMuseums({
    pageIndex: 1,
    pageSize: 100,
    Status: 'Pending',
  });

  const assignMutation = useAssignMuseum();

  // Filter pending accounts (accounts without museum)
  const pendingAccounts =
    accountsData?.items.filter((account) => account.status === 'Pending' && !account.museumId) || [];

  // Pending museums
  const pendingMuseums = museumsData?.items || [];

  const handleAssign = async (accountId: string, museumId: string) => {
    try {
      await assignMutation.mutateAsync({ accountId, museumId });
      toast.success('Phê duyệt thành công! Account và Museum đã được kích hoạt.');
      setIsAssignModalOpen(false);
      setSelectedAccount(null);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Không thể phê duyệt'));
    }
  };

  const openAssignModal = (account: Account) => {
    setSelectedAccount(account);
    setIsAssignModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: Museum['status'] | Account['status']) => {
    switch (status) {
      case 'Active':
        return 'bg-chart-2/10 text-chart-2 border-chart-2/20';
      case 'Pending':
        return 'bg-chart-4/10 text-chart-4 border-chart-4/20';
      case 'Inactive':
        return 'bg-muted text-muted-foreground border-border';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Phê duyệt bảo tàng</h1>
        <p className="text-muted-foreground">Liên kết tài khoản Admin với Bảo tàng để kích hoạt</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Pending Accounts Card */}
        <div className="rounded-xl border border-border bg-card shadow-sm">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-semibold text-card-foreground">
              Tài khoản chờ phê duyệt ({pendingAccounts.length})
            </h2>
            <p className="text-sm text-muted-foreground mt-1">Các tài khoản Admin chưa có bảo tàng</p>
          </div>

          <div className="p-6">
            {accountsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
              </div>
            ) : pendingAccounts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="inline-flex h-12 w-12 rounded-full bg-muted items-center justify-center mb-3">
                  <svg className="h-6 w-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <p className="text-sm font-medium text-foreground">Không có tài khoản chờ duyệt</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingAccounts.map((account) => (
                  <div
                    key={account.id}
                    className="p-4 rounded-lg border border-border bg-background hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-foreground">{account.fullName}</h3>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(account.status)}`}
                          >
                            {account.status}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{account.email}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Vai trò: {account.roleName || 'Chưa có'}
                        </p>
                        <p className="text-xs text-muted-foreground">Tạo ngày: {formatDate(account.createAt)}</p>
                      </div>
                      <button
                        onClick={() => openAssignModal(account)}
                        disabled={pendingMuseums.length === 0}
                        className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all shadow-sm hover:shadow text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Phê duyệt
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Pending Museums Card */}
        <div className="rounded-xl border border-border bg-card shadow-sm">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-semibold text-card-foreground">
              Bảo tàng chờ phê duyệt ({pendingMuseums.length})
            </h2>
            <p className="text-sm text-muted-foreground mt-1">Các bảo tàng chưa được kích hoạt</p>
          </div>

          <div className="p-6">
            {museumsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
              </div>
            ) : pendingMuseums.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="inline-flex h-12 w-12 rounded-full bg-muted items-center justify-center mb-3">
                  <svg
                    className="h-6 w-6 text-muted-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <p className="text-sm font-medium text-foreground">Không có bảo tàng chờ duyệt</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingMuseums.map((museum) => (
                  <div
                    key={museum.id}
                    className="p-4 rounded-lg border border-border bg-background hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-foreground">{museum.name}</h3>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(museum.status)}`}
                          >
                            {museum.status}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{museum.location}</p>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{museum.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">Tạo ngày: {formatDate(museum.createAt)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Assign Modal */}
      <AssignMuseumModal
        isOpen={isAssignModalOpen}
        onClose={() => {
          setIsAssignModalOpen(false);
          setSelectedAccount(null);
        }}
        onSubmit={handleAssign}
        account={selectedAccount}
        museums={pendingMuseums}
        isLoading={assignMutation.isPending}
      />
    </div>
  );
}

