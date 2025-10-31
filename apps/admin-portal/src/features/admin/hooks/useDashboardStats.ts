import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboard-api';

export function useAccountStats() {
  return useQuery({
    queryKey: ['dashboard', 'accounts'],
    queryFn: () => dashboardApi.getAccountStats(),
  });
}

export function useMuseumStats() {
  return useQuery({
    queryKey: ['dashboard', 'museums'],
    queryFn: () => dashboardApi.getMuseumStats(),
  });
}

export function useArtifactStats() {
  return useQuery({
    queryKey: ['dashboard', 'artifacts'],
    queryFn: () => dashboardApi.getArtifactStats(),
  });
}
