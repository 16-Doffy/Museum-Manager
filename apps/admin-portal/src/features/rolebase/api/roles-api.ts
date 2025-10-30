import { apiClient } from '@/lib/api-client';
import { CreateRoleRequest, Role, RoleListParams, RoleListResponse, UpdateRoleRequest } from '../types';

export const rolesApi = {
  getAll: async (params: RoleListParams = { pageIndex: 1, pageSize: 10 }) => {
    const searchParams = new URLSearchParams({
      pageIndex: String(params.pageIndex || 1),
      pageSize: String(params.pageSize || 10),
    });

    const response = await apiClient.get<RoleListResponse>(`/roles?${searchParams.toString()}`);
    return response.data;
  },

  create: async (data: CreateRoleRequest) => {
    const response = await apiClient.post<Role>('/roles', data);
    return response.data;
  },

  update: async (id: string, data: UpdateRoleRequest) => {
    const response = await apiClient.put<Role>(`/roles/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete<null>(`/roles/${id}`);
    return response.data;
  },
};

