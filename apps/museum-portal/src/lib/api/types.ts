/**
 * @fileoverview Type Definitions for Museum Portal API
 */

// Base types
export interface PaginationParams {
  pageIndex: number;
  pageSize: number;
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    pageIndex: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

// Account types
export interface Account {
  id: string;
  email: string;
  fullName: string;
  role: {
    id: string;
    name: string;
  };
  museum?: {
    id: string;
    name: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
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

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface GoogleLoginRequest {
  token: string;
}

export interface LoginResponse {
  token: string;
  user: User;
  refreshToken?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  museumId: string;
  museum?: Museum;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export enum UserRole {
  SUPER_ADMIN = 'SuperAdmin',
  ADMIN = 'Admin',
  STAFF = 'Staff',
  MANAGER = 'Manager',
}

// Museum types
export interface Museum {
  id: string;
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Artifact types
export interface Artifact {
  id: string;
  code: string;
  name: string;
  periodTime?: string;
  description?: string;
  isOriginal?: boolean;
  weight?: number;
  height?: number;
  width?: number;
  length?: number;
  year?: string;
  origin?: string;
  material?: string;
  dimensions?: string;
  condition?: string;
  acquisitionDate?: string;
  acquisitionMethod?: string;
  provenance?: string;
  culturalSignificance?: string;
  conservationNotes?: string;
  displayPositionId?: string;
  displayPosition?: DisplayPosition;
  areaId?: string;
  area?: Area;
  museumId: string;
  museum?: Museum;
  isActive: boolean;
  isDeleted?: boolean;
  media?: ArtifactMedia[];
  createdAt: string;
  updatedAt: string;
}

export interface ArtifactCreateRequest {
  name: string;
  periodTime?: string;
  description?: string;
  isOriginal?: boolean;
  weight?: number;
  height?: number;
  width?: number;
  length?: number;
  code?: string;
  year?: string;
  origin?: string;
  material?: string;
  dimensions?: string;
  condition?: string;
  acquisitionDate?: string;
  acquisitionMethod?: string;
  provenance?: string;
  culturalSignificance?: string;
  conservationNotes?: string;
  displayPositionId?: string;
  areaId?: string;
}

export interface ArtifactUpdateRequest {
  name?: string;
  periodTime?: string;
  description?: string;
  isOriginal?: boolean;
  weight?: number;
  height?: number;
  width?: number;
  length?: number;
}

export interface ArtifactMedia {
  id: string;
  artifactId: string;
  url: string;
  type: MediaType;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  caption?: string;
  isActive: boolean;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
}

export enum MediaType {
  IMAGE = 'Image',
  AUDIO = 'Audio',
  MODEL3D = 'Model3D',
  VIDEO = 'Video',
  DOCUMENT = 'Document',
}

// Display Position types
export interface DisplayPosition {
  id: string;
  displayPositionName: string;
  positionCode: string;
  description?: string;
  areaId: string;
  area?: Area;
  museumId: string;
  museum?: Museum;
  isActive: boolean;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DisplayPositionCreateRequest {
  displayPositionName: string;
  positionCode: string;
  description?: string;
  areaId: string;
}

export type DisplayPositionUpdateRequest = Partial<DisplayPositionCreateRequest>;

export interface DisplayPositionSearchParams extends PaginationParams {
  artifactName?: string;
  displayPositionName?: string;
  areaName?: string;
  includeDeleted?: boolean;
}

// Area types
export interface Area {
  id: string;
  name: string;
  description?: string;
  museumId: string;
  museum?: Museum;
  isActive: boolean;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AreaCreateRequest {
  name: string;
  description?: string;
}

export type AreaUpdateRequest = Partial<AreaCreateRequest>;

// Visitor types
export interface Visitor {
  id: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
  status?: string;
  nationality?: string;
  visitDate?: string;
  groupSize?: number;
  museumId: string;
  museum?: Museum;
  createdAt: string;
  updatedAt: string;
}

export interface VisitorCreateRequest {
  phoneNumber: string;
  status: string;
  name?: string;
  email?: string;
  nationality?: string;
  visitDate?: string;
  groupSize?: number;
}

export type VisitorUpdateRequest = Partial<VisitorCreateRequest>;

// Interaction types
export interface Interaction {
  id: string;
  visitorId: string;
  visitor?: Visitor;
  artifactId: string;
  artifact?: Artifact;
  interactionType: string;
  comment?: string;
  rating?: number; // 1-5 scale
  duration?: number; // in seconds
  feedback?: string;
  museumId: string;
  museum?: Museum;
  createdAt: string;
  updatedAt: string;
}

export enum InteractionType {
  VIEW = 'View',
  TOUCH = 'Touch',
  AUDIO_GUIDE = 'AudioGuide',
  QR_SCAN = 'QRScan',
  PHOTO = 'Photo',
  COMMENT = 'Comment',
}

export interface InteractionCreateRequest {
  visitorId: string;
  artifactId: string;
  interactionType: string;
  comment?: string;
  rating?: number;
  duration?: number;
  feedback?: string;
}

export type InteractionUpdateRequest = Partial<InteractionCreateRequest>;

// Search and filter types
export interface ArtifactSearchParams extends PaginationParams {
  name?: string;
  periodTime?: string;
  includeDeleted?: boolean;
  areaId?: string;
  displayPositionId?: string;
  year?: string;
  material?: string;
  condition?: string;
  isActive?: boolean;
}

export interface AreaSearchParams extends PaginationParams {
  areaName?: string;
  includeDeleted?: boolean;
}

export interface DisplayPositionSearchParams extends PaginationParams {
  artifactName?: string;
  displayPositionName?: string;
  areaName?: string;
  includeDeleted?: boolean;
}

export interface VisitorSearchParams extends PaginationParams {
  nationality?: string;
  visitDateFrom?: string;
  visitDateTo?: string;
}

export interface InteractionSearchParams extends PaginationParams {
  visitorId?: string;
  artifactId?: string;
  interactionType?: string;
  rating?: number;
}
