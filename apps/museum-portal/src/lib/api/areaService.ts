import { apiClient } from './client';
import { areaEndpoints } from './endpoints';
import { Area, AreaCreateRequest, AreaUpdateRequest, PaginatedResponse, PaginationParams } from './types';

export class AreaService {
  static async getAll(params?: PaginationParams): Promise<PaginatedResponse<Area>> {
    const response = await apiClient.get<PaginatedResponse<Area>>(
      areaEndpoints.getAll,
      params as Record<string, string | number | boolean>
    );
    return response.data;
  }

  static async getById(id: string): Promise<Area> {
    const response = await apiClient.get<Area>(areaEndpoints.getById(id));
    return response.data;
  }

  static async create(data: AreaCreateRequest): Promise<Area> {
    const response = await apiClient.post<Area>(areaEndpoints.create, data);
    return response.data;
  }

  static async update(id: string, data: AreaUpdateRequest): Promise<Area> {
    const response = await apiClient.patch<Area>(areaEndpoints.update(id), data);
    return response.data;
  }

  static async delete(id: string): Promise<void> {
    await apiClient.delete(areaEndpoints.delete(id));
  }

  static async activate(id: string): Promise<Area> {
    const response = await apiClient.patch<Area>(areaEndpoints.activate(id));
    return response.data;
  }
}