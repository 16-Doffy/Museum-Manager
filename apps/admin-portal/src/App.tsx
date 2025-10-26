import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { MuseumsPage } from './pages/MuseumsPage';
import { RevenuePage } from './pages/RevenuePage';
import { UsersPage } from './pages/UsersPage';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/museums" element={<MuseumsPage />} />
                  <Route path="/revenue" element={<RevenuePage />} />
                  <Route path="/users" element={<UsersPage />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;

