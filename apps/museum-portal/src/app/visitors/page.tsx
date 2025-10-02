"use client";

import { Sidebar, Topbar } from '@/components';
import { Button, Card, CardHeader, CardTitle, CardContent } from '@/components/common';
import { StatCard } from '@/components/dashboard';

export default function VisitorsPage() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Topbar />
        
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-emerald-600">Quản lý Khách tham quan</h1>
            <Button>
              Thêm khách tham quan
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <StatCard title="Tổng khách tham quan" value="15,420" />
            <StatCard title="Khách hôm nay" value="1,245" />
            <StatCard title="Khách tuần này" value="8,750" />
            <StatCard title="Khách tháng này" value="32,100" />
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-emerald-600">Danh sách khách tham quan gần đây</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">Bảng danh sách khách tham quan sẽ được hiển thị ở đây...</p>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}

