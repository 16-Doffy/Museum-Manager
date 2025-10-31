/**
 * API Endpoints aligned with museum-portal for cross-app consistency
 */

export const artifactEndpoints = {
  getAll: '/artifacts',
  getById: (id: string) => `/artifacts/${id}`,
  getByCode: (code: string) => `/artifacts/code/${code}`,
} as const;

export const areaEndpoints = {
  getAll: '/areas',
  getById: (id: string) => `/areas/${id}`,
} as const;

export const visitorEndpoints = {
  getAll: '/visitor',
} as const;

export const museumEndpoints = {
  getAll: '/museums',
} as const;


