import { FormEvent, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { apiClient } from '../../lib/api/client';
import { authEndpoints } from '../../lib/api/endpoints';

interface RegisterFormData {
  email: string;
  password: string;
  fullName: string;
  museumName: string;
  museumLocation: string;
  museumDescription: string;
}

export default function RegisterPage() {
  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    password: '',
    fullName: '',
    museumName: '',
    museumLocation: '',
    museumDescription: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (field: keyof RegisterFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await apiClient.post(authEndpoints.register, formData);
      
      if (response.success) {
        toast.success('Đăng ký thành công!', {
          description: 'Tài khoản của bạn đang chờ Admin xác nhận. Vui lòng đợi email thông báo.',
          duration: 5000,
        });
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        throw new Error('Đăng ký thất bại');
      }
    } catch (err: any) {
      let errorMessage = 'Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.';
      
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (err?.statusCode === 400) {
        errorMessage = err.message || 'Thông tin không hợp lệ. Vui lòng kiểm tra lại.';
      } else if (err?.statusCode === 409) {
        errorMessage = 'Email đã được sử dụng. Vui lòng chọn email khác.';
      } else if (err?.message) {
        errorMessage = err.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left panel - form */}
      <div className="relative bg-[#06204e] text-white flex items-center justify-center p-8 overflow-y-auto">
        <div className="max-w-md w-full py-8">
          <div className="mb-8">
            <h1 className="leading-none font-extrabold tracking-tight text-3xl bg-gradient-to-r from-white via-sky-200 to-green-500 inline-block text-transparent bg-clip-text">
              <span className="block text-center">CREATE YOUR</span>
              <span className="block text-center">MUSEUM ACCOUNT</span>
            </h1>
            <p className="text-center text-gray-300 mt-4 text-sm">
              Đăng ký tài khoản bảo tàng mới. Tài khoản cần được Admin xác nhận.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email <span className="text-red-400">*</span>
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange('email')}
                required
                className="w-full px-4 py-3 rounded-md bg-white/10 text-white placeholder-gray-400 border border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                placeholder="you@example.com"
                disabled={isLoading}
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Mật khẩu <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange('password')}
                  required
                  minLength={6}
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

            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-2">
                Họ và tên <span className="text-red-400">*</span>
              </label>
              <input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange('fullName')}
                required
                className="w-full px-4 py-3 rounded-md bg-white/10 text-white placeholder-gray-400 border border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                placeholder="Nguyễn Văn A"
                disabled={isLoading}
              />
            </div>

            {/* Museum Name */}
            <div>
              <label htmlFor="museumName" className="block text-sm font-medium text-gray-300 mb-2">
                Tên bảo tàng <span className="text-red-400">*</span>
              </label>
              <input
                id="museumName"
                type="text"
                value={formData.museumName}
                onChange={handleChange('museumName')}
                required
                className="w-full px-4 py-3 rounded-md bg-white/10 text-white placeholder-gray-400 border border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                placeholder="Bảo tàng Lịch sử Việt Nam"
                disabled={isLoading}
              />
            </div>

            {/* Museum Location */}
            <div>
              <label htmlFor="museumLocation" className="block text-sm font-medium text-gray-300 mb-2">
                Địa chỉ bảo tàng <span className="text-red-400">*</span>
              </label>
              <input
                id="museumLocation"
                type="text"
                value={formData.museumLocation}
                onChange={handleChange('museumLocation')}
                required
                className="w-full px-4 py-3 rounded-md bg-white/10 text-white placeholder-gray-400 border border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                placeholder="123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh"
                disabled={isLoading}
              />
            </div>

            {/* Museum Description */}
            <div>
              <label htmlFor="museumDescription" className="block text-sm font-medium text-gray-300 mb-2">
                Mô tả bảo tàng <span className="text-red-400">*</span>
              </label>
              <textarea
                id="museumDescription"
                value={formData.museumDescription}
                onChange={handleChange('museumDescription')}
                required
                rows={4}
                className="w-full px-4 py-3 rounded-md bg-white/10 text-white placeholder-gray-400 border border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
                placeholder="Mô tả về bảo tàng của bạn..."
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Đang đăng ký...' : 'Đăng ký tài khoản'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-300">
              Đã có tài khoản?{' '}
              <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-medium">
                Đăng nhập ngay
              </Link>
            </p>
          </div>

          <p className="mt-8 text-xs text-gray-400 text-center">
            © 2025 Museum Management System
          </p>
        </div>

        {/* vignette */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-black/30" />
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
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className="max-w-md text-white">
            <h2 className="text-4xl font-bold mb-4">Tạo Bảo tàng Của Bạn</h2>
            <p className="text-lg text-gray-200">
              Đăng ký tài khoản để quản lý bảo tàng của bạn một cách chuyên nghiệp. 
              Hệ thống sẽ giúp bạn quản lý hiện vật, triển lãm và khách tham quan hiệu quả.
            </p>
            <div className="mt-8 flex items-center gap-2 text-sm text-gray-300">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-emerald-500 border-2 border-white"></div>
                <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-white"></div>
                <div className="w-8 h-8 rounded-full bg-purple-500 border-2 border-white"></div>
                <div className="w-8 h-8 rounded-full bg-pink-500 border-2 border-white"></div>
              </div>
              <span>Được tin cậy bởi hơn 100 bảo tàng</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

