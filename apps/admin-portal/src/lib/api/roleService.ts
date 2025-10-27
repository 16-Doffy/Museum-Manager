import { roleEndpoints } from './endpoints';
import { Role, RoleCreateRequest, RoleUpdateRequest, PaginatedResponse, PaginationParams } from './types';

export class RoleService {
  private static getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  private static async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getAuthToken();
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://museum-system-api-160202770359.asia-southeast1.run.app';
    const url = `${baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  static async getAll(params?: PaginationParams): Promise<PaginatedResponse<Role>> {
    // Check if we have a mock token
    const token = this.getAuthToken();
    if (token && token.startsWith('mock-')) {
      console.log('Using mock data for roles (mock token detected)');
      return this.getMockRoles(params);
    }
    
    try {
      const queryParams = params ? `?${new URLSearchParams(params as unknown as Record<string, string>)}` : '';
      const response = await this.makeRequest<{
        code: number;
        statusCode: string;
        message: string;
        data: PaginatedResponse<Role>;
      }>(roleEndpoints.getAll + queryParams);
      
      return response.data;
    } catch (error) {
      console.log('API not available, using mock data for development');
      return this.getMockRoles(params);
    }
  }

  private static getMockRoles(params?: PaginationParams): PaginatedResponse<Role> {
    const mockRoles: Role[] = [
      {
        id: '1',
        name: 'SuperAdmin',
        createAt: '2024-01-01T00:00:00Z',
        status: 'active',
      },
      {
        id: '2',
        name: 'Admin',
        createAt: '2024-01-02T00:00:00Z',
        status: 'active',
      },
      {
        id: '3',
        name: 'Manager',
        createAt: '2024-01-03T00:00:00Z',
        status: 'active',
      },
      {
        id: '4',
        name: 'Staff',
        createAt: '2024-01-04T00:00:00Z',
        status: 'active',
      }
    ];
    
    return {
      items: mockRoles,
      pageIndex: params?.pageIndex || 1,
      pageSize: params?.pageSize || 10,
      totalItems: mockRoles.length,
      totalPages: 1,
    };
  }

  static async getById(id: string): Promise<Role> {
    try {
      const response = await this.makeRequest<{
        code: number;
        statusCode: string;
        message: string;
        data: Role;
      }>(roleEndpoints.getById(id));
      
      return response.data;
    } catch (error) {
      console.log('API not available for getById');
      throw error;
    }
  }

  static async create(data: RoleCreateRequest): Promise<Role> {
    try {
      const response = await this.makeRequest<{
        code: number;
        statusCode: string;
        message: string;
        data: Role;
      }>(roleEndpoints.create, {
        method: 'POST',
        body: JSON.stringify(data),
      });
      
      return response.data;
    } catch (error) {
      console.log('API not available for create');
      throw error;
    }
  }

  static async update(id: string, data: RoleUpdateRequest): Promise<Role> {
    try {
      const response = await this.makeRequest<{
        code: number;
        statusCode: string;
        message: string;
        data: Role;
      }>(roleEndpoints.update(id), {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      
      return response.data;
    } catch (error) {
      console.log('API not available for update');
      throw error;
    }
  }

  static async delete(id: string): Promise<void> {
    try {
      await this.makeRequest(roleEndpoints.delete(id), {
        method: 'DELETE',
      });
    } catch (error) {
      console.log('API not available for delete');
      throw error;
    }
  }
}