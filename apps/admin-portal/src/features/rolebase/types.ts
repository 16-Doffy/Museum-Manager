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

export interface CreateRoleRequest {
  name: string;
}

export interface UpdateRoleRequest {
  name: string;
}

