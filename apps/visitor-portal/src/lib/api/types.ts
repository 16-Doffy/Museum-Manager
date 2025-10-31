export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    pageIndex: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

// API Response wrapper (museum-portal format)
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface ArtifactMedia {
  id: string;
  artifactId: string;
  url: string;
  type: 'Image' | 'Audio' | 'Model3D' | 'Video' | 'Document';
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  caption?: string;
  isActive: boolean;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
}

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

export interface Artifact {
  id: string;
  code: string;
  name: string;
  description?: string;
  periodTime?: string;
  year?: string;
  isOriginal?: boolean;
  weight?: number;
  height?: number;
  width?: number;
  length?: number;
  areaId?: string;
  area?: Area;
  museumId: string;
  museum?: Museum;
  media?: ArtifactMedia[];
  isActive: boolean;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
}


