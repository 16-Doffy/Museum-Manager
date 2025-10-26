import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { authApi, decodeToken, isTokenExpired } from '../lib/api';
import type { AuthState, User } from '../lib/types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
    isLoading: true,
  });

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (token && userStr && !isTokenExpired(token)) {
      try {
        const user = JSON.parse(userStr);
        setState({
          isAuthenticated: true,
          user,
          token,
          isLoading: false,
        });
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setState({
          isAuthenticated: false,
          user: null,
          token: null,
          isLoading: false,
        });
      }
    } else {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login({ email, password });
      const { token } = response.data;

      // Decode token to get user info
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

      // Store in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      setState({
        isAuthenticated: true,
        user,
        token,
        isLoading: false,
      });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setState({
        isAuthenticated: false,
        user: null,
        token: null,
        isLoading: false,
      });
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

