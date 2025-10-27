# Museum Portal - API Integration Guide

## Tổng quan

Museum Portal đã được tích hợp đầy đủ với các API endpoints để quản lý bảo tàng. Hệ thống hỗ trợ:

- **Authentication**: JWT token với localStorage
- **Role-based access**: Admin, Staff, Manager
- **CRUD operations**: Artifacts, Areas, Display Positions, Visitors, Interactions
- **Real-time data**: Loading states, error handling, pagination

## Cấu trúc API đã tích hợp

### 1. Authentication APIs
- `POST /api/v1/auth/login` - Đăng nhập bằng email/password
- `POST /api/v1/auth/login/google` - Đăng nhập bằng Google
- `POST /api/v1/auth/logout` - Đăng xuất

### 2. Artifact Management APIs
- `GET /api/v1/artifacts` - Lấy danh sách hiện vật (có phân trang)
- `GET /api/v1/artifacts/{id}` - Lấy hiện vật theo ID
- `GET /api/v1/artifacts/code/{code}` - Lấy hiện vật theo mã
- `POST /api/v1/artifacts` - Tạo hiện vật mới
- `PATCH /api/v1/artifacts/{id}` - Cập nhật hiện vật
- `DELETE /api/v1/artifacts/{id}` - Xóa hiện vật (soft delete)
- `PATCH /api/v1/artifacts/{id}/activate` - Kích hoạt hiện vật
- `PATCH /api/v1/artifacts/{artifactId}/assign-display-position/{displayPositionId}` - Gán vị trí trưng bày
- `PATCH /api/v1/artifacts/{artifactId}/remove-display-position` - Bỏ gán vị trí trưng bày
- `POST /api/v1/artifacts/{artifactId}/media` - Thêm media cho hiện vật
- `PUT /api/v1/artifacts/{artifactId}/media/{mediaId}` - Cập nhật media
- `DELETE /api/v1/artifacts/{artifactId}/media/{mediaId}` - Xóa media

### 3. Display Position Management APIs
- `GET /api/v1/display-postions` - Lấy danh sách vị trí trưng bày
- `GET /api/v1/display-postions/{id}` - Lấy vị trí trưng bày theo ID
- `POST /api/v1/display-postions` - Tạo vị trí trưng bày mới
- `PATCH /api/v1/display-postions/{id}` - Cập nhật vị trí trưng bày
- `DELETE /api/v1/display-postions/{id}` - Xóa vị trí trưng bày
- `PATCH /api/v1/display-postions/activate/{id}` - Kích hoạt vị trí trưng bày

### 4. Area Management APIs
- `GET /api/v1/areas` - Lấy danh sách khu vực
- `GET /api/v1/areas/{id}` - Lấy khu vực theo ID
- `POST /api/v1/areas` - Tạo khu vực mới
- `PATCH /api/v1/areas/{id}` - Cập nhật khu vực
- `DELETE /api/v1/areas/{id}` - Xóa khu vực
- `PATCH /api/v1/areas/{id}/activate` - Kích hoạt khu vực

### 5. Visitor Management APIs
- `GET /api/v1/visitor` - Lấy danh sách khách tham quan
- `GET /api/v1/visitor/{id}` - Lấy khách tham quan theo ID
- `POST /api/v1/visitor` - Tạo khách tham quan mới
- `PUT /api/v1/visitor/{id}` - Cập nhật thông tin khách tham quan
- `DELETE /api/v1/visitor/{id}` - Xóa khách tham quan

### 6. Interaction Management APIs
- `GET /api/v1/interaction` - Lấy danh sách tương tác
- `GET /api/v1/interaction/{id}` - Lấy tương tác theo ID
- `POST /api/v1/interaction` - Tạo tương tác mới
- `PUT /api/v1/interaction/{id}` - Cập nhật tương tác
- `DELETE /api/v1/interaction/{id}` - Xóa tương tác

## Cách sử dụng

### 1. Thiết lập Environment Variables

Tạo file `.env.local` từ `env.example`:

```bash
cp env.example .env.local
```

Cập nhật các giá trị trong `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_JWT_SECRET=your-jwt-secret-key
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
```

### 2. Sử dụng Authentication Context

```tsx
import { useAuth } from '../lib/contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <LoginForm />;
  }
  
  return (
    <div>
      <p>Xin chào, {user?.name}!</p>
      <button onClick={logout}>Đăng xuất</button>
    </div>
  );
}
```

### 3. Sử dụng API Hooks

```tsx
import { useArtifacts, useAreas, useDisplayPositions } from '../lib/api/hooks';

function ArtifactsPage() {
  const { 
    artifacts, 
    loading, 
    error, 
    createArtifact, 
    updateArtifact, 
    deleteArtifact 
  } = useArtifacts();
  
  const { areas } = useAreas();
  const { displayPositions } = useDisplayPositions();
  
  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>Lỗi: {error}</div>;
  
  return (
    <div>
      {artifacts.map(artifact => (
        <div key={artifact.id}>
          <h3>{artifact.name}</h3>
          <p>Khu vực: {artifact.area?.name}</p>
          <p>Vị trí: {artifact.displayPosition?.name}</p>
        </div>
      ))}
    </div>
  );
}
```

### 4. Protected Routes

```tsx
import { withAuth } from '../lib/contexts/AuthContext';

const ProtectedPage = withAuth(() => {
  return <div>Nội dung chỉ dành cho người đã đăng nhập</div>;
});
```

## Cấu trúc Files

```
apps/museum-portal/src/
├── lib/
│   ├── api/
│   │   ├── client.ts          # API client configuration
│   │   ├── endpoints.ts       # API endpoints definitions
│   │   ├── types.ts          # TypeScript type definitions
│   │   ├── hooks.ts          # React hooks for API calls
│   │   └── index.ts          # API exports
│   └── contexts/
│       └── AuthContext.tsx   # Authentication context
├── components/
│   └── collections/
│       └── CollectionTable.tsx # Updated component using API
└── app/
    └── layout.tsx            # Root layout with AuthProvider
```

## Tính năng đã tích hợp

### ✅ Authentication
- JWT token storage trong localStorage
- Auto-refresh token
- Role-based access control
- Google OAuth support

### ✅ Data Management
- CRUD operations cho tất cả entities
- Real-time loading states
- Error handling với retry
- Pagination support
- Search và filtering

### ✅ User Experience
- Loading spinners
- Error messages
- Success notifications
- Responsive design
- Vietnamese localization

## Lưu ý quan trọng

1. **API Base URL**: Đảm bảo backend API đang chạy trên đúng port
2. **CORS**: Backend cần cấu hình CORS để cho phép frontend gọi API
3. **Authentication**: JWT token sẽ được tự động thêm vào headers
4. **Error Handling**: Tất cả API calls đều có error handling
5. **Type Safety**: Sử dụng TypeScript để đảm bảo type safety

## Troubleshooting

### Lỗi "Cannot find module"
```bash
# Restart TypeScript server
# Trong VS Code: Ctrl+Shift+P -> "TypeScript: Restart TS Server"
```

### Lỗi CORS
```javascript
// Backend cần cấu hình:
app.use(cors({
  origin: 'http://localhost:3000', // Frontend URL
  credentials: true
}));
```

### Lỗi Authentication
- Kiểm tra JWT token trong localStorage
- Đảm bảo token chưa expired
- Kiểm tra API endpoint `/auth/me` có tồn tại không
