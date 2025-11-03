import { apiClient } from './client';
import { artifactEndpoints } from './endpoints';
import { Artifact, ArtifactCreateRequest, ArtifactUpdateRequest, PaginatedResponse, PaginationParams } from './types';

export class ArtifactService {
  static async getAll(params?: PaginationParams): Promise<PaginatedResponse<Artifact>> {
    const response = await apiClient.get<PaginatedResponse<Artifact>>(
      artifactEndpoints.getAll,
      params as Record<string, string | number | boolean>
    );
    return response.data;
  }

  static async getById(id: string): Promise<Artifact> {
    const response = await apiClient.get<Artifact>(artifactEndpoints.getById(id));
    return response.data;
  }

  static async create(data: ArtifactCreateRequest): Promise<Artifact> {
    const response = await apiClient.post<Artifact>(artifactEndpoints.create, data);
    return response.data;
  }

  static async update(id: string, data: ArtifactUpdateRequest): Promise<Artifact> {
    const response = await apiClient.put<Artifact>(artifactEndpoints.update(id), data);
    return response.data;
  }

  static async delete(id: string): Promise<void> {
    await apiClient.delete(artifactEndpoints.delete(id));
  }

  static async activate(id: string): Promise<Artifact> {
    const response = await apiClient.post<Artifact>(artifactEndpoints.activate(id));
    return response.data;
  }
}
