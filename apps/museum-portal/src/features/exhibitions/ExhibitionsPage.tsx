import { useState, useCallback } from 'react';
import { ExhibitionTable } from '../../components/exhibitions/ExhibitionTable';
import { useExhibitions } from '../../lib/api/hooks';
import { Exhibition } from '../../lib/api/types';
import { Calendar } from 'lucide-react';

export default function ExhibitionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('-');
  const [pageIndex, setPageIndex] = useState(1);
  const pageSize = 10;

  const searchParams = {
    pageIndex,
    pageSize,
    ...(searchTerm && { name: searchTerm }),
    ...(statusFilter && statusFilter !== '-' && { statusFilter: statusFilter as any }),
  };

  const { 
    exhibitions, 
    loading, 
    error, 
    pagination,
    fetchExhibitions,
    createExhibition,
    updateExhibition,
    deleteExhibition
  } = useExhibitions(searchParams);

  const handlePageChange = useCallback((page: number) => {
    setPageIndex(page);
  }, []);

  const handleEdit = useCallback(async (exhibition: Exhibition) => {
    await fetchExhibitions();
  }, [fetchExhibitions]);

  const handleDelete = useCallback(async (id: string) => {
    try {
      await deleteExhibition(id);
    } catch (error) {
      console.error('Delete exhibition error:', error);
    }
  }, [deleteExhibition]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Quản lý Triển lãm</h1>
              <p className="text-gray-500 mt-1">Quản lý các triển lãm trong bảo tàng</p>
            </div>
          </div>
        </div>
      </div>

      {/* Exhibitions Table */}
      <ExhibitionTable
        exhibitions={exhibitions}
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
        createExhibition={createExhibition}
        updateExhibition={updateExhibition}
      />
    </div>
  );
}

