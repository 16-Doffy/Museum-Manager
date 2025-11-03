import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuthStore } from '../../stores/auth-store';
import { FiEye, FiEyeOff, FiArchive } from 'react-icons/fi';

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
      
      // Show error with line breaks if needed
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiArchive className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Museum Portal
          </h1>
          <p className="text-gray-600">
            Hệ thống quản lý bảo tàng
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Đăng nhập
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                placeholder="Nhập email của bạn"
                disabled={isLoading}
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                  placeholder="Nhập mật khẩu"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={isLoading}
                >
                  {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>

                 {/* Demo Credentials */}
                 <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                   <h3 className="text-sm font-medium text-gray-700 mb-2">Test Credentials:</h3>
                   <div className="text-xs text-gray-600 space-y-1">
                     <p><strong>SuperAdmin:</strong> superadmin@museum.com / @llpasSsW0rd1234!</p>
                     <p><strong>Admin:</strong> admin@museum1.com / (password unknown)</p>
                     <p><strong>Admin:</strong> huhu@gmail.com / (password unknown)</p>
                     <p><strong>Staff:</strong> staff01@museum.com / (password unknown)</p>
                     <p className="text-red-600"><strong>Note:</strong> SuperAdmin password might be different!</p>
                   </div>
                 </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            © 2024 Museum Management System
          </p>
        </div>
      </div>
    </div>
  );
}
