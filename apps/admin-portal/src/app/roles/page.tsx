"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRoles } from "../../lib/hooks/useRoles";
import { Role, RoleCreateRequest, RoleUpdateRequest } from "../../lib/api/types";
import { RoleService } from "../../lib/api/roleService";
import RoleForm from "../../components/RoleForm";
import { useAuth } from "../../lib/contexts/AuthContext";

export default function RolesPage() {
	const { isAuthenticated, isLoading } = useAuth();
	const router = useRouter();
	const [searchTerm, setSearchTerm] = useState('');
	const [pageIndex, setPageIndex] = useState(1);
	const pageSize = 10;
	const [showForm, setShowForm] = useState(false);
	const [editingRole, setEditingRole] = useState<Role | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		if (!isLoading && !isAuthenticated) {
			router.push('/login');
		}
	}, [isAuthenticated, isLoading, router]);
	
	const searchParams = useMemo(() => ({
		pageIndex,
		pageSize,
		search: searchTerm,
	}), [pageIndex, pageSize, searchTerm]);

	const { 
		roles, 
		loading, 
		error, 
		pagination,
		fetchRoles 
	} = useRoles(isAuthenticated ? searchParams : undefined);

	const handleSearch = useCallback((newSearchTerm: string) => {
		setSearchTerm(newSearchTerm);
		setPageIndex(1); // Reset to first page when searching
	}, []);

	const handleCreate = useCallback(() => {
		setEditingRole(null);
		setShowForm(true);
	}, []);

	const handleEdit = useCallback((id: string) => {
		const role = roles.find(r => r.id === id);
		if (role) {
			setEditingRole(role);
			setShowForm(true);
		}
	}, [roles]);

	const handleDelete = useCallback(async (id: string) => {
		if (confirm('Bạn có chắc chắn muốn xóa vai trò này?')) {
			try {
				setIsSubmitting(true);
				await RoleService.delete(id);
				fetchRoles(); // Refresh list
				alert('Xóa vai trò thành công');
			} catch (error) {
				console.error('Delete error:', error);
				alert('Lỗi khi xóa vai trò');
			} finally {
				setIsSubmitting(false);
			}
		}
	}, [fetchRoles]);

	const handleSave = useCallback(async (data: RoleCreateRequest | RoleUpdateRequest) => {
		try {
			setIsSubmitting(true);
			if (editingRole) {
				await RoleService.update(editingRole.id, data as RoleUpdateRequest);
				alert('Cập nhật vai trò thành công');
			} else {
				await RoleService.create(data as RoleCreateRequest);
				alert('Tạo vai trò mới thành công');
			}
			setShowForm(false);
			setEditingRole(null);
			fetchRoles(); // Refresh list
		} catch (error) {
			console.error('Save error:', error);
			alert('Lỗi khi lưu vai trò');
		} finally {
			setIsSubmitting(false);
		}
	}, [editingRole, fetchRoles]);

	const handleCancel = useCallback(() => {
		setShowForm(false);
		setEditingRole(null);
	}, []);

	if (isLoading || loading) {
		return (
			<main className="p-6">
				<div className="flex items-center justify-center h-64">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
					<span className="ml-2 text-gray-600">Đang tải dữ liệu...</span>
				</div>
			</main>
		);
	}

	if (!isAuthenticated) {
		return null;
	}

	if (error) {
		return (
			<main className="p-6">
				<div className="text-center text-red-600">
					<p>Lỗi: {error}</p>
					<button 
						onClick={() => fetchRoles()}
						className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
					>
						Thử lại
					</button>
				</div>
			</main>
		);
	}

	return (
		<>
			{showForm && (
				<RoleForm
					role={editingRole || undefined}
					onSave={handleSave}
					onCancel={handleCancel}
					isLoading={isSubmitting}
				/>
			)}
			
			<main className="p-6">
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-2xl font-semibold">Quản lý vai trò</h2>
					<button 
						onClick={handleCreate}
						className="rounded-lg bg-indigo-600 text-white px-4 py-2 text-sm hover:bg-indigo-700"
					>
						Thêm vai trò mới
					</button>
				</div>

				{/* Search Bar */}
				<div className="mb-4 rounded-xl border border-gray-200 bg-white p-4">
					<div className="flex items-center space-x-4">
						<div className="flex-1">
							<input
								type="text"
								placeholder="Tìm kiếm vai trò..."
								className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
								onChange={(e) => handleSearch(e.target.value)}
							/>
						</div>
						<div className="text-sm text-gray-500">
							{pagination.totalItems} vai trò
						</div>
					</div>
				</div>

				{/* Roles Table */}
				<div className="rounded-xl border border-gray-200 bg-white">
					<table className="w-full text-left text-sm">
						<thead className="bg-gray-50 text-gray-600">
							<tr>
								<th className="px-4 py-3">Tên vai trò</th>
								<th className="px-4 py-3">Mô tả</th>
								<th className="px-4 py-3">Trạng thái</th>
								<th className="px-4 py-3">Ngày tạo</th>
								<th className="px-4 py-3 w-40 text-right">Hành động</th>
							</tr>
						</thead>
						<tbody>
							{roles.length === 0 ? (
								<tr>
									<td colSpan={5} className="px-4 py-8 text-center text-gray-500">
										Không có vai trò nào
									</td>
								</tr>
							) : (
								roles.map((role) => (
									<tr key={role.id} className="border-t hover:bg-gray-50">
										<td className="px-4 py-3 font-medium">{role.name}</td>
										<td className="px-4 py-3 text-gray-600">{role.description || 'N/A'}</td>
										<td className="px-4 py-3">
											<span className={`px-2 py-1 rounded-full text-xs font-medium ${
												role.isActive 
													? 'bg-green-100 text-green-800' 
													: 'bg-red-100 text-red-800'
											}`}>
												{role.isActive ? 'Hoạt động' : 'Không hoạt động'}
											</span>
										</td>
										<td className="px-4 py-3 text-gray-600">
											{new Date(role.createdAt).toLocaleDateString('vi-VN')}
										</td>
										<td className="px-4 py-3 text-right space-x-3">
											<button 
												onClick={() => handleEdit(role.id)} 
												className="text-blue-600 hover:underline"
											>
												Sửa
											</button>
											<button 
												onClick={() => handleDelete(role.id)} 
												className="text-red-600 hover:underline"
											>
												Xoá
											</button>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>

				{/* Pagination */}
				{pagination.totalPages > 1 && (
					<div className="mt-4 flex items-center justify-between">
						<div className="text-sm text-gray-500">
							Trang {pagination.pageIndex} / {pagination.totalPages}
						</div>
						<div className="flex space-x-2">
							<button
								disabled={pagination.pageIndex === 1}
								onClick={() => setPageIndex(prev => prev - 1)}
								className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
							>
								Trước
							</button>
							<button
								disabled={pagination.pageIndex === pagination.totalPages}
								onClick={() => setPageIndex(prev => prev + 1)}
								className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
							>
								Sau
							</button>
						</div>
					</div>
				)}
			</main>
		</>
	);
}
