"use client";

import { Sidebar, Topbar } from '@/components';
import { Button, Card, CardHeader, CardTitle, CardContent } from '@/components/common';
import { StatCard } from '@/components/dashboard';

export default function TicketsPage() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Topbar />
        
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-emerald-600">Quản lý Vé</h1>
            <Button>
              Tạo vé mới
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <StatCard title="Vé đã bán hôm nay" value="3,520" />
            <StatCard title="Doanh thu hôm nay" value="₫175,000,000" />
            <StatCard title="Vé còn lại" value="1,280" />
            <StatCard title="Tổng doanh thu tháng" value="₫2,450,000,000" />
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-emerald-600">Thống kê bán vé</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">Biểu đồ thống kê bán vé sẽ được hiển thị ở đây...</p>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}

