"use client";

import { Sidebar, Topbar } from '@/components';
import { Button, Card, CardHeader, CardTitle, CardContent } from '@/components/common';

export default function ReportsPage() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Topbar />
        
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-emerald-600">Báo cáo & Thống kê</h1>
            <Button>
              Tạo báo cáo mới
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-emerald-600">Báo cáo Doanh thu</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">Báo cáo doanh thu chi tiết theo ngày, tuần, tháng...</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-emerald-600">Báo cáo Khách tham quan</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">Thống kê số lượng khách tham quan và xu hướng...</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-emerald-600">Báo cáo Sự kiện</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">Hiệu quả và tác động của các sự kiện...</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-emerald-600">Báo cáo Bộ sưu tập</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">Thống kê về các bộ sưu tập và mức độ quan tâm...</p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}

