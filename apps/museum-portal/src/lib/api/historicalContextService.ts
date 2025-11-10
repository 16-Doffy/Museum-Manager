import { apiClient } from './client';
import { historicalContextEndpoints } from './endpoints';
import {
  HistoricalContext,
  HistoricalContextCreateRequest,
  HistoricalContextUpdateRequest,
  HistoricalContextSearchParams,
  AssignArtifactsRequest,
  RemoveArtifactsRequest,
  PaginatedResponse,
} from './types';

export class HistoricalContextService {
  static async getAll(
    params?: HistoricalContextSearchParams
  ): Promise<PaginatedResponse<HistoricalContext>> {
    const response = await apiClient.get<PaginatedResponse<HistoricalContext>>(
      historicalContextEndpoints.getAll,
      params as Record<string, string | number | boolean>
    );
    return response.data;
  }

  static async getById(id: string): Promise<HistoricalContext> {
    const response = await apiClient.get<HistoricalContext>(
      historicalContextEndpoints.getById(id)
    );
    return response.data;
  }

  static async create(data: HistoricalContextCreateRequest): Promise<HistoricalContext> {
    const response = await apiClient.post<HistoricalContext>(
      historicalContextEndpoints.create,
      data
    );
    return response.data;
  }

  static async update(
    id: string,
    data: HistoricalContextUpdateRequest
  ): Promise<HistoricalContext> {
    const response = await apiClient.put<HistoricalContext>(
      historicalContextEndpoints.update(id),
      data
    );
    return response.data;
  }

  static async delete(id: string): Promise<void> {
    await apiClient.delete(historicalContextEndpoints.delete(id));
  }

  static async assignArtifacts(
    historicalContextId: string,
    data: AssignArtifactsRequest
  ): Promise<void> {
    await apiClient.post(historicalContextEndpoints.assignArtifacts(historicalContextId), data);
  }

  static async removeArtifacts(
    historicalContextId: string,
    data: RemoveArtifactsRequest
  ): Promise<void> {
    await apiClient.post(historicalContextEndpoints.removeArtifacts(historicalContextId), data);
  }
}

