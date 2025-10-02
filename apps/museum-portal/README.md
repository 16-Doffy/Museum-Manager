# Museum Management Portal

Hệ thống quản lý bảo tàng toàn diện với giao diện hiện đại và dễ sử dụng.

## 🏗️ Cấu trúc Dự án

### 📁 Thư mục chính

```
src/
├── app/                    # Next.js App Router
│   ├── dashboard/         # Trang tổng quan
│   ├── collections/       # Quản lý bộ sưu tập
│   ├── events/           # Quản lý sự kiện
│   ├── visitors/         # Quản lý khách tham quan
│   ├── tickets/          # Quản lý vé
│   ├── reports/          # Báo cáo & thống kê
│   └── settings/         # Cài đặt hệ thống
├── components/           # React Components
│   ├── layout/          # Layout components (Sidebar, Topbar, etc.)
│   ├── dashboard/       # Dashboard components
│   ├── collections/     # Collection management components
│   ├── events/          # Event management components
│   ├── visitors/        # Visitor management components
│   ├── tickets/         # Ticket management components
│   ├── reports/         # Report components
│   └── common/          # Shared/common components
└── lib/                 # Utilities & configurations
    ├── api/            # API functions
    ├── hooks/          # Custom React hooks
    ├── types/          # TypeScript type definitions
    └── utils/          # Utility functions
```

## 🚀 Tính năng chính

### 📊 Dashboard
- Thống kê tổng quan về bảo tàng
- Biểu đồ doanh thu và khách tham quan
- Tổng quan về bộ sưu tập và sự kiện

### 🖼️ Quản lý Bộ sưu tập
- Thêm, sửa, xóa bộ sưu tập
- Phân loại và tìm kiếm
- Quản lý thông tin chi tiết

### 🎉 Quản lý Sự kiện
- Tạo và quản lý sự kiện
- Lên lịch sự kiện
- Theo dõi hiệu quả sự kiện

### 👥 Quản lý Khách tham quan
- Theo dõi số lượng khách
- Thống kê theo thời gian
- Phân tích xu hướng

### 🎫 Quản lý Vé
- Bán vé trực tuyến
- Quản lý giá vé
- Thống kê doanh thu

### 📈 Báo cáo & Thống kê
- Báo cáo doanh thu
- Thống kê khách tham quan
- Phân tích hiệu quả sự kiện

### ⚙️ Cài đặt Hệ thống
- Cấu hình thông tin bảo tàng
- Thiết lập giờ mở cửa
- Quản lý giá vé
- Cài đặt thông báo

## 🛠️ Công nghệ sử dụng

- **Framework**: Next.js 15
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: React Icons
- **Language**: TypeScript
- **Package Manager**: pnpm

## 🚀 Cách chạy dự án

```bash
# Cài đặt dependencies
pnpm install

# Chạy development server
pnpm dev

# Build cho production
pnpm build

# Chạy production server
pnpm start
```

## 📝 Ghi chú

- Server chạy trên port 3500
- Sử dụng App Router của Next.js 15
- Components được tổ chức theo chức năng
- Hỗ trợ TypeScript đầy đủ
- Responsive design cho mobile và desktop

## 🔄 Cập nhật gần đây

- Tái cấu trúc thư mục theo chức năng
- Thêm các trang quản lý chuyên biệt
- Cải thiện tổ chức components
- Thêm các utility functions
- Tối ưu hóa import paths