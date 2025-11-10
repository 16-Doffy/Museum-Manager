import { Route, Routes } from 'react-router-dom';
import LoginPage from '../features/auth/LoginPage';
import RegisterPage from '../features/auth/RegisterPage';
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
import ExhibitionsPage from '../features/exhibitions/ExhibitionsPage';
import HistoricalContextsPage from '../features/historical-contexts/HistoricalContextsPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
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
        <Route path="/exhibitions" element={<ExhibitionsPage />} />
        <Route path="/historical-contexts" element={<HistoricalContextsPage />} />
      </Route>
    </Routes>
  );
}
