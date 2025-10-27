/**
 * @fileoverview API Client Configuration
 * 
 * Centralized API client setup with authentication and error handling
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://museum-system-api-160202770359.asia-southeast1.run.app/api/v1';

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      return token;
    }
    return null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getAuthToken();

    // If no token and not auth endpoint, throw error to use mock data
    if (!token && !endpoint.includes('/auth/') && !endpoint.includes('/login')) {
      const error = new Error('No authentication token') as Error & { statusCode: number };
      error.statusCode = 401;
      throw error;
    }

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      console.log('Making request to:', url);
      console.log('Request config:', config);
      
      const response = await fetch(url, config);
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.log('Error response data:', errorData);
        console.log('Full response:', response);
        throw {
          message: errorData.message || errorData.error || 'An error occurred',
          statusCode: response.status,
          errors: errorData.errors,
        } as ApiError;
      }

      const data = await response.json();
      return {
        data,
        success: true,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw {
          message: error.message,
          statusCode: 500,
        } as ApiError;
      }
      throw error;
    }
  }

  async get<T>(endpoint: string, params?: Record<string, string | number | boolean>): Promise<ApiResponse<T>> {
    const url = params ? `${endpoint}?${new URLSearchParams(params as Record<string, string>)}` : endpoint;
    return this.request<T>(url, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // File upload method
  async uploadFile<T>(endpoint: string, formData: FormData): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getAuthToken();

    const config: RequestInit = {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw {
          message: errorData.message || 'Upload failed',
          statusCode: response.status,
          errors: errorData.errors,
        } as ApiError;
      }

      const data = await response.json();
      return {
        data,
        success: true,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw {
          message: error.message,
          statusCode: 500,
        } as ApiError;
      }
      throw error;
    }
  }
}

export const apiClient = new ApiClient(API_BASE_URL);