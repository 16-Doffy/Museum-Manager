import { create } from 'zustand';
import { apiClient } from '../lib/api/client';
import type { User } from '../lib/api/types';

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  checkAuth: () => {
    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('auth_user');

    if (!token || !userStr) {
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
      return;
    }

    try {
      const user = JSON.parse(userStr);
      set({ user, token, isAuthenticated: true, isLoading: false });
    } catch (error) {
      console.error('Error parsing user data:', error);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  },

  login: async (email: string, password: string) => {
    try {
      console.log('Attempting login with:', email);
      
      // Use exact Swagger format: /api/v1/auth/login with { email, password }
      const response = await apiClient.post<{ token: string }>('/auth/login', { email, password });
      console.log('Login response:', response);
      
      // Handle different response formats from Swagger
      const token = response.data?.token || 
                   response.data?.accessToken || 
                   response.data?.data?.token || 
                   response.data?.data?.accessToken ||
                   response.token ||
                   response.accessToken;
      
      if (!token) {
        throw new Error('No token received from server');
      }
      
      // Decode token to get user info
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      console.log('Token payload:', tokenPayload);
      
      const user: User = {
        id: tokenPayload.nameid,
        email: tokenPayload.email,
        name: tokenPayload.unique_name,
        role: tokenPayload.role,
        museumId: tokenPayload.museumid,
        isActive: true,
        createdAt: '',
        updatedAt: '',
      };

      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_user', JSON.stringify(user));
      set({ user, token, isAuthenticated: true, isLoading: false });
      
      console.log('Login successful, user:', user);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    set({ user: null, token: null, isAuthenticated: false, isLoading: false });
  },
}));
