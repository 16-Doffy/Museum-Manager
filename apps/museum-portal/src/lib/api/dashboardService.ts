import { apiClient } from './client';
import { dashboardAdminEndpoints } from './endpoints';
import { ArtifactStats, StaffStats } from './types';

export class DashboardService {
  /**
   * Get artifact statistics (Admin role only)
   * Retrieves statistics related to artifacts for a specific museum.
   */
  static async getArtifactStats(): Promise<ArtifactStats> {
    const response = await apiClient.get<ArtifactStats>(
      dashboardAdminEndpoints.artifactStats
    );
    return response.data;
  }

  /**
   * Get staff statistics (Admin role only)
   * Retrieves statistics related to staff for a specific museum.
   */
  static async getStaffStats(): Promise<StaffStats> {
    const response = await apiClient.get<StaffStats>(
      dashboardAdminEndpoints.staffStats
    );
    return response.data;
  }
}

