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
  register: '/auth/register',
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
  getAll: '/display-postions',
  getById: (id: string) => `/display-postions/${id}`,
  create: '/display-postions',
  update: (id: string) => `/display-postions/${id}`,
  delete: (id: string) => `/display-postions/${id}`,
  activate: (id: string) => `/display-postions/${id}/active`,
  maintain: (id: string) => `/display-postions/${id}/maintain`,
} as const;

// Area Management endpoints
export const areaEndpoints = {
  getAll: '/areas',
  getById: (id: string) => `/areas/${id}`,
  create: '/areas',
  update: (id: string) => `/areas/${id}`,
  delete: (id: string) => `/areas/${id}`,
  activate: (id: string) => `/areas/${id}/activate`,
  maintain: (id: string) => `/areas/${id}/maintain`,
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
  getAll: '/museums',
  getById: (id: string) => `/museums/${id}`,
  create: '/museums',
  update: (id: string) => `/museums/${id}`,
  delete: (id: string) => `/museums/${id}`,
} as const;

// Account Management endpoints (SuperAdmin & Admin)
export const accountEndpoints = {
  getAll: '/accounts',
  getById: (id: string) => `/accounts/${id}`,
  create: '/accounts',
  update: (id: string) => `/accounts/${id}`,
  delete: (id: string) => `/accounts/${id}`,
} as const;

// Role Management endpoints
export const roleEndpoints = {
  getAll: '/roles',
  getById: (id: string) => `/roles/${id}`,
  create: '/roles',
  update: (id: string) => `/roles/${id}`,
  delete: (id: string) => `/roles/${id}`,
} as const;

// Visitor Public API endpoints (for public artifact viewing)
export const visitorPublicEndpoints = {
  register: '/visitors/register',
  login: '/visitors/login',
  getArtifactById: (id: string) => `/visitors/artifacts/${id}`,
} as const;

// Exhibition Management endpoints
export const exhibitionEndpoints = {
  getAll: '/exhibition',
  getById: (id: string) => `/exhibition/${id}`,
  create: '/exhibition',
  update: (id: string) => `/exhibition/${id}`,
  delete: (id: string) => `/exhibition/${id}`,
  removeHistorical: (id: string) => `/exhibition/${id}/remove-historical`,
} as const;

// Historical Context Management endpoints
export const historicalContextEndpoints = {
  getAll: '/historicalcontext',
  getById: (id: string) => `/historicalcontext/${id}`,
  create: '/historicalcontext',
  update: (id: string) => `/historicalcontext/${id}`,
  delete: (id: string) => `/historicalcontext/${id}`,
  assignArtifacts: (historicalContextId: string) => 
    `/historicalcontext/${historicalContextId}/assign-artifacts`,
  removeArtifacts: (historicalContextId: string) => 
    `/historicalcontext/${historicalContextId}/remove-artifacts`,
} as const;

// Dashboard Admin endpoints (for Admin role only)
export const dashboardAdminEndpoints = {
  artifactStats: '/admin/dashboards/artifact-stats',
  staffStats: '/admin/dashboards/staff-stats',
} as const;
