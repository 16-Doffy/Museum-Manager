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
    // Don't send token for public auth endpoints (login, logout, register, google login)
    const publicAuthEndpoints = ['/auth/login', '/auth/logout', '/auth/register', '/auth/login/google'];
    const isAuthEndpoint = publicAuthEndpoints.some((path) => endpoint.startsWith(path));
    const token = this.getAuthToken();

    // If no token and not auth endpoint, throw error (visitor endpoints still need token)
    if (!token && !isAuthEndpoint) {
      const error = new Error('No authentication token') as Error & { statusCode: number };
      error.statusCode = 401;
      throw error;
    }
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        // For visitor endpoints, still send token if available (required for /visitors/artifacts/{id})
        // Only skip token for auth endpoints (login, logout)
        ...(token && !isAuthEndpoint && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        // Try to parse error response, but handle empty responses for 502
        let errorData = {};
        try {
          const text = await response.text();
          if (text) {
            errorData = JSON.parse(text);
          }
        } catch {
          // Response body is empty or invalid JSON
        }
        
        // Handle 502 Bad Gateway specifically
        if (response.status === 502) {
          throw {
            message: 'Máy chủ API không phản hồi (502 Bad Gateway). Vui lòng:\n1. Kiểm tra server API có đang chạy không\n2. Thử lại sau vài giây\n3. Liên hệ quản trị viên nếu vấn đề tiếp tục',
            statusCode: 502,
            errors: (errorData && typeof errorData === 'object' && 'errors' in errorData) ? errorData.errors : ['Server không phản hồi'],
          } as ApiError;
        }
        
        // API returns { code, statusCode, message, errors? } on error
        const errorObj = errorData as any;
        throw {
          message: (errorData && typeof errorData === 'object' && ('message' in errorData || 'error' in errorData)) 
            ? (errorObj.message || errorObj.error) 
            : `Lỗi ${response.status}: ${response.statusText}`,
          statusCode: response.status,
          errors: (errorData && typeof errorData === 'object' && 'errors' in errorData) ? errorObj.errors : undefined,
        } as ApiError;
      }

      const responseData = await response.json();
      
      // API returns { code, statusCode, message, data: T } format
      // Extract data field from response
      if (responseData.code !== undefined && responseData.data !== undefined) {
        // Handle nested paginated response: { code, data: { items: [], pagination: {} } }
        const apiData = responseData.data;
        
        // If data contains items and pagination, return as PaginatedResponse
        if (apiData && typeof apiData === 'object' && 'items' in apiData && 'pagination' in apiData) {
          return {
            data: {
              items: apiData.items || [],
              pagination: apiData.pagination || {
                pageIndex: 1,
                pageSize: 10,
                totalItems: 0,
                totalPages: 0,
              },
            } as T,
            success: responseData.code === 200,
          };
        }
        
        // Otherwise return data as-is
        return {
          data: apiData,
          success: responseData.code === 200,
        };
      }
      
      // Fallback: if response is already the data (backward compatibility)
      return {
        data: responseData,
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
    return this.uploadMultipart<T>(endpoint, formData, 'POST');
  }

  // Generic multipart uploader with method control (POST/PUT/PATCH)
  async uploadMultipart<T>(endpoint: string, formData: FormData, method: 'POST' | 'PUT' | 'PATCH'): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getAuthToken();

    const config: RequestInit = {
      method,
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
          message: (errorData as any).message || 'Upload failed',
          statusCode: response.status,
          errors: (errorData as any).errors,
        } as ApiError;
      }

      const data = await response.json();
      return { data, success: true };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw { message: error.message, statusCode: 500 } as ApiError;
      }
      throw error as ApiError;
    }
  }
}

export const apiClient = new ApiClient(API_BASE_URL);