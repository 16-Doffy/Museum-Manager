# Hướng Dẫn Thiết Lập MockAPI.io để Đồng Bộ Dữ Liệu

## 📋 Mục Tiêu

Sử dụng MockAPI.io để đồng bộ dữ liệu giữa `@museum-portal` (Admin) và `@visitor-portal` (Visitor). Khi Admin CRUD dữ liệu, Visitor sẽ tự động thấy dữ liệu mới.

---

## 🔧 BƯỚC 1: Tạo Tài Khoản và Project trên MockAPI.io

### 1.1. Truy cập MockAPI.io

- Mở trình duyệt và truy cập: **https://mockapi.io/**
- Đăng ký/Đăng nhập tài khoản (miễn phí)

### 1.2. Tạo Project mới

1. Nhấn nút **"New Project"** hoặc **"Create Project"**
2. Đặt tên project (ví dụ: `museum-system`)
3. Chọn region (chọn gần bạn nhất)
4. Nhấn **"Create"**

### 1.3. Tạo Resources (Tài nguyên)

Sau khi tạo project, bạn sẽ thấy giao diện để tạo Resources. Tạo các resources sau:

#### Resource 1: `areas` (Khu vực)

1. Click **"New Resource"**
2. Resource name: `areas`
3. Click **"Add Field"** và thêm các fields sau:
   - `name` (String) - Tên khu vực
   - `description` (String) - Mô tả
   - `museumId` (String) - ID bảo tàng
   - `isActive` (Boolean) - Trạng thái hoạt động
   - `isDeleted` (Boolean) - Đã xóa chưa
   - `createdAt` (String) - Ngày tạo
   - `updatedAt` (String) - Ngày cập nhật
4. Click **"Create"**

#### Resource 2: `artifacts` (Hiện vật)

1. Click **"New Resource"**
2. Resource name: `artifacts`
3. Thêm các fields:
   - `code` (String) - Mã hiện vật
   - `name` (String) - Tên hiện vật
   - `description` (String)
   - `periodTime` (String)
   - `year` (String)
   - `areaId` (String) - ID khu vực
   - `museumId` (String)
   - `isActive` (Boolean)
   - `isDeleted` (Boolean)
   - `createdAt` (String)
   - `updatedAt` (String)
4. Click **"Create"**

#### Resource 3: `visitors` (Khách tham quan)

1. Click **"New Resource"**
2. Resource name: `visitors`
3. Thêm các fields cần thiết (tùy chọn)
4. Click **"Create"**

### 1.4. Lấy Base URL

Sau khi tạo xong các resources, bạn sẽ thấy:

- **Base URL** của project (ví dụ: `https://1234567890abcdef.mockapi.io/api/v1`)
- **Ghi chép lại URL này** - sẽ cần dùng cho cả 2 apps

---

## ⚙️ BƯỚC 2: Cấu Hình @museum-portal (Admin)

### 2.1. Tạo file `.env.local`

Trong thư mục `apps/museum-portal/`, tạo file `.env.local`:

```bash
# MockAPI.io Configuration
VITE_API_BASE_URL=https://YOUR_PROJECT_ID.mockapi.io/api/v1

# Ví dụ:
# VITE_API_BASE_URL=https://1234567890abcdef.mockapi.io/api/v1
```

**Lưu ý:**

- Thay `YOUR_PROJECT_ID` bằng ID project thực tế từ MockAPI.io
- Không có dấu `/` ở cuối URL
- MockAPI.io tự động tạo endpoint `/api/v1` nên bạn chỉ cần trỏ đến base URL

### 2.2. Kiểm tra Client API

File `apps/museum-portal/src/lib/api/client.ts` sẽ tự động đọc `VITE_API_BASE_URL` từ `.env.local`.

### 2.3. Test kết nối

1. Chạy `@museum-portal`:

   ```bash
   cd apps/museum-portal
   npm run dev
   ```

2. Vào trang **"Khu vực"** và thử tạo một khu vực mới
3. Kiểm tra trên MockAPI.io → Resource `areas` → xem có dữ liệu mới không

---

## 🌐 BƯỚC 3: Cấu Hình @visitor-portal (Visitor)

### 3.1. Tạo file `.env.local`

Trong thư mục `apps/visitor-portal/`, tạo file `.env.local`:

```bash
# MockAPI.io Configuration (trỏ đến CÙNG project với museum-portal)
BACKEND_API_ORIGIN=https://YOUR_PROJECT_ID.mockapi.io

# Tắt mock data mode để dùng API thực
NEXT_PUBLIC_USE_MOCK_DATA_ONLY=false

# Ví dụ:
# BACKEND_API_ORIGIN=https://1234567890abcdef.mockapi.io
# NEXT_PUBLIC_USE_MOCK_DATA_ONLY=false
```

**Quan trọng:**

