import { create } from 'zustand';
import { apiClient } from '../lib/api-client';
import { decodeToken, getStoredToken, isTokenExpired, removeStoredToken, setStoredToken } from '../lib/auth';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'SuperAdmin' | 'MuseumAdmin' | 'Staff';
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  checkAuth: () => {
    const token = getStoredToken();

    if (!token || isTokenExpired(token)) {
      removeStoredToken();
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
      return;
    }

    const decoded = decodeToken(token);
    if (!decoded) {
      removeStoredToken();
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
      return;
    }

    const user: User = {
      id: decoded.nameid,
      email: decoded.email,
      name: decoded.unique_name,
      role: decoded.role as User['role'],
    };

    set({ user, token, isAuthenticated: true, isLoading: false });
  },

  login: async (email: string, password: string) => {
    try {
      const response = await apiClient.post<{ token: string }>('/auth/login', { email, password });
      const { token } = response.data;

      const decoded = decodeToken(token);
      if (!decoded) {
        throw new Error('Invalid token');
      }

      const user: User = {
        id: decoded.nameid,
        email: decoded.email,
        name: decoded.unique_name,
        role: decoded.role as User['role'],
      };

      setStoredToken(token);
      set({ user, token, isAuthenticated: true, isLoading: false });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      removeStoredToken();
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  },
}));

