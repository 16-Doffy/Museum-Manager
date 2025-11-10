# Hướng dẫn Deploy Museum-Portal lên Vercel

## Cấu hình Vercel cho Monorepo

### Bước 1: Tạo Project mới trên Vercel
1. Vào https://vercel.com/new
2. Import từ GitHub: `16-Doffy/Museum-Manager`
3. Branch: `main`
4. Root Directory: `apps/museum-portal`

### Bước 2: Cấu hình trong Vercel UI

**Framework Preset:**
- Chọn: `Vite`

**Build and Output Settings:**
- **Install Command:** `pnpm install` (hoặc để trống - Vercel tự detect)
- **Build Command:** `pnpm --filter museum-portal build`
- **Output Directory:** `dist`

**Environment Variables:**
- Thêm biến môi trường nếu cần (từ `.env` file)

### Bước 3: Deploy

Click "Deploy" và đợi build hoàn thành.

## Lưu ý

- Nếu deployment bị lỗi, kiểm tra Build Logs để xem lỗi cụ thể
- Đảm bảo `pnpm-lock.yaml` đã được commit và push
- Nếu có lỗi về npm registry, kiểm tra `.npmrc` file

