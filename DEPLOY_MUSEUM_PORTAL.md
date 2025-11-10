# Hướng dẫn Deploy Museum-Portal lên Vercel

## Cách 1: Deploy qua Vercel UI (Khuyến nghị)

### Bước 1: Tạo Project mới
1. Vào https://vercel.com/new
2. Chọn "Import Git Repository"
3. Chọn repository: `16-Doffy/Museum-Manager`
4. Click "Import"

### Bước 2: Cấu hình Project
1. **Project Name:** `museum-portal` (hoặc tên bạn muốn)
2. **Framework Preset:** Chọn `Vite`
3. **Root Directory:** Nhập `apps/museum-portal` (quan trọng!)
4. **Build and Output Settings:**
   - Click vào "Build and Output Settings" để mở rộng
   - **Install Command:** Để trống hoặc nhập `pnpm install`
   - **Build Command:** Nhập `pnpm --filter museum-portal build`
   - **Output Directory:** Nhập `dist`
5. **Environment Variables:** (Nếu cần)
   - Thêm `VITE_API_BASE_URL` nếu cần

### Bước 3: Deploy
1. Click nút "Deploy"
2. Đợi build hoàn thành (có thể mất 3-5 phút)

## Cách 2: Deploy bằng Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy từ root của repo
vercel

# Khi hỏi:
# - Set up and deploy? Yes
# - Which scope? Chọn account của bạn
# - Link to existing project? No
# - Project name? museum-portal
# - Directory? apps/museum-portal
# - Override settings? Yes
# - Build Command: pnpm --filter museum-portal build
# - Output Directory: dist
# - Install Command: pnpm install
```

## Kiểm tra Deployment

Sau khi deploy thành công:
1. Vercel sẽ cung cấp URL: `https://museum-portal-xxx.vercel.app`
2. Kiểm tra Build Logs nếu có lỗi
3. Kiểm tra Runtime Logs để debug

## Troubleshooting

### Lỗi: Cannot find module
- Đảm bảo Root Directory là `apps/museum-portal`
- Đảm bảo Build Command đúng: `pnpm --filter museum-portal build`

### Lỗi: pnpm install failed
- Kiểm tra `.npmrc` file có đúng không
- Kiểm tra `pnpm-lock.yaml` đã được commit chưa

### Lỗi: Build timeout
- Tăng timeout trong Vercel Settings
- Hoặc tối ưu hóa build process

