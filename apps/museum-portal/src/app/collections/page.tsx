"use client";

import { Sidebar, Topbar, CollectionTable, CollectionList } from '@/components';
import { Button } from '@/components/common';

export default function CollectionsPage() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Topbar />
        
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-emerald-600">Quản lý Bộ sưu tập</h1>
            <Button>
              Thêm hiện vật mới
            </Button>
          </div>
          
          <div className="bg-white rounded-lg shadow">
            <CollectionTable />
          </div>
        </main>
      </div>
    </div>
  );
}

