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
    const { roleId, museumId, email, fullName, password } = data;
    // If museumId is provided, create active account with museum
    // If not, create pending account without museum
    const url = museumId ? `/accounts/${roleId}/${museumId}` : `/accounts/${roleId}`;
    const response = await apiClient.post<Account>(url, {
      email,
      fullName,
      password,
    });
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

