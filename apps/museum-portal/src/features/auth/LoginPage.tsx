import { FormEvent, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuthStore } from '../../stores/auth-store';
import { FiEye, FiEyeOff } from 'react-icons/fi';
export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      toast.success('Đăng nhập thành công!');
      navigate('/dashboard');
    } catch (err: any) {
      let errorMessage = 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.';
      
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (err?.statusCode === 502) {
        errorMessage = err.message || 'Máy chủ không phản hồi. Vui lòng thử lại sau.';
      } else if (err?.message) {
        errorMessage = err.message;
      }
      
     
      const errorLines = errorMessage.split('\n');
      if (errorLines.length > 1) {
        toast.error(errorLines[0], {
          description: errorLines.slice(1).join('\n'),
          duration: 5000,
        });
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left panel - content */}
      <div className="relative bg-[#06204e] text-white flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <div className="mb-10">
            {/* <div className="w-14 h-14 rounded-xl bg-gray-500/20 flex items-center justify-center ">
             <Landmark className="w-10 h-12 text-white " />
            </div> */}
            <h1 className="leading-none font-extrabold tracking-tight text-3xl bg-linear-to-r from-white via-sky-200 to-green-500 inline-block text-transparent bg-clip-text">
              <span className="block text-center"> WELCOME TO THE MUSEUM</span>
              <span className="block text-center ">WORLD OF ART</span>
              <span className="block text-center">AND</span>
              <span className="block text-center">HISTORY</span>
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Enter your email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-md bg-white/10 text-white placeholder-gray-400 border border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                placeholder="you@example.com"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Enter your password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 pr-12 rounded-md bg-white/10 text-white placeholder-gray-400 border border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white"
                  disabled={isLoading}
                >
                  {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-md bg-black/10 hover:bg-blue-600 text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-300">
              Chưa có tài khoản?{' '}
              <Link to="/register" className="text-emerald-400 hover:text-emerald-300 font-medium">
                Đăng ký ngay
              </Link>
            </p>
          </div>
          <p className="mt-10 text-xs text-gray-400">
            © 2025 Museum Management System
          </p>
        </div>

        {/* vignette */}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-black/40 via-transparent to-black/30" />
      </div>

      {/* Right panel - image */}
      <div
        className="hidden lg:block relative bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://www.islands.com/img/gallery/a-bustling-yet-underrated-connecticut-city-is-home-to-americas-oldest-public-art-museum/l-intro-1733933490.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/25" />
      </div>
    </div>
  );
}
