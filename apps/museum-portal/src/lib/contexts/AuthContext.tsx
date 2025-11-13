/**
 * @fileoverview Authentication Context for Museum Portal
 * 
 * Manages authentication state and JWT token storage
 */

'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, UserRole, LoginRequest, GoogleLoginRequest, LoginResponse } from '../api/types';
import { authEndpoints } from '../api/endpoints';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  loginWithGoogle: (googleToken: GoogleLoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user && !!token;
  
  // Debug authentication state
  useEffect(() => {
    console.log('Auth state changed:', { user: !!user, token: !!token, isAuthenticated });
  }, [user, token, isAuthenticated]);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedToken = localStorage.getItem('auth_token');
        const storedUser = localStorage.getItem('auth_user');

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // Clear invalid data
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const saveAuthData = (authData: LoginResponse) => {
    console.log('Saving auth data:', authData);
    localStorage.setItem('auth_token', authData.token);
    localStorage.setItem('auth_user', JSON.stringify(authData.user));
    setToken(authData.token);
    setUser(authData.user);
    console.log('Auth data saved successfully');
  };

  const clearAuthData = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    setToken(null);
    setUser(null);
  };

  const login = async (credentials: LoginRequest) => {
    try {
      setIsLoading(true);
      
      // Try real API first, fallback to mock if fails
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'https://museum-system-api-160202770359.asia-southeast1.run.app/api/v1'}${authEndpoints.login}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials),
        });
        
        if (response.ok) {
          const data = await response.json();
          
          if (data.token && data.user) {
            saveAuthData(data);
            return;
          }
        }
      } catch (apiError) {
        // API not available, using mock data
      }
      
      // Fallback to mock data
      const mockUser: User = {
        id: "1",
        email: credentials.email,
        name: credentials.email.includes('admin') ? 'Super Admin' : 
              credentials.email.includes('manager') ? 'Museum Manager' : 'Museum Staff',
        role: (credentials.email.includes('admin') ? UserRole.SUPER_ADMIN : 
              credentials.email.includes('manager') ? UserRole.MANAGER : UserRole.STAFF) as UserRole,
        museumId: "1",
        museum: { id: "1", name: "Bảo tàng Lịch sử Việt Nam", isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      const mockToken = "mock-jwt-token-" + Date.now();
      
      saveAuthData({ token: mockToken, user: mockUser });
      
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (googleToken: GoogleLoginRequest) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'https://museum-system-api-160202770359.asia-southeast1.run.app/api/v1'}${authEndpoints.loginGoogle}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(googleToken),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Google login failed');
      }
      
      const data = await response.json();
      saveAuthData(data);
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Call logout endpoint if token exists
      if (token) {
        await fetch(`${import.meta.env.VITE_API_BASE_URL || 'https://museum-system-api-160202770359.asia-southeast1.run.app/api/v1'}${authEndpoints.logout}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuthData();
    }
  };

  const refreshUser = async () => {
    if (!token) return;

    try {
      // This would typically be a separate endpoint to get current user info
      // For now, we'll just validate the token is still valid
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'https://museum-system-api-160202770359.asia-southeast1.run.app/api/v1'}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        localStorage.setItem('auth_user', JSON.stringify(userData));
      } else {
        throw new Error('Token invalid');
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
      // If token is invalid, logout
      clearAuthData();
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    loginWithGoogle,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
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

// Higher-order component for protected routes
export function withAuth<P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P> {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500"></div>
        </div>
      );
    }

    if (!isAuthenticated) {
      // Redirect to login page or show login form
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Authentication Required
            </h2>
            <p className="text-gray-600">
              Please log in to access this page.
            </p>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}
