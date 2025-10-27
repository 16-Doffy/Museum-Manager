"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccounts } from "../../lib/hooks/useAccounts";
import { Account, AccountCreateRequest, AccountUpdateRequest } from "../../lib/api/types";
import { AccountService } from "../../lib/api/accountService";
import AccountForm from "../../components/AccountForm";
import { useAuth } from "../../lib/contexts/AuthContext";

export default function UsersPage() {
	const { isAuthenticated, isLoading } = useAuth();
	const router = useRouter();
	const [searchTerm, setSearchTerm] = useState('');
	const [pageIndex, setPageIndex] = useState(1);
	const pageSize = 10;
	const [showForm, setShowForm] = useState(false);
	const [editingAccount, setEditingAccount] = useState<Account | null>(null);
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
		accounts, 
		loading, 
		error, 
		pagination,
		fetchAccounts,
		activateAccount,
		deactivateAccount
	} = useAccounts(searchParams);

	const handleSearch = useCallback((newSearchTerm: string) => {
		setSearchTerm(newSearchTerm);
		setPageIndex(1); // Reset to first page when searching
	}, []);

	const handleCreate = useCallback(() => {
		setEditingAccount(null);
		setShowForm(true);
	}, []);

	const handleEdit = useCallback((id: string) => {
		const account = accounts.find(a => a.id === id);
		if (account) {
			setEditingAccount(account);
			setShowForm(true);
		}
	}, [accounts]);

	const handleActivate = useCallback(async (id: string) => {
		if (confirm('Bạn có chắc chắn muốn kích hoạt tài khoản này?')) {
			try {
				setIsSubmitting(true);
				await activateAccount(id);
				alert('Kích hoạt tài khoản thành công');
			} catch (error) {
				console.error('Activate error:', error);
				alert('Lỗi khi kích hoạt tài khoản');
			} finally {
				setIsSubmitting(false);
			}
		}
	}, [activateAccount]);

	const handleDeactivate = useCallback(async (id: string) => {
		if (confirm('Bạn có chắc chắn muốn vô hiệu hóa tài khoản này?')) {
			try {
				setIsSubmitting(true);
				await deactivateAccount(id);
				alert('Vô hiệu hóa tài khoản thành công');
			} catch (error) {
				console.error('Deactivate error:', error);
				alert('Lỗi khi vô hiệu hóa tài khoản');
			} finally {
				setIsSubmitting(false);
			}
		}
	}, [deactivateAccount]);

	const handleSave = useCallback(async (data: AccountCreateRequest & { roleId: string; museumId: string }) => {
		try {
			setIsSubmitting(true);
			if (editingAccount) {
				await AccountService.update(editingAccount.id, data);
				alert('Cập nhật tài khoản thành công');
			} else {
				await AccountService.create(data.roleId, data.museumId, {
					email: data.email,
					password: data.password,
					fullName: data.fullName,
				});
				alert('Tạo tài khoản mới thành công');
			}
			setShowForm(false);
			setEditingAccount(null);
			// Force refresh data
			await fetchAccounts();
		} catch (error) {
			console.error('Save error:', error);
			alert(error instanceof Error ? error.message : 'Lỗi khi lưu tài khoản');
		} finally {
			setIsSubmitting(false);
		}
	}, [editingAccount, fetchAccounts]);

	const handleCancel = useCallback(() => {
		setShowForm(false);
		setEditingAccount(null);
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
						onClick={() => fetchAccounts()}
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
				<AccountForm
					account={editingAccount || undefined}
					onSave={handleSave}
					onCancel={handleCancel}
					isLoading={isSubmitting}
				/>
			)}
			
			<main className="p-6">
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-2xl font-semibold">Quản lý tài khoản</h2>
					<button 
						onClick={handleCreate}
						className="rounded-lg bg-indigo-600 text-white px-4 py-2 text-sm hover:bg-indigo-700"
					>
						Thêm tài khoản mới
					</button>
				</div>

			{/* Search Bar */}
			<div className="mb-4 rounded-xl border border-gray-200 bg-white p-4">
				<div className="flex items-center space-x-4">
					<div className="flex-1">
						<input
							type="text"
							placeholder="Tìm kiếm tài khoản..."
							className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
							onChange={(e) => handleSearch(e.target.value)}
						/>
					</div>
					<div className="text-sm text-gray-500">
						{pagination.totalItems} tài khoản
					</div>
				</div>
			</div>

			{/* Account Table */}
			<div className="rounded-xl border border-gray-200 bg-white">
				<table className="w-full text-left text-sm">
					<thead className="bg-gray-50 text-gray-600">
						<tr>
							<th className="px-4 py-3">Email</th>
							<th className="px-4 py-3">Họ tên</th>
							<th className="px-4 py-3">Vai trò</th>
							<th className="px-4 py-3">Bảo tàng</th>
							<th className="px-4 py-3">Trạng thái</th>
							<th className="px-4 py-3 w-40 text-right">Hành động</th>
						</tr>
					</thead>
					<tbody>
						{accounts.length === 0 ? (
							<tr>
								<td colSpan={6} className="px-4 py-8 text-center text-gray-500">
									Không có tài khoản nào
								</td>
							</tr>
						) : (
							accounts.map((account) => (
								<tr key={account.id} className="border-t hover:bg-gray-50">
									<td className="px-4 py-3">{account.email}</td>
									<td className="px-4 py-3">{account.fullName}</td>
									<td className="px-4 py-3">{account.roleName}</td>
									<td className="px-4 py-3">{account.museumName || 'N/A'}</td>
									<td className="px-4 py-3">
										<span className={`px-2 py-1 rounded-full text-xs font-medium ${
											account.status === 'Active' 
												? 'bg-green-100 text-green-800' 
												: 'bg-red-100 text-red-800'
										}`}>
											{account.status === 'Active' ? 'Hoạt động' : 'Không hoạt động'}
										</span>
									</td>
									<td className="px-4 py-3 text-right space-x-3">
										<button 
											onClick={() => handleEdit(account.id)} 
											className="text-blue-600 hover:underline"
										>
											Sửa
										</button>
										{account.status === 'Active' ? (
											<button 
												onClick={() => handleDeactivate(account.id)} 
												className="text-orange-600 hover:underline"
											>
												Vô hiệu hóa
											</button>
										) : (
											<button 
												onClick={() => handleActivate(account.id)} 
												className="text-green-600 hover:underline"
											>
												Kích hoạt
											</button>
										)}
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


