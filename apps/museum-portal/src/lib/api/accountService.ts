import { apiClient } from './client';
import { accountEndpoints } from './endpoints';
import { Account, AccountCreateRequest, AccountUpdateRequest, PaginatedResponse, PaginationParams } from './types';

export class AccountService {
  static async getAll(params?: PaginationParams): Promise<PaginatedResponse<Account>> {
    const response = await apiClient.get<PaginatedResponse<Account>>(
      accountEndpoints.getAll,
      params ? (params as unknown as Record<string, string | number | boolean>) : undefined
    );
    return response.data;
  }

  static async getById(id: string): Promise<Account> {
    const response = await apiClient.get<Account>(accountEndpoints.getById(id));
    return response.data;
  }

  static async create(roleId: string, museumId: string, data: AccountCreateRequest): Promise<Account> {
    const response = await apiClient.post<Account>(
      `${accountEndpoints.create}?roleId=${encodeURIComponent(roleId)}&museumId=${encodeURIComponent(museumId)}`, 
      data
    );
    return response.data;
  }

  static async update(id: string, data: AccountUpdateRequest): Promise<Account> {
    const response = await apiClient.put<Account>(accountEndpoints.update(id), data);
    return response.data;
  }

  static async delete(id: string): Promise<void> {
    await apiClient.delete(accountEndpoints.delete(id));
  }
}
