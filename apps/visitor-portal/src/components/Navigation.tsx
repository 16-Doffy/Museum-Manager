'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
// Using a custom dropdown instead of NavigationMenu for precise positioning under each trigger
import { Button } from '@museum-manager/ui-core/client';
import { Menu, X, Search, User } from 'lucide-react';
import { cn } from '@museum-manager/ui-core/client';

const navigationItems = [
  {
    title: 'Trang Chủ',
    href: '/',
  },
  {
    title: 'Khu Vực',
    href: '/areas',
  },
  {
    title: 'Thông Tin',
    href: '/about',
    children: [
      { title: 'Giới Thiệu Bảo Tàng', href: '/about/museum' },
      { title: 'Lịch Sử Hình Thành', href: '/about/history' },
      { title: 'Contacts', href: '/about/contacts' },
    ],
  },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <span className="text-white font-bold text-lg">🏛️</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-2xl text-gray-900 group-hover:text-indigo-600 transition-colors">
                Bảo Tàng Lịch Sử
              </span>
              <span className="text-sm text-gray-500 -mt-1">Việt Nam</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {navigationItems.map((item) => (
              <div key={item.title} className="relative group">
                {item.children ? (
                  <>
                    <button
                      className={cn(
                        "px-3 py-2 text-[15px] font-medium text-gray-900 hover:text-emerald-600 transition-colors",
                        "flex items-center gap-2"
                      )}
                    >
                      {item.title}
                      <span className="text-emerald-500 transition-transform group-hover:rotate-180">▾</span>
                    </button>
                    <div
                      className="invisible opacity-0 group-hover:visible group-hover:opacity-100 absolute left-0 top-full mt-2 w-64 rounded-xl border border-emerald-500/30 ring-1 ring-emerald-500/15 bg-white text-gray-900 shadow-2xl transition-all duration-150"
                    >
                      <ul className="py-2">
                        {item.children.map((child) => (
                          <li key={child.title}>
                            <Link
                              href={child.href}
                              className={cn(
                                "block px-5 py-3 text-sm font-semibold border-l-2 border-transparent",
                                "hover:border-emerald-500 hover:text-emerald-700 hover:bg-emerald-50",
                                pathname === child.href && "border-emerald-500 bg-emerald-50 text-emerald-700"
                              )}
                            >
                              {child.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      "px-3 py-2 text-[15px] font-medium rounded-md hover:bg-gray-100",
                      pathname === item.href && "bg-gray-100 text-gray-900"
                    )}
                  >
                    {item.title}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* Search Button */}
            <Button variant="ghost" size="icon" className="hidden sm:flex h-12 w-12 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-300">
              <Search className="h-5 w-5" />
            </Button>

            {/* User Menu */}
            <Button variant="ghost" size="icon" className="hidden sm:flex h-12 w-12 rounded-xl hover:bg-pink-50 hover:text-pink-600 transition-all duration-300">
              <User className="h-5 w-5" />
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-12 w-12 rounded-xl hover:bg-gray-100 transition-all duration-300"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden border-t">
            <div className="py-4 space-y-2">
              {navigationItems.map((item) => (
                <div key={item.title}>
                  <Link
                    href={item.href}
                    className={cn(
                      "block px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      pathname === item.href
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.title}
                  </Link>
                  {item.children && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.title}
                          href={child.href}
                          className={cn(
                            "block px-3 py-2 rounded-md text-sm transition-colors",
                            pathname === child.href
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                          )}
                          onClick={() => setIsOpen(false)}
                        >
                          {child.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

