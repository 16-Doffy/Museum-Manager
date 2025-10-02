"use client";

import { Sidebar, Topbar, EventTable, EventList } from '@/components';
import { Button } from '@/components/common';

export default function EventsPage() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Topbar />
        
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-emerald-600">Quản lý Sự kiện</h1>
            <Button>
              Tạo sự kiện mới
            </Button>
          </div>
          
          <div className="bg-white rounded-lg shadow">
            <EventTable />
          </div>
        </main>
      </div>
    </div>
  );
}

