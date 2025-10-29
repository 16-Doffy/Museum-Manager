import { apiClient } from '@/lib/api-client';
import {
  Account,
  AccountListParams,
  AccountListResponse,
  CreateAccountRequest,
  UpdateAccountRequest,
} from '../types';

export const accountsApi = {
  getAll: async (params: AccountListParams = { pageIndex: 1, pageSize: 10 }) => {
    const searchParams = new URLSearchParams({
      pageIndex: String(params.pageIndex || 1),
      pageSize: String(params.pageSize || 10),
    });

    const response = await apiClient.get<AccountListResponse>(`/accounts?${searchParams.toString()}`);
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get<Account>(`/accounts/${id}`);
    return response.data;
  },

  create: async (data: CreateAccountRequest) => {
    const response = await apiClient.post<Account>('/accounts', data);
    return response.data;
  },

  update: async (id: string, data: UpdateAccountRequest) => {
    const response = await apiClient.put<Account>(`/accounts/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete<null>(`/accounts/${id}`);
    return response.data;
  },
};

