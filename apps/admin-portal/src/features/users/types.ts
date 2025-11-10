export interface Account {
  id: string;
  email: string;
  fullName: string;
  status: 'Active' | 'Inactive';
  createAt: string;
  updateAt: string | null;
  roleId: string;
  roleName: string;
  museumId: string;
  museumName: string;
}

export interface AccountListResponse {
  items: Account[];
  totalItems: number;
  pageIndex: number;
  totalPages: number;
  pageSize: number;
}

export interface AccountListParams {
  pageIndex?: number;
  pageSize?: number;
}

export interface Role {
  id: string;
  name: string;
  createAt: string;
  status: 'Active' | 'Inactive';
}

export interface RoleListResponse {
  items: Role[];
  totalItems: number;
  pageIndex: number;
  totalPages: number;
  pageSize: number;
}

export interface RoleListParams {
  pageIndex?: number;
  pageSize?: number;
}

export interface CreateAccountRequest {
  email: string;
  fullName: string;
  password: string;
  roleId: string;
  museumId: string;
}

export interface UpdateAccountRequest {
  email: string;
  fullName: string;
  password?: string; // Optional - only if changing password
}

