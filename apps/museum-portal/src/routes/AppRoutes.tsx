import { Route, Routes } from 'react-router-dom';
import LoginPage from '../features/auth/LoginPage';
import DashboardPage from '../features/dashboard/DashboardPage';
import AreasPage from '../features/areas/AreasPage';
import ArtifactsPage from '../features/artifacts/ArtifactsPage';
import DisplayPositionsPage from '../features/display-positions/DisplayPositionsPage';
import VisitorsPage from '../features/visitors/VisitorsPage';
import InteractionsPage from '../features/interactions/InteractionsPage';
import PersonnelPage from '../features/personnel/PersonnelPage';
import SettingsPage from '../features/settings/SettingsPage';
import ProtectedRoute from '../components/layout/ProtectedLayout';
import PublicArtifactDetailPage from '../features/artifacts/PublicArtifactDetailPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      {/* Public routes (no auth required) */}
      <Route path="/visitor/artifacts/:id" element={<PublicArtifactDetailPage />} />
      
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/areas" element={<AreasPage />} />
        <Route path="/artifacts" element={<ArtifactsPage />} />
        <Route path="/display-positions" element={<DisplayPositionsPage />} />
        <Route path="/visitors" element={<VisitorsPage />} />
        <Route path="/interactions" element={<InteractionsPage />} />
        <Route path="/personnel" element={<PersonnelPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}
