/**
 * @fileoverview API Endpoints for Museum Portal
 * 
 * All API endpoints for admin/staff operations in museum-portal
 */

// Auth endpoints
export const authEndpoints = {
  login: '/auth/login',
  loginGoogle: '/auth/login/google',
  logout: '/auth/logout',
} as const;

// Artifact Management endpoints
export const artifactEndpoints = {
  getAll: '/artifacts',
  getById: (id: string) => `/artifacts/${id}`,
  getByCode: (code: string) => `/artifacts/code/${code}`,
  create: '/artifacts',
  update: (id: string) => `/artifacts/${id}`,
  delete: (id: string) => `/artifacts/${id}`,
  activate: (id: string) => `/artifacts/${id}/activate`,
  assignDisplayPosition: (artifactId: string, displayPositionId: string) => 
    `/artifacts/${artifactId}/assign-display-position/${displayPositionId}`,
  removeDisplayPosition: (artifactId: string) => 
    `/artifacts/${artifactId}/remove-display-position`,
  addMedia: (artifactId: string) => `/artifacts/${artifactId}/media`,
  updateMedia: (artifactId: string, mediaId: string) => 
    `/artifacts/${artifactId}/media/${mediaId}`,
  deleteMedia: (artifactId: string, mediaId: string) => 
    `/artifacts/${artifactId}/media/${mediaId}`,
} as const;

// Display Position Management endpoints
export const displayPositionEndpoints = {
  getAll: '/display-positions',
  getById: (id: string) => `/display-positions/${id}`,
  create: '/display-positions',
  update: (id: string) => `/display-positions/${id}`,
  delete: (id: string) => `/display-positions/${id}`,
  activate: (id: string) => `/display-positions/activate/${id}`,
} as const;

// Area Management endpoints
export const areaEndpoints = {
  getAll: '/areas',
  getById: (id: string) => `/areas/${id}`,
  create: '/areas',
  update: (id: string) => `/areas/${id}`,
  delete: (id: string) => `/areas/${id}`,
  activate: (id: string) => `/areas/${id}/activate`,
} as const;

// Visitor Management endpoints
export const visitorEndpoints = {
  getAll: '/visitor',
  getById: (id: string) => `/visitor/${id}`,
  create: '/visitor',
  update: (id: string) => `/visitor/${id}`,
  delete: (id: string) => `/visitor/${id}`,
} as const;

// Interaction Management endpoints
export const interactionEndpoints = {
  getAll: '/interaction',
  getById: (id: string) => `/interaction/${id}`,
  create: '/interaction',
  update: (id: string) => `/interaction/${id}`,
  delete: (id: string) => `/interaction/${id}`,
} as const;

// Museum Management endpoints (for admin to get their museum info)
export const museumEndpoints = {
  getById: (id: string) => `/museums/${id}`,
  update: (id: string) => `/museums/${id}`,
} as const;

// Account Management endpoints (SuperAdmin & Admin)
export const accountEndpoints = {
  getAll: '/api/v1/accounts',
  getById: (id: string) => `/api/v1/accounts/${id}`,
  create: (roleId: string, museumId: string) => `/api/v1/accounts/${roleId}/${museumId}`,
  update: (id: string) => `/api/v1/accounts/${id}`,
  delete: (id: string) => `/api/v1/accounts/${id}`,
} as const;
