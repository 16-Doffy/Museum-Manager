import { apiClient } from '@/lib/api-client';
import { ConfirmMuseumRequest, Museum, MuseumListParams, MuseumListResponse, UpdateMuseumRequest } from '../types';

export const museumsApi = {
  getAll: async (params: MuseumListParams = { pageIndex: 1, pageSize: 10 }) => {
    const searchParams = new URLSearchParams({
      pageIndex: String(params.pageIndex || 1),
      pageSize: String(params.pageSize || 10),
    });

    // Add Status filter if provided
    if (params.Status) {
      searchParams.append('Status', params.Status);
    }

    const response = await apiClient.get<MuseumListResponse>(`/museums?${searchParams.toString()}`);
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get<Museum>(`/museums/${id}`);
    return response.data;
  },

  update: async (id: string, data: UpdateMuseumRequest) => {
    const response = await apiClient.put<Museum>(`/museums/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete<null>(`/museums/${id}`);
    return response.data;
  },

  confirm: async (id: string, confirmStatus: ConfirmMuseumRequest['ConfirmStatus']) => {
    const response = await apiClient.put<Museum>(`/museums/${id}/confirm?ConfirmStatus=${confirmStatus}`, null);
    return response.data;
  },
};

