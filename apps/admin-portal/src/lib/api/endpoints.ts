/**
 * @fileoverview API Endpoints for Admin Portal (SuperAdmin)
 */

// Account Management endpoints (SuperAdmin)
export const accountEndpoints = {
  getAll: '/api/v1/accounts',
  getById: (id: string) => `/api/v1/accounts/${id}`,
  create: (roleId: string, museumId: string) => `/api/v1/accounts/${roleId}/${museumId}`,
  update: (id: string) => `/api/v1/accounts/${id}`,
  delete: (id: string) => `/api/v1/accounts/${id}`,
} as const;

// Role Management endpoints
export const roleEndpoints = {
  getAll: '/api/v1/roles',
  getById: (id: string) => `/api/v1/roles/${id}`,
  create: '/api/v1/roles',
  update: (id: string) => `/api/v1/roles/${id}`,
  delete: (id: string) => `/api/v1/roles/${id}`,
} as const;

// Museum Management endpoints
export const museumEndpoints = {
  getAll: '/api/v1/museums',
  getById: (id: string) => `/api/v1/museums/${id}`,
  create: '/api/v1/museums',
  update: (id: string) => `/api/v1/museums/${id}`,
  delete: (id: string) => `/api/v1/museums/${id}`,
} as const;
