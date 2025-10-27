# Museum Portal - React + Vite

Museum Management Portal built with **React + Vite** (NOT Next.js)

## 🚀 Quick Start

### 1. Setup Environment
```bash
# Copy environment template
cp env.example .env.local

# Edit .env.local with your API URL
VITE_API_BASE_URL=http://localhost:3001/api/v1
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```

The app will open at: `http://localhost:3600`

### 4. Build for Production
```bash
npm run build
```

## 📁 Project Structure (React + Vite)

```
src/
├── features/              # Business logic pages
│   ├── auth/
│   ├── dashboard/
│   ├── areas/
│   ├── artifacts/
│   ├── visitors/
│   └── interactions/
│
├── components/           # Reusable UI components
│   ├── areas/
│   ├── collections/
│   ├── display-positions/
│   ├── visitors/
│   ├── layout/
│   └── common/
│
├── lib/
│   ├── api/             # API layer
│   │   ├── client.ts    # HTTP client with JWT
│   │   ├── endpoints.ts # API endpoints
│   │   ├── types.ts     # TypeScript types
│   │   └── hooks.ts     # React hooks
│   ├── hooks/           # Custom hooks
│   └── contexts/        # React contexts
│
├── stores/              # Zustand stores
│   └── auth-store.ts
│
├── routes/              # Route definitions
│   └── AppRoutes.tsx
│
├── App.tsx              # Main app component
└── main.tsx             # Entry point
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

## 🛠️ Tech Stack

- **React 18** - UI framework
- **Vite 6** - Build tool & dev server
- **TypeScript** - Type safety
- **React Router DOM** - Client-side routing
- **Zustand** - State management
- **TanStack Query** - Data fetching
- **Tailwind CSS** - Styling
- **Sonner** - Toast notifications

## 🐛 Troubleshooting

### Module Resolution Errors
If you see "Module not found" errors:
1. Restart TypeScript server in VS Code
2. Clear Vite cache: `rm -rf node_modules/.vite`
3. Reinstall dependencies: `rm -rf node_modules && npm install`

### API Connection Issues
1. Check if backend is running on correct port
2. Verify CORS configuration in backend
3. Check browser network tab for API calls

## 📚 Documentation

See `API_INTEGRATION_GUIDE.md` for detailed documentation.