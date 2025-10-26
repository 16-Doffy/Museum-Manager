import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth-store';

export default function NotPermittedPage() {
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <div className="text-center mb-6">
            <div className="inline-flex h-16 w-16 rounded-full bg-red-100 items-center justify-center mb-4">
              <svg
                className="h-8 w-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Truy cập bị từ chối</h1>
            <p className="text-gray-600">
              Bạn không có quyền truy cập vào Admin Portal. Chỉ SuperAdmin mới có thể truy cập.
            </p>
          </div>

          {user && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600">Tài khoản hiện tại:</p>
              <p className="text-sm font-medium text-gray-900">{user.email}</p>
              <p className="text-xs text-gray-500 mt-1">Vai trò: {user.role}</p>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={handleLogout}
              className="w-full bg-red-600 text-white py-2.5 rounded-lg font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all"
            >
              Đăng xuất
            </button>
            <button
              onClick={() => navigate(-1)}
              className="w-full bg-gray-100 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all"
            >
              Quay lại
            </button>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            Nếu bạn cho rằng đây là lỗi, vui lòng liên hệ quản trị viên.
          </p>
        </div>
      </div>
    </div>
  );
}

