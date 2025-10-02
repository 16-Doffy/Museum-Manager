# Cấu Trúc UI - Visitor Portal

## Sơ Đồ Tổng Quan

```
┌─────────────────────────────────────────────────────────────┐
│                    NAVIGATION BAR                          │
│  [Logo] [Trang Chủ] [Triển Lãm▼] [Sự Kiện▼] [Bộ Sưu Tập▼] │
│  [Thông Tin▼] [🔍] [🌙] [👤] [☰]                          │
└─────────────────────────────────────────────────────────────┘
│
├── HERO SECTION
│   ┌─────────────────────────────────────────────────────────┐
│   │  Background: Gradient + Pattern                        │
│   │  ┌─────────────────┐  ┌─────────────────────────────┐  │
│   │  │   LEFT CONTENT  │  │      RIGHT INFO CARDS       │  │
│   │  │                 │  │                             │  │
│   │  │ • Title + Desc  │  │ ┌─────┐ ┌─────┐            │  │
│   │  │ • Search Bar    │  │ │Event│ │Location│          │  │
│   │  │ • Action Btns   │  │ └─────┘ └─────┘            │  │
│   │  │                 │  │ ┌─────┐ ┌─────┐            │  │
│   │  │                 │  │ │Hours│ │Visitors│         │  │
│   │  │                 │  │ └─────┘ └─────┘            │  │
│   │  └─────────────────┘  └─────────────────────────────┘  │
│   └─────────────────────────────────────────────────────────┘
│
├── MUSEUM STATS
│   ┌─────────────────────────────────────────────────────────┐
│   │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐      │
│   │  │2.5M+    │ │150+     │ │50K+     │ │25+      │      │
│   │  │Visitors │ │Exhibits │ │Artifacts│ │Awards   │      │
│   │  └─────────┘ └─────────┘ └─────────┘ └─────────┘      │
│   └─────────────────────────────────────────────────────────┘
│
├── FEATURED EXHIBITS
│   ┌─────────────────────────────────────────────────────────┐
│   │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐      │
│   │  │   EXHIBIT   │ │   EXHIBIT   │ │   EXHIBIT   │      │
│   │  │   CARD 1    │ │   CARD 2    │ │   CARD 3    │      │
│   │  │             │ │             │ │             │      │
│   │  │ [Image]     │ │ [Image]     │ │ [Image]     │      │
│   │  │ Title       │ │ Title       │ │ Title       │      │
│   │  │ Description │ │ Description │ │ Description │      │
│   │  │ [Badge]     │ │ [Badge]     │ │ [Badge]     │      │
│   │  │ [Button]    │ │ [Button]    │ │ [Button]    │      │
│   │  └─────────────┘ └─────────────┘ └─────────────┘      │
│   └─────────────────────────────────────────────────────────┘
│
├── UPCOMING EVENTS
│   ┌─────────────────────────────────────────────────────────┐
│   │  ┌─────────────┐ ┌─────────────┐                      │
│   │  │   EVENT     │ │   EVENT     │                      │
│   │  │   CARD 1    │ │   CARD 2    │                      │
│   │  │             │ │             │                      │
│   │  │ Title       │ │ Title       │                      │
│   │  │ Description │ │ Description │                      │
│   │  │ Date/Time   │ │ Date/Time   │                      │
│   │  │ Location    │ │ Location    │                      │
│   │  │ Price       │ │ Price       │                      │
│   │  │ [Button]    │ │ [Button]    │                      │
│   │  └─────────────┘ └─────────────┘                      │
│   └─────────────────────────────────────────────────────────┘
│
├── VIRTUAL TOUR
│   ┌─────────────────────────────────────────────────────────┐
│   │  ┌─────────────────┐  ┌─────────────────────────────┐  │
│   │  │   LEFT CONTENT  │  │      TOUR HIGHLIGHTS        │  │
│   │  │                 │  │                             │  │
│   │  │ • Title + Desc  │  │ ┌─────┐ ┌─────┐            │  │
│   │  │ • Features      │  │ │Tour │ │Tour │            │  │
│   │  │ • Action Btns   │  │ │Card │ │Card │            │  │
│   │  │                 │  │ └─────┘ └─────┘            │  │
│   │  │                 │  │ ┌─────┐                    │  │
│   │  │                 │  │ │Tour │                    │  │
│   │  │                 │  │ │Card │                    │  │
│   │  │                 │  │ └─────┘                    │  │
│   │  └─────────────────┘  └─────────────────────────────┘  │
│   └─────────────────────────────────────────────────────────┘
│
├── NEWS SECTION
│   ┌─────────────────────────────────────────────────────────┐
│   │  ┌─────────────────────────┐ ┌─────────────────────┐   │
│   │  │    FEATURED ARTICLE     │ │   OTHER ARTICLES    │   │
│   │  │                         │ │                     │   │
│   │  │ [Large Image]           │ │ ┌─────┐ ┌─────┐    │   │
│   │  │ Title                   │ │ │Art  │ │Art  │    │   │
│   │  │ Description             │ │ │Card │ │Card │    │   │
│   │  │ Author/Date             │ │ └─────┘ └─────┘    │   │
│   │  │ [Button]                │ │ ┌─────┐            │   │
│   │  │                         │ │ │Art  │            │   │
│   │  │                         │ │ │Card │            │   │
│   │  │                         │ │ └─────┘            │   │
│   │  └─────────────────────────┘ └─────────────────────┘   │
│   └─────────────────────────────────────────────────────────┘
│
└─────────────────────────────────────────────────────────────┘
│                        FOOTER                              │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌───────┐ │
│  │Museum Info  │ │Quick Links  │ │Contact Info │ │Hours  │ │
│  │             │ │             │ │             │ │       │ │
│  │• Logo       │ │• Exhibits   │ │• Address    │ │• Days │ │
│  │• Description│ │• Events     │ │• Phone      │ │• Time │ │
│  │• Social     │ │• Collections│ │• Email      │ │• Note │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └───────┘ │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │              BOTTOM BAR                                 │ │
│  │  Copyright | Privacy | Terms | Accessibility           │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Chi Tiết Các Trang

### 1. Trang Chủ (/)

- **Hero Section**: Banner chính với search và info cards
- **Museum Stats**: 4 thống kê chính với icons
- **Featured Exhibits**: 3 triển lãm nổi bật
- **Upcoming Events**: 4 sự kiện sắp tới
- **Virtual Tour**: Giới thiệu tour ảo
- **News Section**: Tin tức với 1 bài nổi bật + 3 bài khác

### 2. Trang Triển Lãm (/exhibits)

- **Header**: Title và description
- **Filters**: Search, Category, Status, Filter button
- **Grid**: 3-4 cột với exhibit cards
- **Load More**: Button để xem thêm

### 3. Trang Sự Kiện (/events)

- **Header**: Title và description
- **Filters**: Search, Event Type, Category, Filter button
- **Tabs**: Hôm nay | Sắp tới | Tất cả
- **Content**: Grid layout theo tab
- **Load More**: Button để xem thêm

### 4. Trang Tham Quan Ảo (/virtual-tour)

- **Hero**: Gradient background với CTA
- **Features**: 4 tính năng chính
- **Tour Sections**: 6 khu vực tham quan
- **Stats**: 4 thống kê
- **CTA**: Call-to-action cuối trang

## Responsive Breakpoints

- **Mobile** (< 768px): Single column, stacked layout
- **Tablet** (768px - 1024px): 2 columns, adjusted spacing
- **Desktop** (1024px - 1440px): 3-4 columns, full features
- **Large** (> 1440px): Max width container, centered

## Color Scheme

### Primary Colors

- **Red**: #dc2626 (Vietnamese flag)
- **Yellow**: #eab308 (Vietnamese flag)
- **Blue**: #2563eb (Technology)
- **Green**: #16a34a (Growth)

### Neutral Colors

- **Slate**: #64748b (Text)
- **White**: #ffffff (Background)
- **Gray**: #f8fafc (Light bg)

## Component Hierarchy

```
App
├── Layout
│   ├── Navigation
│   ├── Main Content
│   └── Footer
├── Home Page
│   ├── HeroSection
│   ├── MuseumStats
│   ├── FeaturedExhibits
│   ├── UpcomingEvents
│   ├── VirtualTour
│   └── NewsSection
├── Exhibits Page
│   ├── Header
│   ├── Filters
│   └── ExhibitGrid
├── Events Page
│   ├── Header
│   ├── Filters
│   └── EventTabs
└── Virtual Tour Page
    ├── Hero
    ├── Features
    ├── TourSections
    ├── Stats
    └── CTA
```

## Interactive Elements

### Navigation

- Dropdown menus cho main categories
- Mobile hamburger menu
- Theme toggle
- Search functionality

### Cards

- Hover effects với shadow
- Color transitions
- Button interactions
- Badge system

### Forms

- Search inputs
- Filter dropdowns
- Responsive layouts
- Validation states

## Accessibility Features

- Semantic HTML structure
- ARIA labels và roles
- Keyboard navigation
- High contrast ratios
- Screen reader support
- Focus indicators

