'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@museum-manager/ui-core/button';
import { visitorMe, setToken, getToken } from '@/lib/api';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<{ username?: string } | null>(null);
  const isAuthPage = pathname === '/login' || pathname === '/register';

  useEffect(() => {
    // Skip auth checks on login/register pages to keep hook order stable
    if (isAuthPage) return;

    const token = getToken();
    if (!token) {
      // Redirect to login if no token
      router.replace('/login');
      return;
    }

    // Load user info
    const loadUser = async () => {
      try {
        const session = typeof window !== 'undefined' ? localStorage.getItem('vp_session_user') : null;
        if (session) {
          try {
            const parsed = JSON.parse(session);
            setCurrentUser(parsed);
          } catch {}
        }
        // Also try to get from API
        const me = await visitorMe();
        if (me && (me.username || me.email)) {
          setCurrentUser({ username: me.username || me.email || 'visitor' });
        }
      } catch (e) {
        // If API fails, keep session data if available
      }
    };
    loadUser();
  }, [router, isAuthPage]);

  function logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('vp_session_user');
      setToken(null);
    }
    router.replace('/login');
  }

  if (isAuthPage) return null;

  return (
    <header className="w-full border-b border-neutral-700 sticky top-0 z-40" style={{ background: '#2C2C2C' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <Link href="/select-museum" className="font-semibold text-lg text-white hover:text-white/80 transition-colors">
              Bảo tàng Việt Nam
            </Link>
            <nav className="hidden md:flex items-center gap-4">
              <Link 
                href="/select-museum" 
                className={`text-sm text-neutral-300 hover:text-white transition-colors ${pathname === '/select-museum' ? 'text-white font-medium' : ''}`}
              >
                Bảo tàng
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-neutral-300">
              Xin chào, <span className="font-semibold text-white">{currentUser?.username || 'Người dùng'}</span>
            </span>
            <Button variant="outline" onClick={logout} className="h-9 border-neutral-600 text-white hover:bg-neutral-700">
              Đăng xuất
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

