const mockCollections = [
  { id: 1, name: "Tượng cổ Ai Cập", year: "2000 TCN", status: "Trưng bày" },
  { id: 2, name: "Bức tranh Mona Lisa", year: "1503", status: "Đang mượn" },
];

export default function CollectionTable() {
  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-emerald-50">
          <tr>
            <th className="p-3 text-emerald-700 font-semibold">Tên hiện vật</th>
            <th className="p-3 text-emerald-700 font-semibold">Năm</th>
            <th className="p-3 text-emerald-700 font-semibold">Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {mockCollections.map((c) => (
            <tr key={c.id} className="border-t hover:bg-gray-50">
              <td className="p-3 text-gray-800 font-medium">{c.name}</td>
              <td className="p-3 text-gray-700">{c.year}</td>
              <td className="p-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  c.status === 'Trưng bày' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {c.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
