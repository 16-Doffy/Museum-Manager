"use client";

import { useState } from "react";

type Museum = { id: string; name: string; city: string; status: string };

export default function MuseumsPage() {
	const [museums, setMuseums] = useState<Museum[]>([
		{ id: "1", name: "Bảo tàng Lịch sử", city: "Hà Nội", status: "Đang mở" },
		{ id: "2", name: "Bảo tàng Mỹ thuật", city: "TP.HCM", status: "Đang mở" },
		{ id: "3", name: "Bảo tàng Chiến Tranh", city: "TP.HCM", status: "Đang mở" }
	]);
	const [form, setForm] = useState<Omit<Museum, "id">>({ name: "", city: "", status: "Đang mở" });
	const [editingId, setEditingId] = useState<string | null>(null);

	const resetForm = () => setForm({ name: "", city: "", status: "Đang mở" });

	const onAdd = () => {
		if (!form.name.trim()) return;
		setMuseums((prev) => [...prev, { id: crypto.randomUUID(), ...form }]);
		resetForm();
	};

	const onStartEdit = (m: Museum) => {
		setEditingId(m.id);
		setForm({ name: m.name, city: m.city, status: m.status });
	};

	const onSave = () => {
		if (!editingId) return;
		setMuseums((prev) => prev.map((m) => (m.id === editingId ? { ...m, ...form } : m)));
		setEditingId(null);
		resetForm();
	};

	const onDelete = (id: string) => setMuseums((prev) => prev.filter((m) => m.id !== id));

	return (
		<main className="p-6">
			<h2 className="text-2xl font-semibold mb-6">Danh sách bảo tàng</h2>
			<div className="mb-4 rounded-xl border border-gray-200 bg-white p-4">
				<div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
					<input
						className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
						placeholder="Tên bảo tàng"
						value={form.name}
						onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
					/>
					<input
						className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
						placeholder="Thành phố/ Tỉnh"
						value={form.city}
						onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
					/>
					<select
						className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
						value={form.status}
						onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
					>
						<option>Đang mở</option>
						<option>Tạm đóng</option>
					</select>
					<div className="flex items-center gap-2">
						{editingId ? (
							<>
								<button onClick={onSave} className="rounded-lg bg-indigo-600 text-white px-3 py-2 text-sm">Lưu</button>
								<button onClick={() => { setEditingId(null); resetForm(); }} className="rounded-lg border px-3 py-2 text-sm">Huỷ</button>
							</>
						) : (
							<button onClick={onAdd} className="rounded-lg bg-emerald-600 text-white px-3 py-2 text-sm">Thêm</button>
						)}
					</div>
				</div>
			</div>

			<div className="rounded-xl border border-gray-200 bg-white">
				<table className="w-full text-left text-sm">
					<thead className="bg-gray-50 text-gray-600">
						<tr>
							<th className="px-4 py-3">Tên</th>
							<th className="px-4 py-3">Thành phố/ Tỉnh</th>
							<th className="px-4 py-3">Trạng thái</th>
							<th className="px-4 py-3 w-40 text-right">Hành động</th>
						</tr>
					</thead>
					<tbody>
						{museums.map((m) => (
							<tr key={m.id} className="border-t">
								<td className="px-4 py-3">{m.name}</td>
								<td className="px-4 py-3">{m.city}</td>
								<td className="px-4 py-3">{m.status}</td>
								<td className="px-4 py-3 text-right space-x-3">
									<button onClick={() => onStartEdit(m)} className="text-blue-600 hover:underline">Sửa</button>
									<button onClick={() => onDelete(m.id)} className="text-red-600 hover:underline">Xoá</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</main>
	);
}


