import { apiClient } from '@/lib/api-client';
import { RoleListParams, RoleListResponse } from '../types';

export const rolesApi = {
  getAll: async (params: RoleListParams = { pageIndex: 1, pageSize: 10 }) => {
    const searchParams = new URLSearchParams({
      pageIndex: String(params.pageIndex || 1),
      pageSize: String(params.pageSize || 10),
    });

    const response = await apiClient.get<RoleListResponse>(`/roles?${searchParams.toString()}`);
    return response.data;
  },
};

