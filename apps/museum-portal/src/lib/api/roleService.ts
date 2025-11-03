import { apiClient } from './client';
import { roleEndpoints } from './endpoints';

export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface RoleCreateRequest {
  name: string;
  description?: string;
  permissions?: string[];
}

export interface RoleUpdateRequest {
  name?: string;
  description?: string;
  permissions?: string[];
}

export class RoleService {
  static async getAll(): Promise<Role[]> {
    const response = await apiClient.get<Role[]>(roleEndpoints.getAll);
    return response.data;
  }

  static async getById(id: string): Promise<Role> {
    const response = await apiClient.get<Role>(roleEndpoints.getById(id));
    return response.data;
  }

  static async create(data: RoleCreateRequest): Promise<Role> {
    const response = await apiClient.post<Role>(roleEndpoints.create, data);
    return response.data;
  }

  static async update(id: string, data: RoleUpdateRequest): Promise<Role> {
    const response = await apiClient.put<Role>(roleEndpoints.update(id), data);
    return response.data;
  }

  static async delete(id: string): Promise<void> {
    await apiClient.delete(roleEndpoints.delete(id));
  }
}
