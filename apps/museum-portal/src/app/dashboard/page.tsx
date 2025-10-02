"use client";

import { Sidebar, Topbar, StatCard, TicketChart, CollectionTable, EventTable } from '@/components';

export default function DashboardPage() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Topbar />
        
        <main className="flex-1 p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard title="Khách tham quan hôm nay" value="1,245" />
            <StatCard title="Vé đã bán" value="3,520" />
            <StatCard title="Sự kiện đang diễn ra" value="5" />
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-emerald-600 mb-4">Thông tin Bảo tàng</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-lg text-black">Tên bảo tàng</p>
                <p className="font-medium text-gray-600">Bảo tàng Lịch sử Việt Nam</p>
              </div>
              <div>
                <p className="text-lg text-black">Địa chỉ</p>
                <p className="font-medium text-gray-600">1 Tràng Tiền, Hoàn Kiếm, Hà Nội</p>
              </div>
              <div>
                <p className="text-lg text-black">Giờ mở cửa</p>
                <p className="font-medium text-gray-600">8:00 - 17:00 (Thứ 2 - Chủ nhật)</p>
              </div>
              <div>
                <p className="text-lg text-black">Tổng hiện vật</p>
                <p className="font-medium text-gray-600">15,420 hiện vật</p>
              </div>
            </div>
          </div>

          <TicketChart />

          <section>
            <h2 className="text-xl font-bold text-emerald-600 mb-2">Bộ sưu tập của bảo tàng</h2>
            <CollectionTable />
          </section>

          <section>
            <h2 className="text-xl font-bold text-emerald-600 mb-2">Sự kiện sắp tới</h2>
            <EventTable />
          </section>
        </main>
      </div>
    </div>
  );
}

