# Authentication Guide - Admin Portal

## 🔐 Tổng quan

Admin Portal sử dụng JWT (JSON Web Token) authentication với API backend.

## 📋 API Endpoints

**Base URL:** `https://museum-system-api-160202770359.asia-southeast1.run.app/api/v1`

**Login:** `POST /auth/login`  
**Logout:** `POST /auth/logout`

## 🔑 Demo Credentials

```json
{
  "email": "superadmin@museum.com",
  "password": "[your-password]"
}
```

## 📂 Cấu trúc Authentication

### 1. **API Service** (`src/lib/api.ts`)

- `apiClient`: HTTP client với automatic token injection
- `authApi.login()`: Login method
- `authApi.logout()`: Async logout method (calls API + clears localStorage)
- `decodeToken()`: Decode JWT token
- `isTokenExpired()`: Check token expiration

### 2. **Auth Context** (`src/contexts/AuthContext.tsx`)

- Global state management cho authentication
- Methods: `login()`, `logout()`
- Auto-load token từ localStorage khi app khởi động
- Provides: `isAuthenticated`, `user`, `token`, `isLoading`

### 3. **Protected Route** (`src/components/ProtectedRoute.tsx`)

- Wrapper component bảo vệ routes
- Auto redirect đến `/login` nếu chưa authenticated
- Hiển thị loading state khi đang check auth

### 4. **Login Page** (`src/pages/LoginPage.tsx`)

- Form đăng nhập với email/password
- Error handling
- Loading state
- Auto redirect sau khi login thành công

## 🔄 Authentication Flow

### Login Flow:

```
1. User nhập credentials → LoginPage
2. Call authApi.login() → Backend API
3. Backend trả về token
4. Decode token để lấy user info
5. Lưu token + user vào localStorage
6. Update AuthContext state
7. Redirect to Dashboard (/)
```

### Logout Flow:

```
1. User click "Đăng xuất" → Sidebar
2. Call authApi.logout() → Backend API
3. Backend invalidates token
4. Clear localStorage (token + user)
5. Update AuthContext state
6. Redirect to /login
```

## 💾 Storage

Token và user info được lưu trong `localStorage`:

- `token`: JWT token
- `user`: User object (id, email, name, role)

## 🛡️ Token Structure

```typescript
interface DecodedToken {
  nameid: string; // User ID
  email: string; // User email
  unique_name: string; // Full name
  role: string; // SuperAdmin, MuseumAdmin, Staff
  iat: number; // Issued at
  exp: number; // Expiration time
  sub: string; // Subject (User ID)
  nbf: number; // Not before
  iss: string; // Issuer
  aud: string; // Audience
}
```

## 📱 Usage trong Components

### Sử dụng Auth Context:

```tsx
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { isAuthenticated, user, login, logout } = useAuth();

  // Check if user is logged in
  if (!isAuthenticated) {
    return <div>Please login</div>;
  }

  // Access user info
  return <div>Welcome, {user?.name}!</div>;
}
```

### Protected Route:

```tsx
<Route
  path="/admin"
  element={
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  }
/>
```

## 🚀 Auto-refresh khi reload page

AuthContext tự động check localStorage khi app khởi động:

- Nếu có token hợp lệ → auto login
- Nếu token expired → redirect to login
- Nếu không có token → redirect to login

## 🔒 Security Features

1. ✅ Token được lưu trong localStorage (XSS protection cần CSP)
2. ✅ Token expiration check trước khi sử dụng
3. ✅ Auto logout khi token expired
4. ✅ Protected routes với redirect
5. ✅ Authorization header tự động inject vào mọi API call

## 🎯 Role-based Access Control (Coming Soon)

Hiện tại system có 3 roles:

- **SuperAdmin**: Full access
- **MuseumAdmin**: Manage one museum
- **Staff**: Limited access

Role được decode từ token và có thể dùng để implement RBAC.

## 🔧 Troubleshooting

### Token expired?

- Token có thời hạn 12 giờ (exp - iat = 43200s)
- Auto logout khi token expired
- User cần login lại

### CORS issues?

- Backend API đã config CORS
- Check network tab trong DevTools

### Login failed?

- Check email/password
- Check API endpoint
- Check network connection
