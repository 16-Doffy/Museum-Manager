'use client';

import { useState } from 'react';
import { useDisplayPositions } from '../../lib/hooks/useDisplayPositions';
import { DisplayPositionTable } from '../../components/display-positions/DisplayPositionTable';
import { Sidebar, Topbar } from '@/components';
import NavigationButtons from '@/components/common/NavigationButtons';

export default function DisplayPositionsPage() {
  const {
    displayPositions,
    loading,
    error,
    pagination,
    searchTerm,
    setSearchTerm,
    areaName,
    setAreaName,
    includeDeleted,
    setIncludeDeleted,
    createDisplayPosition,
    updateDisplayPosition,
    deleteDisplayPosition,
    activateDisplayPosition,
    setPageIndex,
  } = useDisplayPositions();

  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleCreate = async () => {
    setShowCreateForm(true);
  };

  const handleEdit = async (position: any) => {
    // Edit logic will be handled in DisplayPositionTable
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDisplayPosition(id);
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const handleActivate = async (id: string) => {
    try {
      await activateDisplayPosition(id);
    } catch (error) {
      console.error('Activate error:', error);
    }
  };

  const handleSave = async (data: any) => {
    try {
      if (data.id) {
        await updateDisplayPosition(data.id, data);
      } else {
        await createDisplayPosition(data);
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
          currentPage="Quản lý Vị trí Trưng bày"
          nextPage="/visitors"
          nextPageTitle="Khách tham quan"
        />
        
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Quản lý Vị trí Trưng bày</h1>
            <p className="text-gray-600 mt-1">
              Quản lý các vị trí trưng bày hiện vật trong bảo tàng
            </p>
          </div>

          <div className="bg-white rounded-lg shadow">
            <DisplayPositionTable
              displayPositions={displayPositions}
              loading={loading}
              error={error}
              pagination={pagination}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              areaName={areaName}
              setAreaName={setAreaName}
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
