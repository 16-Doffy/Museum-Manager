type Props = {
  title: string;
  value: string | number;
};

export default function StatCard({ title, value }: Props) {
  return (
    <div className="bg-white rounded-xl shadow p-6 text-center">
      <p className="text-gray-700 text-sm font-medium">{title}</p>
      <h3 className="text-2xl font-bold mt-2 text-emerald-600">{value}</h3>
    </div>
  );
}
