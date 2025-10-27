import { apiClient } from './client';
import { visitorEndpoints } from './endpoints';
import { Visitor, VisitorCreateRequest, VisitorUpdateRequest, PaginatedResponse, PaginationParams } from './types';

export class VisitorService {
  static async getAll(params?: PaginationParams): Promise<PaginatedResponse<Visitor>> {
    const response = await apiClient.get<PaginatedResponse<Visitor>>(
      visitorEndpoints.getAll,
      params as Record<string, string | number | boolean>
    );
    return response.data;
  }

  static async getById(id: string): Promise<Visitor> {
    const response = await apiClient.get<Visitor>(visitorEndpoints.getById(id));
    return response.data;
  }

  static async create(data: VisitorCreateRequest): Promise<Visitor> {
    const response = await apiClient.post<Visitor>(visitorEndpoints.create, data);
    return response.data;
  }

  static async update(id: string, data: VisitorUpdateRequest): Promise<Visitor> {
    const response = await apiClient.put<Visitor>(visitorEndpoints.update(id), data);
    return response.data;
  }

  static async delete(id: string): Promise<void> {
    await apiClient.delete(visitorEndpoints.delete(id));
  }
}