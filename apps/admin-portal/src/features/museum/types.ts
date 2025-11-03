export interface Museum {
  id: string;
  name: string;
  location: string;
  description: string;
  status: 'Active' | 'Inactive';
  createAt: string;
  updateAt: string | null;
}

export interface MuseumListResponse {
  items: Museum[];
  totalItems: number;
  pageIndex: number;
  totalPages: number;
  pageSize: number;
}

export interface MuseumListParams {
  pageIndex?: number;
  pageSize?: number;
  Status?: 'Active' | 'Inactive';
}

export interface CreateMuseumRequest {
  name: string;
  location: string;
  description: string;
}

export interface UpdateMuseumRequest {
  name: string;
  location: string;
  description: string;
}

