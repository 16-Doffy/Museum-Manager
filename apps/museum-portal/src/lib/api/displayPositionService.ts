import { apiClient } from './client';
import { displayPositionEndpoints } from './endpoints';
import { DisplayPosition, DisplayPositionCreateRequest, DisplayPositionUpdateRequest, PaginatedResponse, PaginationParams } from './types';

export class DisplayPositionService {
  static async getAll(params?: PaginationParams): Promise<PaginatedResponse<DisplayPosition>> {
    const response = await apiClient.get<PaginatedResponse<DisplayPosition>>(
      displayPositionEndpoints.getAll,
      params as Record<string, string | number | boolean>
    );
    return response.data;
  }

  static async getById(id: string): Promise<DisplayPosition> {
    const response = await apiClient.get<DisplayPosition>(displayPositionEndpoints.getById(id));
    return response.data;
  }

  static async create(data: DisplayPositionCreateRequest): Promise<DisplayPosition> {
    const response = await apiClient.post<DisplayPosition>(displayPositionEndpoints.create, data);
    return response.data;
  }

  static async update(id: string, data: DisplayPositionUpdateRequest): Promise<DisplayPosition> {
    const response = await apiClient.patch<DisplayPosition>(displayPositionEndpoints.update(id), data);
    return response.data;
  }

  static async delete(id: string): Promise<void> {
    await apiClient.delete(displayPositionEndpoints.delete(id));
  }

  static async activate(id: string): Promise<DisplayPosition> {
    const response = await apiClient.patch<DisplayPosition>(displayPositionEndpoints.activate(id));
    return response.data;
  }
}