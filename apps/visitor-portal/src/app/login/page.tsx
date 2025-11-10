'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@museum-manager/ui-core/card';
import { Button } from '@museum-manager/ui-core/button';
import { Input } from '@museum-manager/ui-core/input';
import { visitorLogin, setToken, getToken } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const session = typeof window !== 'undefined' ? localStorage.getItem('vp_session_user') : null;
    const token = getToken();
    if (session && token) {
      router.replace('/select-museum');
    }
  }, [router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!username || !password) {
      setError('Vui lòng nhập tên đăng nhập và mật khẩu');
      return;
    }
    try {
      setIsLoading(true);
      const res = await visitorLogin({ username, password });
      setToken(res.token);
      localStorage.setItem('vp_session_user', JSON.stringify({ username }));
      router.replace('/select-museum');
    } catch (err: any) {
      setError(err?.message || 'Đăng nhập thất bại');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full h-screen grid grid-cols-1 lg:grid-cols-[35%_65%] overflow-hidden fixed inset-0">
      {/* Left: Login Form - Dark Gray */}
      <div className="bg-neutral-800 flex items-center justify-center p-6 lg:p-8 overflow-y-auto">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-6 uppercase tracking-tight">
            Bước vào thế giới nghệ thuật và lịch sử
          </h1>
          
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <Input 
                placeholder="Nhập tên đăng nhập" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                autoComplete="username"
                className="bg-neutral-800 border-2 border-white/20 text-white placeholder:text-white/50 focus:border-white h-10 text-sm"
              />
            </div>
            
            <div className="relative">
              <Input 
                type={showPassword ? 'text' : 'password'} 
                placeholder="Nhập mật khẩu" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                autoComplete="current-password"
                className="bg-neutral-800 border-2 border-white/20 text-white placeholder:text-white/50 focus:border-white h-10 text-sm pr-16"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword((v) => !v)} 
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-white/70 hover:text-white underline"
              >
                {showPassword ? 'Ẩn' : 'Hiện'}
              </button>
            </div>

            {error ? (
              <div className="text-xs text-red-400 bg-red-900/20 p-2 rounded">{error}</div>
            ) : null}

            <Button 
              type="submit" 
              className="w-full bg-neutral-800 border-2 border-white text-white hover:bg-neutral-700 h-10 text-sm font-medium" 
              disabled={isLoading}
            >
              {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </Button>

            <div className="text-center text-xs text-white/70">
              Chưa có tài khoản?{' '}
              <Link href="/register" className="text-white underline hover:text-white/80">
                Đăng ký
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Right: Museum Image */}
      <div className="relative hidden lg:block overflow-hidden">
        <img
          src="https://cdn.britannica.com/51/194651-050-747F0C18/Interior-National-Gallery-of-Art-Washington-DC.jpg"
          alt="Museum gallery"
          className="h-full w-full object-cover"
          style={{ objectFit: 'cover', maxHeight: '100vh' }}
        />
      </div>
    </div>
  );
}


