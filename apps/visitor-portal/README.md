# Visitor Portal - Bảo Tàng Lịch Sử Việt Nam

## Tổng Quan

Visitor Portal là cổng thông tin dành cho khách tham quan của Bảo Tàng Lịch Sử Việt Nam. Được thiết kế với giao diện hiện đại, responsive và thân thiện với người dùng.

## Tính Năng Chính

### 🏠 Trang Chủ

- **Hero Section**: Banner chính với thông tin nổi bật và tìm kiếm
- **Thống Kê Bảo Tàng**: Hiển thị các con số ấn tượng
- **Triển Lãm Nổi Bật**: Showcase các triển lãm đang diễn ra
- **Sự Kiện Sắp Tới**: Thông tin về các hoạt động sắp diễn ra
- **Tham Quan Ảo**: Giới thiệu công nghệ VR/AR
- **Tin Tức**: Cập nhật tin tức mới nhất

### 🎨 Triển Lãm

- Danh sách đầy đủ các triển lãm
- Bộ lọc theo danh mục và trạng thái
- Thông tin chi tiết từng triển lãm
- Đánh giá và lượt tham quan

### 📅 Sự Kiện

- Lịch sự kiện với các tab: Hôm nay, Sắp tới, Tất cả
- Thông tin chi tiết về từng sự kiện
- Đăng ký tham gia
- Bộ lọc theo loại sự kiện

### 🥽 Tham Quan Ảo

- Giới thiệu công nghệ VR/AR
- Danh sách các khu vực tham quan ảo
- Thống kê và đánh giá
- Hướng dẫn sử dụng

## Công Nghệ Sử Dụng

- **Framework**: Next.js 15.5.4
- **UI Library**: shadcn/ui (ui-core package)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **TypeScript**: Full type safety
- **Responsive Design**: Mobile-first approach

## Cấu Trúc Thư Mục

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── exhibits/          # Exhibits pages
│   ├── events/            # Events pages
│   └── virtual-tour/      # Virtual tour pages
├── components/            # Reusable components
│   ├── Navigation.tsx     # Main navigation
│   ├── Footer.tsx         # Site footer
│   ├── HeroSection.tsx    # Homepage hero
│   ├── MuseumStats.tsx    # Statistics section
│   ├── FeaturedExhibits.tsx # Featured exhibits
│   ├── UpcomingEvents.tsx # Upcoming events
│   ├── VirtualTour.tsx    # Virtual tour section
│   └── NewsSection.tsx    # News section
└── globals.css           # Global styles
```

## Các Components Chính

### Navigation

- Responsive navigation với dropdown menus
- Theme toggle (dark/light mode)
- Search functionality
- Mobile hamburger menu

### Hero Section

- Gradient background với pattern
- Search bar
- Action buttons
- Info cards với thông tin nhanh

### Museum Stats

- Thống kê ấn tượng về bảo tàng
- Icons và màu sắc phân biệt
- Responsive grid layout

### Featured Exhibits

- Card layout với hình ảnh
- Badge system cho trạng thái
- Rating và thống kê
- Hover effects

### Upcoming Events

- Tabbed interface
- Event cards với thông tin chi tiết
- Price và capacity info
- Registration buttons

### Virtual Tour

- Feature highlights
- Tour section cards
- Statistics display
- Call-to-action sections

## Responsive Design

- **Mobile**: Single column layout, collapsible navigation
- **Tablet**: 2-column grids, optimized spacing
- **Desktop**: 3-4 column grids, full navigation
- **Large screens**: Maximum content width với proper spacing

## Màu Sắc & Theme

### Primary Colors

- **Red**: #dc2626 (Vietnamese flag red)
- **Yellow**: #eab308 (Vietnamese flag yellow)
- **Blue**: #2563eb (Trust và technology)
- **Green**: #16a34a (Nature và growth)

### Neutral Colors

- **Slate**: #64748b (Text và borders)
- **White**: #ffffff (Background)
- **Gray**: #f8fafc (Light backgrounds)

## Accessibility

- Semantic HTML structure
- ARIA labels và roles
- Keyboard navigation support
- High contrast ratios
- Screen reader friendly

## Performance

- Next.js optimization
- Image optimization
- Code splitting
- Lazy loading
- Responsive images

## Cách Chạy

1. Cài đặt dependencies:

```bash
pnpm install
```

2. Chạy development server:

```bash
pnpm dev
```

3. Mở browser tại: http://localhost:3300

## Build & Deploy

```bash
# Build production
pnpm build

# Start production server
pnpm start
```

## Tính Năng Tương Lai

- [ ] Tích hợp API backend
- [ ] User authentication
- [ ] Booking system
- [ ] Multi-language support
- [ ] Advanced search
- [ ] Social sharing
- [ ] Analytics integration
- [ ] PWA support

## Liên Hệ

Để biết thêm thông tin về dự án, vui lòng liên hệ team phát triển.

---

**Bảo Tàng Lịch Sử Việt Nam** - Nơi lưu giữ và truyền bá lịch sử dân tộc
