# Admin Portal - Museum Management System

Admin portal được xây dựng với **React + Vite** cho hệ thống quản lý bảo tàng.

## 🚀 Tech Stack

- **React 18** - UI Library
- **Vite 6** - Build Tool & Dev Server
- **TypeScript** - Type Safety
- **React Router 6** - Client-side Routing
- **Tailwind CSS 4** - Styling
- **Zustand** - State Management
- **TanStack Query** - Data Fetching & Caching
- **Sonner** - Toast Notifications
- **Lucide React** - Icons

## 📦 Installation

```bash
pnpm install
```

## ⚙️ Environment Setup

Tạo file `.env.local` trong thư mục `apps/admin-portal/`:

```env
VITE_API_URL=https://museum-system-api-160202770359.asia-southeast1.run.app/api/v1
VITE_ENV=development
```

**Lưu ý:** Phải restart dev server sau khi thay đổi environment variables!

## 🛠️ Development

Chạy dev server trên port 4000:

```bash
pnpm dev
```

App sẽ tự động mở tại: http://localhost:4000

## 🏗️ Build

```bash
pnpm build
```

## 👀 Preview Production Build

```bash
pnpm preview
```

## 🔍 Type Checking

```bash
pnpm type-check
```

## 📁 Cấu trúc thư mục

```
src/
├── components/           # Shared components
│   ├── common/          # Common UI components (Error page, etc.)
│   └── ScrollToTop/     # Scroll restoration component
├── config/              # App configuration
│   ├── API.ts          # API endpoints configuration
│   ├── routes.ts       # Route paths constants
│   └── index.ts        # Config initialization
├── features/            # Feature-based modules
│   ├── admin/          # Dashboard & admin features
│   ├── auth/           # Authentication (Login, etc.)
│   ├── museum/         # Museum management
│   ├── payment/        # Payment management
│   ├── rolebase/       # Role-based access control
│   ├── types/          # TypeScript type definitions
│   └── users/          # User management
├── layouts/             # Layout components
│   ├── DefaultLayout/  # Main authenticated layout
│   └── components/     # Layout sub-components (Header, Sidebar)
├── lib/                 # Utilities & helpers
│   ├── api-client.ts   # HTTP client wrapper
│   ├── auth.ts         # Auth utilities (JWT decode, etc.)
│   └── cn.ts           # className utility (clsx + tailwind-merge)
├── routes/              # Route definitions
│   ├── AppRoutes.tsx   # Main route configuration
│   └── index.ts        # Route exports
├── stores/              # Zustand stores
│   └── auth-store.ts   # Authentication state management
├── App.tsx              # Root component
├── main.tsx             # Entry point
└── index.css            # Global styles
```

## 🎯 Features

### ✅ Đã hoàn thành

- **Authentication System**
  - JWT-based authentication
  - Login/Logout functionality
  - Token management (localStorage)
  - Protected routes
  - Auto token expiration check

- **Layout & Navigation**
  - Responsive sidebar navigation
  - Header with user info
  - Collapsible menu items
  - Active route highlighting

- **Feature Modules (Placeholder)**
  - Dashboard với statistics cards
  - Museum Management
  - User Management
  - Payment Management
  - Role-based Access Control

### 🚧 Đang phát triển

- API Integration cho tất cả features
- CRUD operations
- Data tables với pagination
- Form validation
- File upload
- Real-time updates

## 🔐 Authentication

### API Endpoints

- **Base URL**: `https://museum-system-api-160202770359.asia-southeast1.run.app/api/v1`
- **Login**: `POST /auth/login`
- **Logout**: `POST /auth/logout`

### Login Flow

1. User nhập email & password
2. Call `/auth/login` API
3. Nhận JWT token từ response
4. Decode token để lấy user info
5. Lưu token vào localStorage
6. Update auth state với Zustand
7. Redirect to dashboard

### Token Structure

```typescript
{
  nameid: string; // User ID
  email: string; // User email
  unique_name: string; // Full name
  role: string; // SuperAdmin | MuseumAdmin | Staff
  exp: number; // Expiration timestamp
  iat: number; // Issued at timestamp
}
```

## 🎨 Styling

Project sử dụng **Tailwind CSS v4** với:

- Custom color palette (oklch color space)
- Dark mode support
- Custom CSS variables
- Responsive design utilities

## 📝 Environment Variables

Tạo file `.env.local`:

```env
VITE_API_URL=https://museum-system-api-160202770359.asia-southeast1.run.app/api/v1
VITE_API_PLACE_URL=
VITE_API_KEY=
VITE_ENV=development
```

## 🚀 Deployment

### Vercel

Project đã được cấu hình sẵn cho Vercel deployment:

```bash
# Deploy to Vercel
vercel

# Deploy to production
vercel --prod
```

### Build Output

- **Output Directory**: `dist/`
- **Framework**: Vite
- **Build Command**: `pnpm build`
- **Install Command**: `pnpm install`

## 📚 Scripts

| Script            | Description                  |
| ----------------- | ---------------------------- |
| `pnpm dev`        | Start development server     |
| `pnpm build`      | Build for production         |
| `pnpm preview`    | Preview production build     |
| `pnpm lint`       | Run ESLint                   |
| `pnpm type-check` | Run TypeScript type checking |

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run `pnpm type-check` and `pnpm lint`
4. Submit a pull request

## 📄 License

MIT

---

**Developed with ❤️ for Museum Management System**
