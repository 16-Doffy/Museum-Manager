/**
 * @fileoverview Mock Data for Visitor Portal
 * 
 * Fully synchronized mock data from museum-portal
 * Used as fallback when API is not available
 * This ensures consistency between Admin/Staff and Visitor portals
 */

export interface MockArea {
  id: string;
  name: string;
  description?: string;
  museumId?: string;
  museum?: { id: string; name: string; isActive?: boolean; createdAt?: string; updatedAt?: string };
  isActive?: boolean;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface MockArtifact {
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
  area?: { id: string; name: string; museumId?: string; isActive?: boolean; createdAt?: string; updatedAt?: string };
  museumId?: string;
  museum?: { id: string; name: string; isActive?: boolean; createdAt?: string; updatedAt?: string };
  isActive?: boolean;
  isDeleted?: boolean;
  media?: Array<{ id: string; artifactId?: string; url: string; type: 'Image' | 'Audio' | 'Model3D' | 'Video' | 'Document' }>;
  createdAt?: string;
  updatedAt?: string;
}

export interface MockDisplayPosition {
  id: string;
  displayPositionName: string;
  positionCode: string;
  description?: string;
  areaId?: string;
  area?: { id: string; name: string };
  museumId?: string;
  museum?: { id: string; name: string };
  isActive?: boolean;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface MockVisitor {
  id: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
  status?: string;
  nationality?: string;
  visitDate?: string;
  groupSize?: number;
  museumId?: string;
  museum?: { id: string; name: string };
  createdAt?: string;
  updatedAt?: string;
}

// Mock Areas - Fully synchronized with museum-portal
export const mockAreas: MockArea[] = [
  {
    id: 'area-1',
    name: 'Khu vực Cổ vật',
    description: 'Trưng bày các hiện vật từ thời kỳ cổ đại',
    museumId: 'museum-1',
    museum: { id: 'museum-1', name: 'Bảo tàng Lịch sử Việt Nam', isActive: true, createdAt: '', updatedAt: '' },
    isActive: true,
    isDeleted: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'area-2',
    name: 'Khu vực Tôn giáo',
    description: 'Trưng bày các hiện vật tôn giáo',
    museumId: 'museum-1',
    museum: { id: 'museum-1', name: 'Bảo tàng Lịch sử Việt Nam', isActive: true, createdAt: '', updatedAt: '' },
    isActive: true,
    isDeleted: false,
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
  },
  {
    id: 'area-3',
    name: 'Khu vực Gốm sứ',
    description: 'Trưng bày các hiện vật gốm sứ',
    museumId: 'museum-1',
    museum: { id: 'museum-1', name: 'Bảo tàng Lịch sử Việt Nam', isActive: true, createdAt: '', updatedAt: '' },
    isActive: true,
    isDeleted: false,
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z',
  },
  {
    id: 'area-4',
    name: 'Khu vực Nghệ thuật Đương đại',
    description: 'Trưng bày các tác phẩm nghệ thuật đương đại',
    museumId: 'museum-1',
    museum: { id: 'museum-1', name: 'Bảo tàng Lịch sử Việt Nam', isActive: true, createdAt: '', updatedAt: '' },
    isActive: true,
    isDeleted: false,
    createdAt: '2024-01-04T00:00:00Z',
    updatedAt: '2024-01-04T00:00:00Z',
  },
];

// Mock Artifacts - Fully synchronized with museum-portal (all fields included)
export const mockArtifacts: MockArtifact[] = [
  {
    id: '1',
    code: 'ART-001',
    name: 'Trống đồng Đông Sơn',
    description: 'Hiện vật cổ đại từ thời kỳ Đông Sơn',
    periodTime: 'Thế kỷ 3-1 TCN',
    year: '300-100 TCN',
    isOriginal: true,
    weight: 15.5,
    height: 45.0,
    width: 35.0,
    length: 35.0,
    areaId: 'area-1',
    area: { id: 'area-1', name: 'Khu vực Cổ vật', museumId: 'museum-1', isActive: true, createdAt: '', updatedAt: '' },
    museumId: 'museum-1',
    museum: { id: 'museum-1', name: 'Bảo tàng Lịch sử Việt Nam', isActive: true, createdAt: '', updatedAt: '' },
    isActive: true,
    isDeleted: false,
    media: [{ id: '1', artifactId: '1', url: '/api/placeholder/400/300', type: 'Image' as const }],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    code: 'ART-002',
    name: 'Tượng Phật A Di Đà',
    description: 'Tượng Phật bằng đá từ thời Lý',
    periodTime: 'Thế kỷ 11-13',
    year: '1100-1300',
    isOriginal: true,
    weight: 25.0,
    height: 80.0,
    width: 40.0,
    length: 40.0,
    areaId: 'area-2',
    area: { id: 'area-2', name: 'Khu vực Tôn giáo', museumId: 'museum-1', isActive: true, createdAt: '', updatedAt: '' },
    museumId: 'museum-1',
    museum: { id: 'museum-1', name: 'Bảo tàng Lịch sử Việt Nam', isActive: true, createdAt: '', updatedAt: '' },
    isActive: true,
    isDeleted: false,
    media: [{ id: '2', artifactId: '2', url: '/api/placeholder/400/300', type: 'Image' as const }],
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
  },
  {
    id: '3',
    code: 'ART-003',
    name: 'Bình gốm Chu Đậu',
    description: 'Bình gốm men trắng từ Chu Đậu',
    periodTime: 'Thế kỷ 15-16',
    year: '1400-1600',
    isOriginal: false,
    weight: 2.5,
    height: 25.0,
    width: 15.0,
    length: 15.0,
    areaId: 'area-3',
    area: { id: 'area-3', name: 'Khu vực Gốm sứ', museumId: 'museum-1', isActive: true, createdAt: '', updatedAt: '' },
    museumId: 'museum-1',
    museum: { id: 'museum-1', name: 'Bảo tàng Lịch sử Việt Nam', isActive: true, createdAt: '', updatedAt: '' },
    isActive: true,
    isDeleted: false,
    media: [{ id: '3', artifactId: '3', url: '/api/placeholder/400/300', type: 'Image' as const }],
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z',
  },
];

// Mock Display Positions - Fully synchronized with museum-portal
export const mockDisplayPositions: MockDisplayPosition[] = [
  {
    id: '1',
    displayPositionName: 'Vị trí A1 - Lịch sử Cổ đại',
    positionCode: 'A1-001',
    description: 'Vị trí trưng bày chính cho hiện vật lịch sử cổ đại',
    areaId: '1',
    area: { id: '1', name: 'Khu vực Lịch sử Cổ đại' },
    museumId: '1',
    museum: { id: '1', name: 'Bảo tàng Lịch sử Việt Nam' },
    isActive: true,
    isDeleted: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    displayPositionName: 'Vị trí B2 - Nghệ thuật Đương đại',
    positionCode: 'B2-002',
    description: 'Vị trí trưng bày cho tác phẩm nghệ thuật hiện đại',
    areaId: '2',
    area: { id: '2', name: 'Khu vực Nghệ thuật Đương đại' },
    museumId: '1',
    museum: { id: '1', name: 'Bảo tàng Lịch sử Việt Nam' },
    isActive: true,
    isDeleted: false,
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
  },
  {
    id: '3',
    displayPositionName: 'Vị trí C3 - Văn hóa Dân tộc',
    positionCode: 'C3-003',
    description: 'Vị trí trưng bày hiện vật văn hóa dân tộc',
    areaId: '3',
    area: { id: '3', name: 'Khu vực Văn hóa Dân tộc' },
    museumId: '1',
    museum: { id: '1', name: 'Bảo tàng Lịch sử Việt Nam' },
    isActive: false,
    isDeleted: false,
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z',
  },
];

// Mock Visitors - Fully synchronized with museum-portal
export const mockVisitors: MockVisitor[] = [
  {
    id: '1',
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@email.com',
    phoneNumber: '0123456789',
    status: 'active',
    nationality: 'Vietnamese',
    visitDate: '2024-01-15T10:00:00Z',
    groupSize: 2,
    museumId: '1',
    museum: { id: '1', name: 'Bảo tàng Lịch sử Việt Nam' },
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-15T09:00:00Z',
  },
  {
    id: '2',
    name: 'Trần Thị B',
    email: 'tranthib@email.com',
    phoneNumber: '0987654321',
    status: 'active',
    nationality: 'Vietnamese',
    visitDate: '2024-01-16T14:00:00Z',
    groupSize: 1,
    museumId: '1',
    museum: { id: '1', name: 'Bảo tàng Lịch sử Việt Nam' },
    createdAt: '2024-01-16T13:00:00Z',
    updatedAt: '2024-01-16T13:00:00Z',
  },
  {
    id: '3',
    name: 'John Smith',
    email: 'johnsmith@email.com',
    phoneNumber: '+1234567890',
    status: 'active',
    nationality: 'American',
    visitDate: '2024-01-17T11:00:00Z',
    groupSize: 3,
    museumId: '1',
    museum: { id: '1', name: 'Bảo tàng Lịch sử Việt Nam' },
    createdAt: '2024-01-17T10:00:00Z',
    updatedAt: '2024-01-17T10:00:00Z',
  },
];
