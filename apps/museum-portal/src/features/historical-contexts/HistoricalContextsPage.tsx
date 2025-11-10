import { useState, useCallback, useEffect } from 'react';
import { HistoricalContextTable } from '../../components/historical-contexts/HistoricalContextTable';
import { useHistoricalContexts } from '../../lib/api/hooks';
import { HistoricalContext } from '../../lib/api/types';
import { BookOpen } from 'lucide-react';

export default function HistoricalContextsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('-');
  const [pageIndex, setPageIndex] = useState(1);
  const pageSize = 10;

  const searchParams = {
    pageIndex,
    pageSize,
    ...(searchTerm && { title: searchTerm }),
    ...(statusFilter && statusFilter !== '-' && { statusFilter: statusFilter as any }),
  };

  const { 
    historicalContexts, 
    loading, 
    error, 
    pagination,
    fetchHistoricalContexts,
    createHistoricalContext,
    updateHistoricalContext,
    deleteHistoricalContext
  } = useHistoricalContexts(searchParams);

  const [displayContexts, setDisplayContexts] = useState<HistoricalContext[]>([]);

  useEffect(() => {
    setDisplayContexts(historicalContexts);
  }, [historicalContexts]);

  const handlePageChange = useCallback((page: number) => {
    setPageIndex(page);
  }, []);

  const handleEdit = useCallback(async (historicalContext: HistoricalContext) => {
    await fetchHistoricalContexts();
  }, [fetchHistoricalContexts]);

  const handleCreate = useCallback(async (data: any) => {
    const created = await createHistoricalContext(data);
    setPageIndex(1);
    setDisplayContexts(prev => {
      const filtered = prev.filter(item => item.id !== created.id);
      return [created, ...filtered];
    });
    await fetchHistoricalContexts();
    return created;
  }, [createHistoricalContext, fetchHistoricalContexts]);

  const handleUpdate = useCallback(async (id: string, data: any) => {
    const updated = await updateHistoricalContext(id, data);
    setDisplayContexts(prev => prev.map(item => item.id === id ? updated : item));
    await fetchHistoricalContexts();
    return updated;
  }, [updateHistoricalContext, fetchHistoricalContexts]);

  const handleDelete = useCallback(async (id: string) => {
    try {
      await deleteHistoricalContext(id);
      setDisplayContexts(prev => prev.filter(item => item.id !== id));
      await fetchHistoricalContexts();
    } catch (error) {
      console.error('Delete historical context error:', error);
    }
  }, [deleteHistoricalContext, fetchHistoricalContexts]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Quản lý Ngữ cảnh Lịch sử</h1>
              <p className="text-gray-500 mt-1">Quản lý các ngữ cảnh lịch sử trong bảo tàng</p>
            </div>
          </div>
        </div>
      </div>

      {/* Historical Contexts Table */}
      <HistoricalContextTable
        historicalContexts={displayContexts}
        loading={loading}
        error={error}
        pagination={{
          pageIndex: pagination.pageIndex,
          pageSize,
          totalItems: pagination.totalItems,
          totalPages: pagination.totalPages,
        }}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onPageChange={handlePageChange}
        onEdit={handleEdit}
        onDelete={handleDelete}
        createHistoricalContext={handleCreate}
        updateHistoricalContext={handleUpdate}
      />
    </div>
  );
}

