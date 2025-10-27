"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  museumId?: string;
  museum?: {
    id: string;
    name: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  clearAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing auth token
    const token = localStorage.getItem('auth_token');
    if (token) {
      // TODO: Verify token with API and get user info
      // For now, assume valid token and create a basic user
      const basicUser: User = {
        id: '1',
        email: 'superadmin@museum.com',
        name: 'Super Admin',
        role: 'SuperAdmin',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };
      setUser(basicUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('Attempting login with:', { email, password });
      
      // Try real API first
      const loginData = { email, password };
      console.log('Sending login request:', loginData);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://museum-system-api-160202770359.asia-southeast1.run.app/api/v1'}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*',
        },
        body: JSON.stringify(loginData),
      });
      
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('API login response:', data);
        
        if (data.data && data.data.token) {
          localStorage.setItem('auth_token', data.data.token);
          
          const user: User = {
            id: '1',
            email: email,
            name: 'Super Admin',
            role: 'SuperAdmin',
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          
          setUser(user);
          return true;
        }
      } else {
        const errorData = await response.json();
        console.error('API login failed:', errorData);
        throw new Error(errorData.message || 'API login failed');
      }
      
      // Fallback to mock login for development
      if (email === 'superadmin@museum.com' && password === '@#pasSsWord1234!') {
        const mockToken = 'mock-superadmin-token-' + Date.now();
        localStorage.setItem('auth_token', mockToken);
        
        const user: User = {
          id: '1',
          email: email,
          name: 'Super Admin',
          role: 'SuperAdmin',
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        setUser(user);
        return true;
      }
      
      throw new Error('Invalid credentials');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const clearAuth = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
    console.log('Cleared all authentication data');
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://museum-system-api-160202770359.asia-southeast1.run.app/api/v1'}/auth/logout`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
        } catch (apiError) {
          console.log('API logout failed, clearing local auth');
        }
      }
      
      clearAuth();
    } catch (error) {
      console.error('Logout error:', error);
      clearAuth(); // Clear local auth even if API fails
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    clearAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
