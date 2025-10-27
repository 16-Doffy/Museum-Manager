"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
	{ href: "/", label: "Tổng quan" },
	{ href: "/museums", label: "Bảo tàng" },
	{ href: "/roles", label: "Quản lý vai trò" },
	{ href: "/users", label: "Quản lý người dùng" },
	{ href: "/revenue", label: "Doanh số" }
];

export function Sidebar() {
	const pathname = usePathname();

	return (
		<aside className="h-screen sticky top-0 w-[250px] border-r border-gray-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70">
			<div className="px-4 py-6">
				<div className="mb-6">
					<div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center shadow-md">
						<span className="text-white text-lg font-bold">A</span>
					</div>
					<div className="mt-3">
						<h1 className="text-lg font-semibold tracking-tight text-gray-900">Admin Portal</h1>
						<p className="text-xs text-gray-500">Museum Manager</p>
					</div>
				</div>
				<nav className="space-y-1">
					{navItems.map((item) => {
						const active = pathname === item.href;
						return (
							<Link
								key={item.href}
								href={item.href}
								className={`group flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
									active
										? "bg-gray-100 text-gray-900 shadow-sm ring-1 ring-gray-200"
										: "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
								}`}
							>
								<span className={`h-1.5 w-1.5 rounded-full transition-colors ${active ? "bg-indigo-600" : "bg-gray-300 group-hover:bg-gray-400"}`}></span>
								{item.label}
							</Link>
						);
					})}
				</nav>
			</div>
		</aside>
	);
}


