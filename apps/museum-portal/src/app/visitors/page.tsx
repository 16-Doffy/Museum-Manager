"use client";

import { useState } from 'react';
import { Sidebar, Topbar } from '@/components';
import { Button } from '@/components/common';
import { VisitorTable } from '@/components/visitors';
import NavigationButtons from '@/components/common/NavigationButtons';

export default function VisitorsPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleCreate = () => {
    setShowCreateForm(true);
  };

  const handleEdit = (id: string) => {
    // This will be handled by VisitorTable
  };

  const handleDelete = (id: string) => {
    // This will be handled by VisitorTable
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Topbar />
        
        <NavigationButtons
          currentPage="Quản lý Khách tham quan"
          nextPage="/events"
          nextPageTitle="Sự kiện"
        />
        
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-emerald-600">Quản lý Khách tham quan</h1>
            <Button 
              onClick={handleCreate}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Thêm khách tham quan
            </Button>
          </div>
          
          <div className="bg-white rounded-lg shadow">
            <VisitorTable
              onCreate={handleCreate}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

