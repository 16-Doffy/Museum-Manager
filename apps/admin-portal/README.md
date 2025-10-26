# Admin Portal - Museum Management System

Admin portal được xây dựng với **React + Vite** cho hệ thống quản lý bảo tàng.

## 🚀 Tech Stack

- **React 18** - UI Library
- **Vite** - Build Tool & Dev Server
- **TypeScript** - Type Safety
- **React Router** - Routing
- **Tailwind CSS** - Styling

## 📦 Installation

```bash
pnpm install
```

## 🛠️ Development

Chạy dev server trên port 4000:

```bash
pnpm dev
```

## 🏗️ Build

```bash
pnpm build
```

## 👀 Preview Production Build

```bash
pnpm preview
```

## 📁 Cấu trúc thư mục

```
src/
├── components/       # Shared components
│   ├── Layout.tsx
│   ├── Sidebar.tsx
│   └── RevenueChart.tsx
├── pages/           # Page components
│   ├── HomePage.tsx
│   ├── MuseumsPage.tsx
│   ├── RevenuePage.tsx
│   └── UsersPage.tsx
├── App.tsx          # Main App component with routes
└── main.tsx         # Entry point
```

## 🎯 Features

- ✅ Quản lý bảo tàng (CRUD)
- ✅ Quản lý người dùng (CRUD)
- ✅ Theo dõi doanh số với biểu đồ
- ✅ Dashboard tổng quan
- ✅ Responsive design

## 🔑 Role: SuperAdmin

Portal này dành cho SuperAdmin với các quyền:

- Quản lý toàn bộ hệ thống (mọi bảo tàng)
- Tạo mới bảo tàng
- Tạo và quản lý users