- `BACKEND_API_ORIGIN` phải trỏ đến **CÙNG** base URL với `@museum-portal`
- Không có `/api/v1` ở đây vì proxy route sẽ tự thêm
- Đặt `NEXT_PUBLIC_USE_MOCK_DATA_ONLY=false` để visitor-portal gọi API thực

### 3.2. Kiểm tra Proxy Route

File `apps/visitor-portal/src/app/api/proxy/[...path]/route.ts` sẽ:

- Đọc `BACKEND_API_ORIGIN` từ `.env.local`
- Tự động thêm `/api/v1` vào path
- Forward request đến MockAPI.io

### 3.3. Test kết nối

1. Chạy `@visitor-portal`:

   ```bash
   cd apps/visitor-portal
   npm run dev
   ```

2. Vào trang **"Khu Vực"** và kiểm tra:
   - Nếu API thành công: Sẽ hiển thị dữ liệu từ MockAPI.io
   - Nếu API lỗi: Sẽ fallback về mock data (cảnh báo màu vàng)

---

## 🔄 BƯỚC 4: Test Đồng Bộ Hóa

### 4.1. Test Flow

1. **Mở 2 cửa sổ trình duyệt:**
   - Cửa sổ 1: `@museum-portal` (Admin) - `localhost:3212`
   - Cửa sổ 2: `@visitor-portal` (Visitor) - `localhost:3212` (hoặc port khác)

2. **Trên @museum-portal:**
   - Vào trang **"Quản lý Khu vực"**
   - Click **"Thêm khu vực mới"**
   - Tạo một khu vực mới (ví dụ: "Khu vực Test")
   - Lưu lại

3. **Kiểm tra MockAPI.io:**
   - Truy cập: `https://YOUR_PROJECT_ID.mockapi.io/api/v1/areas`
   - Xem có dữ liệu mới chưa

4. **Trên @visitor-portal:**
   - Vào trang **"Khu Vực"**
   - **Đợi 10 giây** (auto-refresh) hoặc click nút **"Làm mới"**
   - Khu vực mới sẽ xuất hiện!

---

## 🛠️ Xử Lý Lỗi

### Lỗi: CORS Error

**Giải pháp:** MockAPI.io đã hỗ trợ CORS sẵn, nếu vẫn lỗi thì kiểm tra:

- `BACKEND_API_ORIGIN` đúng chưa
- Proxy route hoạt động chưa (check console log)

### Lỗi: 404 Not Found

**Giải pháp:**

- Kiểm tra tên resource trên MockAPI.io (phải là `areas`, `artifacts`, không có `/api/v1` trong resource name)
- Kiểm tra Base URL có đúng format không

### Lỗi: Authentication Required

**Giải pháp:**

- MockAPI.io không yêu cầu auth mặc định
- Nếu code của bạn có check token, có thể tạm thời bỏ qua cho mock API

---

## 📝 Lưu Ý Quan Trọng

1. **Cùng một Base URL:**
   - Cả `@museum-portal` và `@visitor-portal` PHẢI trỏ đến **CÙNG một MockAPI.io project**
   - Nếu khác project → Dữ liệu sẽ không đồng bộ

2. **Resource Names:**
   - Tên resource trên MockAPI.io phải match với endpoint:
     - `areas` → `/api/v1/areas`
     - `artifacts` → `/api/v1/artifacts`
     - `visitors` → `/api/v1/visitors`

3. **Auto-Refresh:**
   - `@visitor-portal` tự động refresh mỗi 10 giây
   - Bạn có thể click nút **"Làm mới"** để refresh ngay lập tức

4. **Mock Data vs Real API:**
   - Khi dùng MockAPI.io, đặt `USE_MOCK_DATA_ONLY=false`
   - Mock data chỉ dùng khi API lỗi (fallback)

---

## ✅ Checklist

- [ ] Tạo tài khoản MockAPI.io
- [ ] Tạo project mới
- [ ] Tạo resource `areas`
- [ ] Tạo resource `artifacts` (tùy chọn)
- [ ] Ghi chép Base URL
- [ ] Tạo `.env.local` cho `@museum-portal`
- [ ] Tạo `.env.local` cho `@visitor-portal`
- [ ] Test tạo khu vực trên `@museum-portal`
- [ ] Test xem khu vực trên `@visitor-portal`
- [ ] Xác nhận đồng bộ thành công

---

## 🎉 Hoàn Thành!

Bây giờ bạn đã thiết lập xong MockAPI.io. Mọi thay đổi trên `@museum-portal` sẽ tự động hiển thị trên `@visitor-portal` sau tối đa 10 giây!

**Lưu ý:** MockAPI.io có giới hạn request (free plan: ~1000 requests/tháng). Nếu vượt quá, hãy nâng cấp plan hoặc chuyển sang backend thật.
