import { RevenueChart } from './revenue/RevenueChart';

export default function Home() {
  const monthlyRevenue = [
    120_000_000, 180_500_000, 150_200_000, 220_300_000,
    170_100_000, 280_900_000, 250_600_000, 330_400_000,
    270_800_000, 300_000_000, 310_200_000, 400_000_000
  ];
  const now = new Date();
  const currentMonthIdx = now.getMonth(); // 0-11
  const currentMonthRevenue = monthlyRevenue[currentMonthIdx];
  const fmtVND = (n: number) => n.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  return (
    <main className="p-6 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <h2 className="text-2xl font-semibold mb-6">Tổng quan</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-sm text-gray-500">Tổng số bảo tàng</div>
          <div className="mt-2 text-2xl font-bold">10</div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-sm text-gray-500">Doanh số tháng {currentMonthIdx + 1}</div>
          <div className="mt-2 text-2xl font-bold">{fmtVND(currentMonthRevenue)}</div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-sm text-gray-500">Người dùng</div>
          <div className="mt-2 text-2xl font-bold">1,248</div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-sm text-gray-500">Vai trò</div>
          <div className="mt-2 text-2xl font-bold">6</div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 min-h-[220px] shadow-sm lg:col-span-2">
          <div className="font-semibold mb-2">Biểu đồ doanh số</div>
          <RevenueChart data={monthlyRevenue} />
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 min-h-[220px] shadow-sm lg:col-span-1">
          <div className="font-semibold">Hoạt động gần đây</div>
          <ul className="mt-3 space-y-2 text-sm text-gray-700">
            <li>+ Thêm bảo tàng mới "Bảo tàng A"</li>
            <li>* Cập nhật quyền cho vai trò "Quản trị viên"</li>
            <li>- Xoá người dùng test@example.com</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
