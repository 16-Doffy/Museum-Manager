/**
 * @fileoverview Type Definitions for Admin Portal API
 */

// Base types
export interface PaginationParams {
  pageIndex: number;
  pageSize: number;
  search?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalItems: number;
  pageIndex: number;
  totalPages: number;
  pageSize: number;
}

// Account types for SuperAdmin
export interface Account {
  id: string;
  email: string;
  fullName: string;
  status: string;
  createAt: string;
  updateAt: string | null;
  roleId: string;
  roleName: string;
  museumId: string | null;
  museumName: string | null;
}

export interface AccountCreateRequest {
  email: string;
  password: string;
  fullName: string;
}

export type AccountUpdateRequest = Partial<AccountCreateRequest>;

export interface AccountSearchParams extends PaginationParams {
  search?: string;
  roleId?: string;
  museumId?: string;
  isActive?: boolean;
}

// Role types
export interface Role {
  id: string;
  name: string;
  createAt: string;
  status: string;
}

export interface RoleCreateRequest {
  name: string;
  description?: string;
}

export type RoleUpdateRequest = Partial<RoleCreateRequest>;

export interface RoleSearchParams extends PaginationParams {
  search?: string;
  isActive?: boolean;
}

// Museum types
export interface Museum {
  id: string;
  name: string;
  address?: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
