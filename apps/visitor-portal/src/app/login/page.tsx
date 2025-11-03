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
    <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
      {/* Left: Museum visual */}
      <div className="relative hidden lg:block">
        <div className="relative h-[520px] w-full overflow-hidden rounded-3xl shadow-xl">
          <img
            src="https://old3.commonsupport.com/wp/muzex/wp-content/uploads/2020/05/2.jpg"
            alt="Museum hero"
            className="h-full w-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(90deg, rgba(242,128,118,0.55) 0%, rgba(255,182,175,0.55) 20%, rgba(250,224,199,0.55) 45%, rgba(251,193,147,0.55) 70%, rgba(78,176,155,0.55) 100%)',
            }}
          />
          <div className="absolute inset-0 flex items-end p-8">
            <div className="text-white drop-shadow max-w-xl">
              <div className="uppercase tracking-wide text-sm mb-2 opacity-95">Vietnam Museum System</div>
              <h2 className="text-4xl font-extrabold leading-tight">
                Khám phá kho tàng di sản và hiện vật quốc gia
              </h2>
              <p className="mt-3 text-sm opacity-90">Đăng nhập để bắt đầu hành trình tham quan số của bạn.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Login card */}
      <div className="w-full max-w-md mx-auto">
        <div className="mb-6 text-center lg:text-left">
          <h1 className="text-3xl font-extrabold">Đăng nhập</h1>
          <p className="text-sm text-neutral-600 mt-1">Truy cập hệ thống bảo tàng Việt Nam</p>
        </div>
        <Card style={{ background: '#ede7dd' }}>
          <CardHeader>
            <CardTitle className="text-base text-neutral-700">Nhập thông tin tài khoản của bạn</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium">Tên đăng nhập</label>
                <Input placeholder="ví dụ: nguyenvana" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Mật khẩu</label>
                <div className="relative">
                  <Input type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
                  <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-2 top-1/2 -translate-y-1/2 text-xs underline">
                    {showPassword ? 'Ẩn' : 'Hiện'}
                  </button>
                </div>
              </div>
              {error ? <div className="text-sm text-red-600">{error}</div> : null}
              <Button type="submit" className="w-full" style={{ background: '#4EB09B' }} disabled={isLoading}>
                {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </Button>
              <div className="text-center text-sm">
                Chưa có tài khoản?
                {' '}
                <Link href="/register" className="underline">Đăng ký</Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


