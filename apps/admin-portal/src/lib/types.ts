/**
 * Application Types
 */

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'SuperAdmin' | 'MuseumAdmin' | 'Staff';
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

export type Museum = {
  id: string;
  name: string;
  city: string;
  status: string;
};

export type UserData = {
  id: string;
  email: string;
  name: string;
  role: string;
};

