import { useState } from 'react';

type User = { id: string; email: string; name: string; role: string };

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([
    { id: '1', email: 'admin@example.com', name: 'Nhựt Duy', role: 'Admin' },
    { id: '2', email: 'user@example.com', name: 'Văn A', role: 'Staff' },
    { id: '3', email: 'user@example.com', name: 'Văn B', role: 'User' },
  ]);
  const [form, setForm] = useState<Omit<User, 'id'>>({ email: '', name: '', role: 'Admin' });
  const [editingId, setEditingId] = useState<string | null>(null);

  const reset = () => setForm({ email: '', name: '', role: 'Admin' });

  const add = () => {
    if (!form.email.trim()) return;
    setUsers((prev) => [...prev, { id: crypto.randomUUID(), ...form }]);
    reset();
  };

  const startEdit = (u: User) => {
    setEditingId(u.id);
    setForm({ email: u.email, name: u.name, role: u.role });
  };

  const save = () => {
    if (!editingId) return;
    setUsers((prev) => prev.map((u) => (u.id === editingId ? { ...u, ...form } : u)));
    setEditingId(null);
    reset();
  };

  const remove = (id: string) => setUsers((prev) => prev.filter((u) => u.id !== id));

  return (
    <main className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Quản lý người dùng</h2>
      <div className="mb-4 rounded-xl border border-gray-200 bg-white p-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <input className="rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="Email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
          <input className="rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="Tên" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          <select className="rounded-lg border border-gray-300 px-3 py-2 text-sm" value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}>
            <option>Admin</option>
            <option>Staff</option>
            <option>User</option>
          </select>
          <div className="flex items-center gap-2">
            {editingId ? (
              <>
                <button onClick={save} className="rounded-lg bg-indigo-600 text-white px-3 py-2 text-sm">Lưu</button>
                <button onClick={() => { setEditingId(null); reset(); }} className="rounded-lg border px-3 py-2 text-sm">Huỷ</button>
              </>
            ) : (
              <button onClick={add} className="rounded-lg bg-emerald-600 text-white px-3 py-2 text-sm">Thêm</button>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Tên</th>
              <th className="px-4 py-3">Vai trò</th>
              <th className="px-4 py-3 w-40 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="px-4 py-3">{u.email}</td>
                <td className="px-4 py-3">{u.name}</td>
                <td className="px-4 py-3">{u.role}</td>
                <td className="px-4 py-3 text-right space-x-3">
                  <button onClick={() => startEdit(u)} className="text-blue-600 hover:underline">Sửa</button>
                  <button onClick={() => remove(u.id)} className="text-red-600 hover:underline">Xoá</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

