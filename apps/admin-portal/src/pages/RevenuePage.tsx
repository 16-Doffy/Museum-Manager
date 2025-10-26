import { RevenueChart } from '../components/RevenueChart';

export function RevenuePage() {
  const monthlyRevenue = [
    120_000_000, 180_500_000, 150_200_000, 220_300_000,
    170_100_000, 280_900_000, 250_600_000, 330_400_000,
    270_800_000, 300_000_000, 310_200_000, 400_000_000
  ];

  return (
    <main className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Doanh số</h2>
      <div className="rounded-xl border border-gray-200 bg-white p-4 min-h-[320px]">
        <div className="font-semibold mb-2">Tổng quan doanh số</div>
        <RevenueChart data={monthlyRevenue} />
      </div>
    </main>
  );
}

