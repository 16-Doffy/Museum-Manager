/**
 * API Client for Museum Management System
 */

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'https://museum-system-api-160202770359.asia-southeast1.run.app/api/v1';

export interface ApiResponse<T> {
  code: number;
  statusCode: string;
  message: string;
  data: T;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    const token = localStorage.getItem('auth_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  async request<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options?.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        // Try to parse error response from backend
        const errorData = await response.json().catch(() => null);
        
        // Extract error message from various possible formats
        let errorMessage = 'Đã xảy ra lỗi';
        
        if (errorData) {
          // Check for common error message fields (both lowercase and uppercase)
          errorMessage = 
            errorData.Message ||      // Backend uses uppercase "Message"
            errorData.message || 
            errorData.Error ||         // Backend might use uppercase "Error"
            errorData.error || 
            errorData.title ||
            errorData.Title ||
            errorData.detail ||
            errorData.Detail ||
            (errorData.errors && typeof errorData.errors === 'string' ? errorData.errors : null) ||
            (errorData.Errors && typeof errorData.Errors === 'string' ? errorData.Errors : null) ||
            `HTTP ${response.status}: ${response.statusText}`;
          
          // If errors is an object/array, try to extract first error
          const errorsField = errorData.errors || errorData.Errors;
          if (errorsField && typeof errorsField === 'object') {
            if (Array.isArray(errorsField) && errorsField.length > 0) {
              errorMessage = errorsField[0].message || errorsField[0].Message || errorsField[0];
            } else {
              const firstError = Object.values(errorsField)[0];
              if (Array.isArray(firstError) && firstError.length > 0) {
                errorMessage = firstError[0];
              } else if (typeof firstError === 'string') {
                errorMessage = firstError;
              }
            }
          }
        } else {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  async patch<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

