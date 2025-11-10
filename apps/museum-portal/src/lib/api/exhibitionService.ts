import { apiClient } from './client';
import { exhibitionEndpoints } from './endpoints';
import {
  Exhibition,
  ExhibitionCreateRequest,
  ExhibitionUpdateRequest,
  ExhibitionSearchParams,
  RemoveHistoricalContextRequest,
  PaginatedResponse,
} from './types';

export class ExhibitionService {
  static async getAll(params?: ExhibitionSearchParams): Promise<PaginatedResponse<Exhibition>> {
    const response = await apiClient.get<PaginatedResponse<Exhibition>>(
      exhibitionEndpoints.getAll,
      params as Record<string, string | number | boolean>
    );
    return response.data;
  }

  static async getById(id: string): Promise<Exhibition> {
    const response = await apiClient.get<Exhibition>(exhibitionEndpoints.getById(id));
    return response.data;
  }

  static async create(data: ExhibitionCreateRequest): Promise<Exhibition> {
    const response = await apiClient.post<Exhibition>(exhibitionEndpoints.create, data);
    return response.data;
  }

  static async update(id: string, data: ExhibitionUpdateRequest): Promise<Exhibition> {
    const response = await apiClient.put<Exhibition>(exhibitionEndpoints.update(id), data);
    return response.data;
  }

  static async delete(id: string): Promise<void> {
    await apiClient.delete(exhibitionEndpoints.delete(id));
  }

  static async removeHistoricalContexts(
    id: string,
    data: RemoveHistoricalContextRequest
  ): Promise<void> {
    await apiClient.post(exhibitionEndpoints.removeHistorical(id), data);
  }
}

