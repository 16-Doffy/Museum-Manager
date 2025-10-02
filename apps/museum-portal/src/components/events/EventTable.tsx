const mockEvents = [
  { id: 1, name: "Triển lãm nghệ thuật hiện đại", date: "2025-11-10" },
  { id: 2, name: "Đêm nhạc cổ điển", date: "2025-12-01" },
];

export default function EventTable() {
  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-emerald-50">
          <tr>
            <th className="p-3 text-emerald-700 font-semibold">Tên sự kiện</th>
            <th className="p-3 text-emerald-700 font-semibold">Ngày</th>
          </tr>
        </thead>
        <tbody>
          {mockEvents.map((e) => (
            <tr key={e.id} className="border-t hover:bg-gray-50">
              <td className="p-3 text-gray-800 font-medium">{e.name}</td>
              <td className="p-3 text-gray-700">{e.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
