import { accountEndpoints } from './endpoints';
import { Account, AccountCreateRequest, AccountUpdateRequest, PaginatedResponse, PaginationParams } from './types';

export class AccountService {
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
    
    console.log('Making API request:', { url, token: token ? 'exists' : 'missing' });
    
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
      
      console.log('API response:', { status: response.status, ok: response.ok, url });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  static async getAll(params?: PaginationParams): Promise<PaginatedResponse<Account>> {
    // Check if we have a mock token
    const token = this.getAuthToken();
    if (token && token.startsWith('mock-')) {
      console.log('Using mock data (mock token detected)');
      return this.getMockAccounts(params);
    }
    
    try {
      const queryParams = params ? `?${new URLSearchParams(params as unknown as Record<string, string>)}` : '';
      const response = await this.makeRequest<{
        code: number;
        statusCode: string;
        message: string;
        data: PaginatedResponse<Account>;
      }>(accountEndpoints.getAll + queryParams);
      
      return response.data;
    } catch (error) {
      console.log('API not available, using mock data for development');
      return this.getMockAccounts(params);
    }
  }

  private static getMockAccounts(params?: PaginationParams): PaginatedResponse<Account> {
    const mockAccounts: Account[] = [
      {
        id: '1',
        email: 'admin@museum.com',
        fullName: 'Museum Admin',
        status: 'active',
        createAt: '2024-01-01T00:00:00Z',
        updateAt: '2024-01-01T00:00:00Z',
        roleId: '2',
        roleName: 'Admin',
        museumId: '1',
        museumName: 'Bảo tàng Lịch sử Việt Nam',
      },
      {
        id: '2',
        email: 'manager@museum.com',
        fullName: 'Museum Manager',
        status: 'active',
        createAt: '2024-01-02T00:00:00Z',
        updateAt: '2024-01-02T00:00:00Z',
        roleId: '3',
        roleName: 'Manager',
        museumId: '1',
        museumName: 'Bảo tàng Lịch sử Việt Nam',
      },
      {
        id: '3',
        email: 'staff@museum.com',
        fullName: 'Museum Staff',
        status: 'active',
        createAt: '2024-01-03T00:00:00Z',
        updateAt: '2024-01-03T00:00:00Z',
        roleId: '4',
        roleName: 'Staff',
        museumId: '1',
        museumName: 'Bảo tàng Lịch sử Việt Nam',
      }
    ];
    
    return {
      items: mockAccounts,
      pageIndex: params?.pageIndex || 1,
      pageSize: params?.pageSize || 10,
      totalItems: mockAccounts.length,
      totalPages: 1,
    };
  }

  static async getById(id: string): Promise<Account> {
    try {
      const response = await this.makeRequest<{
        code: number;
        statusCode: string;
        message: string;
        data: Account;
      }>(accountEndpoints.getById(id));
      
      return response.data;
    } catch (error) {
      console.log('API not available for getById');
      throw error;
    }
  }

  static async create(roleId: string, museumId: string, data: AccountCreateRequest): Promise<Account> {
    // Check if we have a mock token
    const token = this.getAuthToken();
    if (token && token.startsWith('mock-')) {
      console.log('Using mock response for create account (mock token detected)');
      return {
        id: Date.now().toString(),
        email: data.email,
        fullName: data.fullName,
        status: 'active',
        createAt: new Date().toISOString(),
        updateAt: null,
        roleId: roleId,
        roleName: 'Mock Role',
        museumId: museumId,
        museumName: 'Mock Museum',
      };
    }
    
    const response = await this.makeRequest<{
      code: number;
      statusCode: string;
      message: string;
      data: Account;
    }>(accountEndpoints.create(roleId, museumId), {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    return response.data;
  }

  static async update(id: string, data: AccountUpdateRequest): Promise<Account> {
    // Check if we have a mock token
    const token = this.getAuthToken();
    if (token && token.startsWith('mock-')) {
      console.log('Using mock response for update account (mock token detected)');
      return {
        id: id,
        email: data.email || 'updated@museum.com',
        fullName: data.fullName || 'Updated User',
        status: 'active',
        createAt: '2024-01-01T00:00:00Z',
        updateAt: new Date().toISOString(),
        roleId: '1',
        roleName: 'Mock Role',
        museumId: '1',
        museumName: 'Mock Museum',
      };
    }
    
    const response = await this.makeRequest<{
      code: number;
      statusCode: string;
      message: string;
      data: Account;
    }>(accountEndpoints.update(id), {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    
    return response.data;
  }

  static async activate(id: string): Promise<Account> {
    // Check if we have a mock token
    const token = this.getAuthToken();
    if (token && token.startsWith('mock-')) {
      console.log('Using mock response for activate account (mock token detected)');
      return {
        id: id,
        email: 'activated@museum.com',
        fullName: 'Activated User',
        status: 'active',
        createAt: '2024-01-01T00:00:00Z',
        updateAt: new Date().toISOString(),
        roleId: '1',
        roleName: 'Mock Role',
        museumId: '1',
        museumName: 'Mock Museum',
      };
    }
    
    // First get the account details
    const account = await this.getById(id);
    
    // Use update endpoint to change status to active
    const response = await this.makeRequest<{
      code: number;
      statusCode: string;
      message: string;
      data: Account;
    }>(accountEndpoints.update(id), {
      method: 'PUT',
      body: JSON.stringify({ 
        email: account.email,
        fullName: account.fullName,
        status: 'Active'
      }),
    });
    
    return response.data;
  }

  static async deactivate(id: string): Promise<Account> {
    // Check if we have a mock token
    const token = this.getAuthToken();
    if (token && token.startsWith('mock-')) {
      console.log('Using mock response for deactivate account (mock token detected)');
      return {
        id: id,
        email: 'deactivated@museum.com',
        fullName: 'Deactivated User',
        status: 'inactive',
        createAt: '2024-01-01T00:00:00Z',
        updateAt: new Date().toISOString(),
        roleId: '1',
        roleName: 'Mock Role',
        museumId: '1',
        museumName: 'Mock Museum',
      };
    }
    
    // First get the account details
    const account = await this.getById(id);
    
    // Use update endpoint to change status to inactive
    const response = await this.makeRequest<{
      code: number;
      statusCode: string;
      message: string;
      data: Account;
    }>(accountEndpoints.update(id), {
      method: 'PUT',
      body: JSON.stringify({ 
        email: account.email,
        fullName: account.fullName,
        status: 'Inactive'
      }),
    });
    
    return response.data;
  }
}
