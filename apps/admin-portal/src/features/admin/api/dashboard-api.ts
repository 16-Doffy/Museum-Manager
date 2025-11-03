import { apiClient } from '@/lib/api-client';
import { AccountStats, ArtifactStats, MuseumStats } from '../types';

export const dashboardApi = {
  getAccountStats: async () => {
    const response = await apiClient.get<AccountStats>('/superadmin/dashboard/accounts');
    return response.data;
  },

  getMuseumStats: async () => {
    const response = await apiClient.get<MuseumStats>('/superadmin/dashboard/museums');
    return response.data;
  },

  getArtifactStats: async () => {
    const response = await apiClient.get<ArtifactStats>('/superadmin/dashboard/artifacts');
    return response.data;
  },
};
