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
      const user = JSON.parse(userStr) as User;
      set({ user, token, isAuthenticated: true, isLoading: false });

      // Always try to hydrate from /auth/profile first
      (async () => {
        try {
          const profRes = await apiClient.get(`/auth/profile`);
          const prof = (profRes as any)?.data || {};
          const updated: User = {
            id: prof.id || user.id,
            email: prof.email || user.email,
            name: prof.fullName || user.name,
            role: prof.role || user.role,
            museumId: prof.museumId || prof.museum?.id || user.museumId,
            isActive: true,
            createdAt: '',
            updatedAt: '',
          };
          // attach museum object if available or construct from flat fields
          if (prof.museum) {
            (updated as any).museum = prof.museum;
          } else if (prof.museumName || prof.museumLocation || prof.museumDescription) {
            (updated as any).museum = {
              id: updated.museumId,
              name: prof.museumName,
              address: prof.museumLocation,
              description: prof.museumDescription,
              isActive: true,
              createdAt: '',
              updatedAt: '',
            };
          }
          localStorage.setItem('auth_user', JSON.stringify(updated));
          set({ user: updated });
        } catch {
          // ignore; fall back to local user
        }
      })();

      // Hydrate museum info if missing
      if (user?.museumId && !user?.museum) {
        apiClient
          .get(`/museums/${user.museumId}`)
          .then((res: any) => {
            const museum = (res as any)?.data;
            const updatedUser = { ...user, museum } as User;
            localStorage.setItem('auth_user', JSON.stringify(updatedUser));
            set({ user: updatedUser });
          })
          .catch(() => undefined);
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  },

  login: async (email: string, password: string) => {
    try {
      // Clear any existing token before login
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      
      // Use exact Swagger format: /api/v1/auth/login with { email, password }
      const response = await apiClient.post<{ token: string }>('/auth/login', { email, password });
      
      // API response format: { code, statusCode, message, data: { token } }
      // response.data is already the data field from API response
      const token = response.data?.token || 
                   response.data?.accessToken;
      
      if (!token) {
        throw new Error('Không nhận được token từ server. Vui lòng kiểm tra lại thông tin đăng nhập.');
      }
      
      // Decode token to get user info
      let tokenPayload;
      try {
        tokenPayload = JSON.parse(atob(token.split('.')[1]));
      } catch (e) {
        throw new Error('Token không hợp lệ');
      }
      
      let user: User = {
        id: tokenPayload?.nameid || '',
        email: tokenPayload?.email || email,
        name: tokenPayload?.unique_name || '',
        role: tokenPayload?.role,
        museumId: tokenPayload?.museumid,
        isActive: true,
        createdAt: '',
        updatedAt: '',
      };

      // Prefer authoritative data from /auth/profile
      try {
        const profRes = await apiClient.get(`/auth/profile`);
        const prof = (profRes as any)?.data || {};
        user = {
          id: prof.id || user.id,
          email: prof.email || user.email,
          name: prof.fullName || user.name,
          role: prof.role || user.role,
          museumId: prof.museumId || prof.museum?.id || user.museumId,
          isActive: true,
          createdAt: '',
          updatedAt: '',
        } as User;
        if (prof.museum) (user as any).museum = prof.museum;
        else if (prof.museumName || prof.museumLocation || prof.museumDescription) {
          (user as any).museum = {
            id: user.museumId,
            name: prof.museumName,
            address: prof.museumLocation,
            description: prof.museumDescription,
            isActive: true,
            createdAt: '',
            updatedAt: '',
          };
        }
      } catch {}

      // If museumId still missing, try to get it from accounts API
      try {
        if (!user.museumId) {
          const accRes = await apiClient.get(`/accounts/${user.id}`);
          const acc = (accRes as any)?.data;
          const mId = acc?.museumId || acc?.museum?.id;
          if (mId) user.museumId = mId;
          if (!user.name && acc?.fullName) user.name = acc.fullName;
        }
      } catch {}

      // Final fallback: infer museumId from first area or display position
      try {
        if (!user.museumId) {
          const areasRes = await apiClient.get(`/areas`, { pageIndex: 1, pageSize: 1 });
          const items = (areasRes as any)?.data?.items;
          const inferredId = items?.[0]?.museumId || items?.[0]?.museum?.id;
          if (inferredId) user.museumId = inferredId;
        }
      } catch {}
      try {
        if (!user.museumId) {
          const dpRes = await apiClient.get(`/display-postions`, { pageIndex: 1, pageSize: 1 });
          const items = (dpRes as any)?.data?.items;
          const inferredId = items?.[0]?.area?.museumId || items?.[0]?.area?.museum?.id;
          if (inferredId) user.museumId = inferredId;
        }
      } catch {}

      // Try to fetch museum info immediately for header display
      try {
        if (user.museumId) {
          const museumRes = await apiClient.get(`/museums/${user.museumId}`);
          const museum = (museumRes as any)?.data;
          user = { ...user, museum } as User;
        }
      } catch {
        // ignore 401/403, we already have museum info from profile
      }

      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_user', JSON.stringify(user));
      
      // Clear API client blocks after successful login
      if (typeof window !== 'undefined' && (window as any).apiClient) {
        (window as any).apiClient.clearBlocks();
      }
      
      set({ user, token, isAuthenticated: true, isLoading: false });
    } catch (error: any) {
      // Provide user-friendly error messages
      const errorMessage = error?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.';
      throw new Error(errorMessage);
    }
  },

  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    set({ user: null, token: null, isAuthenticated: false, isLoading: false });
  },
}));
