'use client';

import { useState, useMemo, useCallback } from 'react';
import { useAreas } from '../../lib/api/hooks';
import { AreaTable } from '../../components/areas/AreaTable';
import { Sidebar, Topbar } from '@/components';
import NavigationButtons from '@/components/common/NavigationButtons';
import { useDebounce } from '../../lib/hooks/useDebounce';

export default function AreasPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [pageIndex, setPageIndex] = useState(1);
  const [includeDeleted, setIncludeDeleted] = useState(false);
  const pageSize = 10;
  
  // Debounce search term to avoid too many API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  const searchParams = useMemo(() => ({
    pageIndex,
    pageSize,
    search: debouncedSearchTerm,
    includeDeleted,
  }), [pageIndex, pageSize, debouncedSearchTerm, includeDeleted]);

  const {
    areas,
    loading,
    error,
    pagination,
    createArea,
    updateArea,
    deleteArea,
  } = useAreas(searchParams);

  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleCreate = async () => {
    setShowCreateForm(true);
  };

  const handleEdit = async (area: any) => {
    // Edit logic will be handled in AreaTable
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteArea(id);
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const handleActivate = async (id: string) => {
    try {
      // Activate logic - you may need to implement this in the hook
      console.log('Activate area:', id);
    } catch (error) {
      console.error('Activate error:', error);
    }
  };

  const handleSave = async (data: any) => {
    try {
      if (data.id) {
        await updateArea(data.id, data);
      } else {
        await createArea(data);
      }
      setShowCreateForm(false);
    } catch (error) {
      console.error('Save error:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Topbar />
        
        <NavigationButtons 
          currentPage="Quản lý Khu vực"
          nextPage="/display-positions"
          nextPageTitle="Vị trí trưng bày"
        />
        
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Quản lý Khu vực</h1>
            <p className="text-gray-600 mt-1">
              Quản lý các khu vực trưng bày trong bảo tàng
            </p>
          </div>

          <div className="bg-white rounded-lg shadow">
            <AreaTable
              areas={areas}
              loading={loading}
              error={error}
              pagination={pagination}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              includeDeleted={includeDeleted}
              setIncludeDeleted={setIncludeDeleted}
              onPageChange={setPageIndex}
              onCreate={handleCreate}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onActivate={handleActivate}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
