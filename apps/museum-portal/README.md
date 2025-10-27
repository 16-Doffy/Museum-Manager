# Museum Portal - API Integration

## 🚀 Quick Start

### 1. Setup Environment
```bash
# Copy environment template
cp env.example .env.local

# Edit .env.local with your API URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api/v1
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Test API Integration
Visit: `http://localhost:3000/test-api`

## 📁 Project Structure

```
src/
├── lib/
│   ├── api/                 # API layer
│   │   ├── client.ts       # HTTP client with JWT
│   │   ├── endpoints.ts    # API endpoints
│   │   ├── types.ts        # TypeScript types
│   │   └── hooks.ts        # React hooks
│   └── contexts/
│       └── AuthContext.tsx # Authentication context
├── components/
│   └── collections/
│       └── CollectionTable.tsx # Example component using API
└── app/
    ├── layout.tsx          # Root layout with AuthProvider
    └── test-api/           # API test page
```

## 🔧 Available APIs

### Authentication
- Login with email/password
- Google OAuth login
- JWT token management

### Data Management
- **Artifacts**: CRUD operations, media management
- **Areas**: Khu vực quản lý
- **Display Positions**: Vị trí trưng bày
- **Visitors**: Khách tham quan
- **Interactions**: Tương tác khách-hiện vật

## 💡 Usage Examples

### Using API Hooks
```tsx
import { useArtifacts, useAreas } from '../lib/api/hooks';

function MyComponent() {
  const { artifacts, loading, error, createArtifact } = useArtifacts();
  const { areas } = useAreas();
  
  // Use the data...
}
```

### Using Authentication
```tsx
import { useAuth } from '../lib/contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <LoginForm />;
  }
  
  return <div>Welcome, {user?.name}!</div>;
}
```

## 🐛 Troubleshooting

### Module Resolution Errors
If you see "Module not found" errors:
1. Restart TypeScript server in VS Code
2. Clear Next.js cache: `rm -rf .next`
3. Reinstall dependencies: `rm -rf node_modules && npm install`

### API Connection Issues
1. Check if backend is running on correct port
2. Verify CORS configuration in backend
3. Check browser network tab for API calls

## 📚 Documentation

See `API_INTEGRATION_GUIDE.md` for detailed documentation.