/**
 * @fileoverview Custom Hooks for Museum Portal API
 * 
 * React hooks for API operations with loading states and error handling
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from './client';
import { artifactEndpoints, displayPositionEndpoints, areaEndpoints, visitorEndpoints, interactionEndpoints, museumEndpoints, exhibitionEndpoints, historicalContextEndpoints, dashboardAdminEndpoints } from './endpoints';
// Removed mock data and StorageManager imports - using real API now
import { accountEndpoints } from './endpoints';
import {
  Artifact,
  ArtifactCreateRequest,
  ArtifactUpdateRequest,
  ArtifactSearchParams,
  DisplayPosition,
  DisplayPositionCreateRequest,
  DisplayPositionUpdateRequest,
  DisplayPositionSearchParams,
  Area,
  AreaCreateRequest,
  AreaUpdateRequest,
  AreaSearchParams,
  Visitor,
  VisitorCreateRequest,
  VisitorUpdateRequest,
  VisitorSearchParams,
  Interaction,
  InteractionCreateRequest,
  InteractionUpdateRequest,
  InteractionSearchParams,
  Museum,
  Account,
  AccountCreateRequest,
  AccountUpdateRequest,
  AccountSearchParams,
  PaginatedResponse,
  PaginationParams,
  Exhibition,
  ExhibitionCreateRequest,
  ExhibitionUpdateRequest,
  ExhibitionSearchParams,
  HistoricalContext,
  HistoricalContextCreateRequest,
  HistoricalContextUpdateRequest,
  HistoricalContextSearchParams,
  HistoricalContextStatus,
  ArtifactStats,
  StaffStats,
} from './types';

// Helper function to handle error types
function getErrorMessage(err: unknown): string {
  if (err instanceof Error) {
    return err.message;
  }
  if (typeof err === 'string') {
    return err;
  }
  return 'An error occurred';
}

// Generic hook for API operations
function useApiCall<T>() {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (apiCall: () => Promise<T>) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
      return result;
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, execute };
}

// Normalize API artifact to internal shape (handles casing and different field names)
function normalizeArtifact(raw: any): Artifact {
  if (!raw) return raw as Artifact;
  const mediaRaw = raw.media || raw.medias || raw.artifactMedias || raw.mediantens || [];
  const media = Array.isArray(mediaRaw)
    ? mediaRaw.map((m: any) => ({
        id: m.id,
        artifactId: m.artifactId || raw.id,
        url: m.url || m.filePath,
        type: m.type || m.mediaType,
        fileName: m.fileName,
        fileSize: m.fileSize,
        mimeType: m.mimeType,
        caption: m.caption,
        isActive: m.isActive ?? true,
        isDeleted: m.isDeleted ?? false,
        createdAt: m.createdAt || raw.createdAt,
        updatedAt: m.updatedAt || raw.updatedAt,
      }))
    : [];

  return {
    id: raw.id,
    code: raw.code || raw.artifactcode || raw.artifactCode || '',
    name: raw.name,
    periodTime: raw.periodTime || raw.periodtime,
    description: raw.description,
    isOriginal: raw.isOriginal ?? raw.isoriginal,
    weight: raw.weight,
    height: raw.height,
    width: raw.width,
    length: raw.length,
    year: raw.year,
    origin: raw.origin,
    material: raw.material,
    dimensions: raw.dimensions,
    condition: raw.condition,
    acquisitionDate: raw.acquisitionDate,
    acquisitionMethod: raw.acquisitionMethod,
    provenance: raw.provenance,
    culturalSignificance: raw.culturalSignificance,
    conservationNotes: raw.conservationNotes,
    displayPositionId: raw.displayPositionId,
    displayPosition: raw.displayPosition,
    areaId: raw.areaId,
    area: raw.area || (raw.areaName ? { id: raw.areaId, name: raw.areaName } : undefined),
    museumId: raw.museumId,
    museum: raw.museum,
    isActive: raw.isActive ?? raw.status === 'Active',
    isDeleted: raw.isDeleted ?? false,
    media,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  } as Artifact;
}

function normalizeHistoricalContext(raw: any): HistoricalContext {
  if (!raw) return raw as HistoricalContext;

  const status =
    raw.status ??
    (raw.isDeleted ? HistoricalContextStatus.DELETED : HistoricalContextStatus.ACTIVE);

  return {
    id: raw.id ?? raw.historicalContextId ?? '',
    title: raw.title ?? '',
    period: raw.period ?? raw.periodTime,
    description: raw.description ?? raw.note,
    status,
    artifacts: Array.isArray(raw.artifacts)
      ? raw.artifacts.map((artifact: any) => normalizeArtifact(artifact))
      : [],
    museumId: raw.museumId,
    museum: raw.museum,
    createdAt: raw.createdAt ?? '',
    updatedAt: raw.updatedAt ?? '',
  } as HistoricalContext;
}

// Artifact Management Hooks
export function useArtifacts(searchParams?: ArtifactSearchParams) {
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
  });

  const fetchArtifacts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params: Record<string, string | number | boolean> = {
        pageIndex: searchParams?.pageIndex || 1,
        pageSize: searchParams?.pageSize || 10,
      };
      
      if (searchParams?.name) params.name = searchParams.name;
      if (searchParams?.periodTime) params.periodTime = searchParams.periodTime;
      if (searchParams?.includeDeleted !== undefined) params.includeDeleted = searchParams.includeDeleted;
      
      const response = await apiClient.get<PaginatedResponse<Artifact>>(artifactEndpoints.getAll, params);
      
      // API client already extracts data field, so response.data is { items: [], pagination: {} }
      if (response.data && typeof response.data === 'object' && 'items' in response.data) {
        const paginatedData = response.data as PaginatedResponse<Artifact>;
        const mapped = (paginatedData.items as any[]).map(normalizeArtifact);
        // Enrich with details for missing fields (width/height/length/area)
        const needDetail = mapped.filter(a => a.width === undefined && a.height === undefined && a.length === undefined || !a.area?.name);
        if (needDetail.length > 0) {
          try {
            const details = await Promise.all(
              needDetail.map(a => apiClient.get<Artifact>(artifactEndpoints.getById(a.id)).then(r => normalizeArtifact(r.data as any)))
            );
            const detailMap = new Map(details.map(d => [d.id, d]));
            const merged = mapped.map(a => detailMap.has(a.id) ? { ...a, ...detailMap.get(a.id)! } : a);
            setArtifacts(merged);
          } catch {
            setArtifacts(mapped || []);
          }
        } else {
          setArtifacts(mapped || []);
        }
        setPagination(paginatedData.pagination || {
          pageIndex: 1,
          pageSize: 10,
          totalItems: 0,
          totalPages: 0,
        });
      } else if (Array.isArray(response.data)) {
        // Fallback: if API returns array directly
        const mapped = (response.data as any[]).map(normalizeArtifact);
        setArtifacts(mapped);
        setPagination({
          pageIndex: 1,
          pageSize: response.data.length || 10,
          totalItems: response.data.length || 0,
          totalPages: 1,
        });
      } else {
        setArtifacts([]);
        setPagination({ pageIndex: 1, pageSize: 10, totalItems: 0, totalPages: 0 });
      }
    } catch (err: unknown) {
      const errorMsg = getErrorMessage(err);
      // Gracefully handle 401/403 - set empty list instead of crashing
      if (typeof err === 'object' && err !== null && 'statusCode' in err && ((err as any).statusCode === 401 || (err as any).statusCode === 403)) {
        setArtifacts([]);
        setPagination({ pageIndex: 1, pageSize: 10, totalItems: 0, totalPages: 0 });
      } else {
        setError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  }, [searchParams?.pageIndex, searchParams?.pageSize, searchParams?.name, searchParams?.periodTime, searchParams?.includeDeleted]);

  useEffect(() => {
    fetchArtifacts();
  }, [fetchArtifacts]);

  const createArtifact = useCallback(async (data: ArtifactCreateRequest) => {
    try {
      const response = await apiClient.post<Artifact>(artifactEndpoints.create, data);
      await fetchArtifacts(); // Refresh list
      return normalizeArtifact(response.data as any);
    } catch (err: unknown) {
      throw new Error(getErrorMessage(err));
    }
  }, [fetchArtifacts]);

  const updateArtifact = useCallback(async (id: string, data: ArtifactUpdateRequest) => {
    try {
      const response = await apiClient.patch<Artifact>(artifactEndpoints.update(id), data);
      await fetchArtifacts(); // Refresh list
      return normalizeArtifact(response.data as any);
    } catch (err: unknown) {
      throw new Error(getErrorMessage(err));
    }
  }, [fetchArtifacts]);

  const deleteArtifact = useCallback(async (id: string) => {
    try {
      await apiClient.delete(artifactEndpoints.delete(id));
      await fetchArtifacts(); // Refresh list
    } catch (err: unknown) {
      throw new Error(getErrorMessage(err));
    }
  }, [fetchArtifacts]);

  const activateArtifact = useCallback(async (id: string) => {
    try {
      const response = await apiClient.patch<Artifact>(artifactEndpoints.activate(id));
      await fetchArtifacts(); // Refresh list
      return normalizeArtifact(response.data as any);
    } catch (err: unknown) {
      throw new Error(getErrorMessage(err));
    }
  }, [fetchArtifacts]);

  const assignArtifactToDisplay = useCallback(async (artifactId: string, displayPositionId: string) => {
    try {
      const response = await apiClient.patch<Artifact>(
        artifactEndpoints.assignDisplayPosition(artifactId, displayPositionId)
      );
      await fetchArtifacts();
      return normalizeArtifact(response.data as any);
    } catch (err: unknown) {
      throw new Error(getErrorMessage(err));
    }
  }, [fetchArtifacts]);

  const removeArtifactDisplay = useCallback(async (artifactId: string) => {
    try {
      const response = await apiClient.patch<Artifact>(artifactEndpoints.removeDisplayPosition(artifactId));
      await fetchArtifacts();
      return normalizeArtifact(response.data as any);
    } catch (err: unknown) {
      throw new Error(getErrorMessage(err));
    }
  }, [fetchArtifacts]);

  const addArtifactMedia = useCallback(async (artifactId: string, file: File, caption?: string) => {
    try {
      const form = new FormData();
      form.append('File', file);
      if (caption) form.append('Caption', caption);
      const response = await apiClient.uploadFile<any>(artifactEndpoints.addMedia(artifactId), form);
      const payload = (response.data && typeof response.data === 'object' && 'data' in response.data)
        ? (response.data as any).data
        : response.data;
      await fetchArtifacts();
      return normalizeArtifact(payload as any);
    } catch (err: unknown) {
      throw new Error(getErrorMessage(err));
    }
  }, [fetchArtifacts]);

  const updateArtifactMedia = useCallback(async (artifactId: string, mediaId: string, file?: File, caption?: string) => {
    try {
      const form = new FormData();
      if (file) form.append('File', file);
      if (caption) form.append('Caption', caption);
      // Swagger requires PUT multipart for update media
      const response = await apiClient.uploadMultipart<any>(
        artifactEndpoints.updateMedia(artifactId, mediaId),
        form,
        'PUT'
      );
      await fetchArtifacts();
      const payload = (response.data && typeof response.data === 'object' && 'data' in response.data)
        ? (response.data as any).data
        : response.data;
      return normalizeArtifact(payload as any);
    } catch (err: unknown) {
      throw new Error(getErrorMessage(err));
    }
  }, [fetchArtifacts]);

  const deleteArtifactMedia = useCallback(async (artifactId: string, mediaId: string) => {
    try {
      const response = await apiClient.delete<Artifact>(artifactEndpoints.deleteMedia(artifactId, mediaId));
      await fetchArtifacts();
      return normalizeArtifact(response.data as any);
    } catch (err: unknown) {
      throw new Error(getErrorMessage(err));
    }
  }, [fetchArtifacts]);

  return {
    artifacts,
    loading,
    error,
    pagination,
    fetchArtifacts,
    createArtifact,
    updateArtifact,
    deleteArtifact,
    activateArtifact,
    assignArtifactToDisplay,
    removeArtifactDisplay,
    addArtifactMedia,
    updateArtifactMedia,
    deleteArtifactMedia,
  };
}

export function useArtifact(id: string) {
  const { data: artifact, loading, error, execute } = useApiCall<Artifact>();

  const fetchArtifact = useCallback(() => {
    return execute(() => apiClient.get<Artifact>(artifactEndpoints.getById(id)).then(r => normalizeArtifact(r.data as any)));
  }, [id, execute]);

  useEffect(() => {
    if (id) {
      fetchArtifact();
    }
  }, [id, fetchArtifact]);

  return { artifact, loading, error, refetch: fetchArtifact };
}

// Display Position Management Hooks
export function useDisplayPositions(searchParams?: DisplayPositionSearchParams) {
  const [displayPositions, setDisplayPositions] = useState<DisplayPosition[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
  });

  const fetchDisplayPositions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params: Record<string, string | number | boolean> = {
        pageIndex: searchParams?.pageIndex || 1,
        pageSize: searchParams?.pageSize || 10,
      };
      
      if (searchParams?.artifactName) params.artifactName = searchParams.artifactName;
      if (searchParams?.displayPositionName) params.displayPositionName = searchParams.displayPositionName;
      if (searchParams?.areaName) params.areaName = searchParams.areaName;
      if (searchParams?.includeDeleted !== undefined) params.includeDeleted = searchParams.includeDeleted;
      
      const response = await apiClient.get<PaginatedResponse<DisplayPosition>>(displayPositionEndpoints.getAll, params);
      
      // API client already extracts data field
      if (response.data && typeof response.data === 'object' && 'items' in response.data) {
        const paginatedData = response.data as PaginatedResponse<DisplayPosition>;
        setDisplayPositions(paginatedData.items || []);
        setPagination(paginatedData.pagination || {
          pageIndex: 1,
          pageSize: 10,
          totalItems: 0,
          totalPages: 0,
        });
      } else if (Array.isArray(response.data)) {
        setDisplayPositions(response.data);
        setPagination({
          pageIndex: 1,
          pageSize: response.data.length || 10,
          totalItems: response.data.length || 0,
          totalPages: 1,
        });
      } else {
        setDisplayPositions([]);
        setPagination({ pageIndex: 1, pageSize: 10, totalItems: 0, totalPages: 0 });
      }
    } catch (err: unknown) {
      const errorMsg = getErrorMessage(err);
      if (typeof err === 'object' && err !== null && 'statusCode' in err && ((err as any).statusCode === 401 || (err as any).statusCode === 403)) {
        setDisplayPositions([]);
        setPagination({ pageIndex: 1, pageSize: 10, totalItems: 0, totalPages: 0 });
      } else {
        setError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  }, [searchParams?.pageIndex, searchParams?.pageSize, searchParams?.artifactName, searchParams?.displayPositionName, searchParams?.areaName, searchParams?.includeDeleted]);

  useEffect(() => {
    fetchDisplayPositions();
  }, [fetchDisplayPositions]);

  const createDisplayPosition = useCallback(async (data: DisplayPositionCreateRequest) => {
    try {
      const response = await apiClient.post<DisplayPosition>(displayPositionEndpoints.create, data);
      await fetchDisplayPositions(); // Refresh list
      return response.data;
    } catch (err: unknown) {
      throw new Error(getErrorMessage(err));
    }
  }, [fetchDisplayPositions]);

  const updateDisplayPosition = useCallback(async (id: string, data: DisplayPositionUpdateRequest) => {
    try {
      const response = await apiClient.patch<DisplayPosition>(displayPositionEndpoints.update(id), data);
      await fetchDisplayPositions(); // Refresh list
      return response.data;
    } catch (err: unknown) {
      throw new Error(getErrorMessage(err));
    }
  }, [fetchDisplayPositions]);

  const deleteDisplayPosition = useCallback(async (id: string) => {
    try {
      await apiClient.delete(displayPositionEndpoints.delete(id));
      await fetchDisplayPositions(); // Refresh list
    } catch (err: unknown) {
      throw new Error(getErrorMessage(err));
    }
  }, [fetchDisplayPositions]);

  const activateDisplayPosition = useCallback(async (id: string) => {
    try {
      const response = await apiClient.patch<DisplayPosition>(displayPositionEndpoints.activate(id));
      // Force refresh by calling fetchDisplayPositions directly
      await fetchDisplayPositions();
      return response.data;
    } catch (err: unknown) {
      throw new Error(getErrorMessage(err));
    }
  }, [fetchDisplayPositions]);

  const maintainDisplayPosition = useCallback(async (id: string) => {
    try {
      const response = await apiClient.patch<DisplayPosition>(displayPositionEndpoints.maintain(id));
      // Force refresh by calling fetchDisplayPositions directly
      await fetchDisplayPositions();
      return response.data;
    } catch (err: unknown) {
      throw new Error(getErrorMessage(err));
    }
  }, [fetchDisplayPositions]);

  return {
    displayPositions,
    loading,
    error,
    pagination,
    fetchDisplayPositions,
    createDisplayPosition,
    updateDisplayPosition,
    deleteDisplayPosition,
    activateDisplayPosition,
    maintainDisplayPosition,
  };
}

// Area Management Hooks
export function useAreas(searchParams?: AreaSearchParams) {
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
  });

  const fetchAreas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params: Record<string, string | number | boolean> = {
        pageIndex: searchParams?.pageIndex || 1,
        pageSize: searchParams?.pageSize || 10,
      };
      
      if (searchParams?.areaName) params.areaName = searchParams.areaName;
      if (searchParams?.includeDeleted !== undefined) params.includeDeleted = searchParams.includeDeleted;
      
      const response = await apiClient.get<PaginatedResponse<Area>>(areaEndpoints.getAll, params);
      
      // API client already extracts data field
      if (response.data && typeof response.data === 'object' && 'items' in response.data) {
        const paginatedData = response.data as PaginatedResponse<Area>;
        setAreas(paginatedData.items || []);
        setPagination(paginatedData.pagination || {
          pageIndex: 1,
          pageSize: 10,
          totalItems: 0,
          totalPages: 0,
        });
      } else if (Array.isArray(response.data)) {
        setAreas(response.data);
        setPagination({
          pageIndex: 1,
          pageSize: response.data.length || 10,
          totalItems: response.data.length || 0,
          totalPages: 1,
        });
      } else {
        setAreas([]);
        setPagination({ pageIndex: 1, pageSize: 10, totalItems: 0, totalPages: 0 });
      }
    } catch (err: unknown) {
      const errorMsg = getErrorMessage(err);
      if (typeof err === 'object' && err !== null && 'statusCode' in err && ((err as any).statusCode === 401 || (err as any).statusCode === 403)) {
        setAreas([]);
        setPagination({ pageIndex: 1, pageSize: 10, totalItems: 0, totalPages: 0 });
      } else {
        setError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  }, [searchParams?.pageIndex, searchParams?.pageSize, searchParams?.areaName, searchParams?.includeDeleted]);

  useEffect(() => {
    fetchAreas();
  }, [fetchAreas]);

  const createArea = useCallback(async (data: AreaCreateRequest) => {
    try {
      const response = await apiClient.post<Area>(areaEndpoints.create, data);
      await fetchAreas(); // Refresh list
      return response.data;
    } catch (err: unknown) {
      throw new Error(getErrorMessage(err));
    }
  }, [fetchAreas]);

  const updateArea = useCallback(async (id: string, data: AreaUpdateRequest) => {
    try {
      const response = await apiClient.patch<Area>(areaEndpoints.update(id), data);
      await fetchAreas(); // Refresh list
      return response.data;
    } catch (err: unknown) {
      throw new Error(getErrorMessage(err));
    }
  }, [fetchAreas]);

  const deleteArea = useCallback(async (id: string) => {
    try {
      await apiClient.delete(areaEndpoints.delete(id));
      await fetchAreas(); // Refresh list
    } catch (err: unknown) {
      throw new Error(getErrorMessage(err));
    }
  }, [fetchAreas]);

  return {
    areas,
    loading,
    error,
    pagination,
    fetchAreas,
    createArea,
    updateArea,
    deleteArea,
  };
}

// Visitor Management Hooks
export function useVisitors(searchParams?: VisitorSearchParams) {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
  });

  const fetchVisitors = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Visitor API returns array directly (no pagination)
      const response = await apiClient.get<Visitor[]>(visitorEndpoints.getAll);
      
      // API response format: { code, statusCode, message, data: Visitor[] }
      let visitorsList: Visitor[] = [];
      if (Array.isArray(response.data)) {
        visitorsList = response.data;
      } else if (response.data && typeof response.data === 'object' && 'data' in response.data) {
        const data = (response.data as any).data;
        visitorsList = Array.isArray(data) ? data : [];
      }
      
      setVisitors(visitorsList);
      setPagination({
        pageIndex: 1,
        pageSize: visitorsList.length || 10,
        totalItems: visitorsList.length || 0,
        totalPages: 1,
      });
    } catch (err: unknown) {
      const errorMsg = getErrorMessage(err);
      if (typeof err === 'object' && err !== null && 'statusCode' in err && ((err as any).statusCode === 401 || (err as any).statusCode === 403)) {
        setVisitors([]);
        setPagination({ pageIndex: 1, pageSize: 10, totalItems: 0, totalPages: 0 });
      } else {
        setError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVisitors();
  }, [fetchVisitors]);

  const createVisitor = useCallback(async (data: VisitorCreateRequest) => {
    try {
      const response = await apiClient.post<Visitor>(visitorEndpoints.create, data);
      await fetchVisitors(); // Refresh list
      return response.data;
    } catch (err: unknown) {
      throw new Error(getErrorMessage(err));
    }
  }, [fetchVisitors]);

  const updateVisitor = useCallback(async (id: string, data: VisitorUpdateRequest) => {
    try {
      const response = await apiClient.put<Visitor>(visitorEndpoints.update(id), data);
      await fetchVisitors(); // Refresh list
      return response.data;
    } catch (err: unknown) {
      throw new Error(getErrorMessage(err));
    }
  }, [fetchVisitors]);

  const deleteVisitor = useCallback(async (id: string) => {
    try {
      await apiClient.delete(visitorEndpoints.delete(id));
      await fetchVisitors(); // Refresh list
    } catch (err: unknown) {
      throw new Error(getErrorMessage(err));
    }
  }, [fetchVisitors]);

  return {
    visitors,
    loading,
    error,
    pagination,
    fetchVisitors,
    createVisitor,
    updateVisitor,
    deleteVisitor,
  };
}

// Interaction Management Hooks
export function useInteractions(searchParams?: InteractionSearchParams) {
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
  });

  const fetchInteractions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Interaction API returns array directly (no pagination)
      const response = await apiClient.get<Interaction[]>(interactionEndpoints.getAll);
      
      // API response format: { code, statusCode, message, data: Interaction[] }
      let interactionsList: Interaction[] = [];
      if (Array.isArray(response.data)) {
        interactionsList = response.data;
      } else if (response.data && typeof response.data === 'object' && 'data' in response.data) {
        const data = (response.data as any).data;
        interactionsList = Array.isArray(data) ? data : [];
      }
      
      setInteractions(interactionsList);
      setPagination({
        pageIndex: 1,
        pageSize: interactionsList.length || 10,
        totalItems: interactionsList.length || 0,
        totalPages: 1,
      });
    } catch (err: unknown) {
      const errorMsg = getErrorMessage(err);
      if (typeof err === 'object' && err !== null && 'statusCode' in err && ((err as any).statusCode === 401 || (err as any).statusCode === 403)) {
        setInteractions([]);
        setPagination({ pageIndex: 1, pageSize: 10, totalItems: 0, totalPages: 0 });
      } else {
        setError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInteractions();
  }, [fetchInteractions]);

  const createInteraction = useCallback(async (data: InteractionCreateRequest) => {
    try {
      const response = await apiClient.post<Interaction>(interactionEndpoints.create, data);
      await fetchInteractions(); // Refresh list
      return response.data;
    } catch (err: unknown) {
      throw new Error(getErrorMessage(err));
    }
  }, [fetchInteractions]);

  const updateInteraction = useCallback(async (id: string, data: InteractionUpdateRequest) => {
    try {
      const response = await apiClient.put<Interaction>(interactionEndpoints.update(id), data);
      await fetchInteractions(); // Refresh list
      return response.data;
    } catch (err: unknown) {
      throw new Error(getErrorMessage(err));
    }
  }, [fetchInteractions]);

  const deleteInteraction = useCallback(async (id: string) => {
    try {
      await apiClient.delete(interactionEndpoints.delete(id));
      await fetchInteractions(); // Refresh list
    } catch (err: unknown) {
      throw new Error(getErrorMessage(err));
    }
  }, [fetchInteractions]);

  const getInteractionById = useCallback(async (id: string): Promise<Interaction> => {
    try {
      const response = await apiClient.get<Interaction>(interactionEndpoints.getById(id));
      return response.data;
    } catch (err: unknown) {
      throw new Error(getErrorMessage(err));
    }
  }, []);

  return {
    interactions,
    loading,
    error,
    pagination,
    fetchInteractions,
    createInteraction,
    updateInteraction,
    deleteInteraction,
    getInteractionById,
  };
}

// Museum Management Hook
export function useMuseum(id: string) {
  const { data: museum, loading, error, execute } = useApiCall<Museum>();

  const fetchMuseum = useCallback(async () => {
    if (!id) {
      // Fallback: try infer museum from first area when museumId missing
      try {
        const areasResp = await apiClient.get<PaginatedResponse<Area>>(areaEndpoints.getAll, {
          pageIndex: 1,
          pageSize: 1,
        });
        const firstArea = (areasResp.data as any)?.items?.[0];
        if (firstArea?.museum) {
          return execute(async () => firstArea.museum as Museum);
        }
      } catch {
        // ignore
      }
      return;
    }

    return execute(() => apiClient.get<Museum>(museumEndpoints.getById(id)).then(r => r.data));
  }, [id, execute]);

  useEffect(() => {
    fetchMuseum();
  }, [fetchMuseum]);

  return { museum, loading, error, refetch: fetchMuseum };
}

// Get all museums (for SuperAdmin/Admin)
export function useMuseums() {
  const [museums, setMuseums] = useState<Museum[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMuseums = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get<PaginatedResponse<Museum>>(museumEndpoints.getAll, {
        pageIndex: 1,
        pageSize: 100,
      });
      
      if (response.data && typeof response.data === 'object' && 'items' in response.data) {
        const paginatedData = response.data as PaginatedResponse<Museum>;
        setMuseums(paginatedData.items || []);
      } else if (Array.isArray(response.data)) {
        setMuseums(response.data);
      } else {
        setMuseums([]);
      }
    } catch (err: unknown) {
      const errorMsg = getErrorMessage(err);
      // Gracefully handle 401/403 - set empty list
      if (typeof err === 'object' && err !== null && 'statusCode' in err && ((err as any).statusCode === 401 || (err as any).statusCode === 403)) {
        setMuseums([]);
      } else {
        setError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMuseums();
  }, [fetchMuseums]);

  return { museums, loading, error, refetch: fetchMuseums };
}

// Exhibition Management Hooks
export function useExhibitions(searchParams?: ExhibitionSearchParams) {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
  });

  const fetchExhibitions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params: Record<string, string | number | boolean> = {
        pageIndex: searchParams?.pageIndex || 1,
        pageSize: searchParams?.pageSize || 10,
      };
      
      if (searchParams?.name) params.name = searchParams.name;
      if (searchParams?.statusFilter) params.statusFilter = searchParams.statusFilter;
      
      const response = await apiClient.get<PaginatedResponse<Exhibition>>(exhibitionEndpoints.getAll, params);
      
      if (response.data && typeof response.data === 'object' && 'items' in response.data) {
        const paginatedData = response.data as PaginatedResponse<Exhibition>;
        setExhibitions(paginatedData.items || []);
        setPagination(paginatedData.pagination || {
          pageIndex: 1,
          pageSize: 10,
          totalItems: 0,
          totalPages: 0,
        });
      } else if (Array.isArray(response.data)) {
        setExhibitions(response.data);
        setPagination({
          pageIndex: 1,
          pageSize: response.data.length || 10,
          totalItems: response.data.length || 0,
          totalPages: 1,
        });
      } else {
        setExhibitions([]);
        setPagination({ pageIndex: 1, pageSize: 10, totalItems: 0, totalPages: 0 });
      }
    } catch (err: unknown) {
      const errorMsg = getErrorMessage(err);
      if (typeof err === 'object' && err !== null && 'statusCode' in err && ((err as any).statusCode === 401 || (err as any).statusCode === 403)) {
        setExhibitions([]);
        setPagination({ pageIndex: 1, pageSize: 10, totalItems: 0, totalPages: 0 });
      } else {
        setError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  }, [searchParams?.pageIndex, searchParams?.pageSize, searchParams?.name, searchParams?.statusFilter]);

  useEffect(() => {
    fetchExhibitions();
  }, [fetchExhibitions]);

  const createExhibition = useCallback(async (data: ExhibitionCreateRequest) => {
    try {
      const response = await apiClient.post<Exhibition>(exhibitionEndpoints.create, data);
      await fetchExhibitions();
      return response.data;
    } catch (err: unknown) {
      throw new Error(getErrorMessage(err));
    }
  }, [fetchExhibitions]);

  const updateExhibition = useCallback(async (id: string, data: ExhibitionUpdateRequest) => {
    try {
      const response = await apiClient.put<Exhibition>(exhibitionEndpoints.update(id), data);
      await fetchExhibitions();
      return response.data;
    } catch (err: unknown) {
      throw new Error(getErrorMessage(err));
    }
  }, [fetchExhibitions]);

  const deleteExhibition = useCallback(async (id: string) => {
    try {
      await apiClient.delete(exhibitionEndpoints.delete(id));
      await fetchExhibitions();
    } catch (err: unknown) {
      throw new Error(getErrorMessage(err));
    }
  }, [fetchExhibitions]);

  return {
    exhibitions,
    loading,
    error,
    pagination,
    fetchExhibitions,
    createExhibition,
    updateExhibition,
    deleteExhibition,
  };
}

// Historical Context Management Hooks
export function useHistoricalContexts(searchParams?: HistoricalContextSearchParams) {
  const [historicalContexts, setHistoricalContexts] = useState<HistoricalContext[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
  });

  const fetchHistoricalContexts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params: Record<string, string | number | boolean> = {
        pageIndex: searchParams?.pageIndex || 1,
        pageSize: searchParams?.pageSize || 10,
      };
      
      if (searchParams?.title) params.title = searchParams.title;
      if (searchParams?.statusFilter) params.statusFilter = searchParams.statusFilter;
      
      const response = await apiClient.get<PaginatedResponse<HistoricalContext>>(historicalContextEndpoints.getAll, params);
      
      if (response.data && typeof response.data === 'object' && 'items' in response.data) {
        const paginatedData = response.data as PaginatedResponse<HistoricalContext>;
        const normalizedItems = (paginatedData.items as any[]).map(normalizeHistoricalContext);
        setHistoricalContexts(normalizedItems);
        setPagination(paginatedData.pagination || {
          pageIndex: 1,
          pageSize: 10,
          totalItems: 0,
          totalPages: 0,
        });
      } else if (Array.isArray(response.data)) {
        const normalizedItems = (response.data as any[]).map(normalizeHistoricalContext);
        setHistoricalContexts(normalizedItems);
        setPagination({
          pageIndex: 1,
          pageSize: response.data.length || 10,
          totalItems: response.data.length || 0,
          totalPages: 1,
        });
      } else {
        setHistoricalContexts([]);
        setPagination({ pageIndex: 1, pageSize: 10, totalItems: 0, totalPages: 0 });
      }
    } catch (err: unknown) {
      const errorMsg = getErrorMessage(err);
      if (typeof err === 'object' && err !== null && 'statusCode' in err && ((err as any).statusCode === 401 || (err as any).statusCode === 403)) {
        setHistoricalContexts([]);
        setPagination({ pageIndex: 1, pageSize: 10, totalItems: 0, totalPages: 0 });
      } else {
        setError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  }, [searchParams?.pageIndex, searchParams?.pageSize, searchParams?.title, searchParams?.statusFilter]);

  useEffect(() => {
    fetchHistoricalContexts();
  }, [fetchHistoricalContexts]);

  const createHistoricalContext = useCallback(async (data: HistoricalContextCreateRequest) => {
    try {
      const response = await apiClient.post<HistoricalContext>(historicalContextEndpoints.create, data);
      await fetchHistoricalContexts();
      return normalizeHistoricalContext(response.data as any);
    } catch (err: unknown) {
      throw new Error(getErrorMessage(err));
    }
  }, [fetchHistoricalContexts]);

  const updateHistoricalContext = useCallback(async (id: string, data: HistoricalContextUpdateRequest) => {
    try {
      const response = await apiClient.put<HistoricalContext>(historicalContextEndpoints.update(id), data);
      await fetchHistoricalContexts();
      return normalizeHistoricalContext(response.data as any);
    } catch (err: unknown) {
      throw new Error(getErrorMessage(err));
    }
  }, [fetchHistoricalContexts]);

  const deleteHistoricalContext = useCallback(async (id: string) => {
    try {
      await apiClient.delete(historicalContextEndpoints.delete(id));
      await fetchHistoricalContexts();
    } catch (err: unknown) {
      throw new Error(getErrorMessage(err));
    }
  }, [fetchHistoricalContexts]);

  return {
    historicalContexts,
    loading,
    error,
    pagination,
    fetchHistoricalContexts,
    createHistoricalContext,
    updateHistoricalContext,
    deleteHistoricalContext,
  };
}

// Dashboard Admin Hooks (Admin role only)
export function useArtifactStats() {
  const [stats, setStats] = useState<ArtifactStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchArtifactStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get<ArtifactStats>(dashboardAdminEndpoints.artifactStats);
      setStats(response.data);
    } catch (err: unknown) {
      const errorMsg = getErrorMessage(err);
      setError(errorMsg);
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArtifactStats();
  }, [fetchArtifactStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchArtifactStats,
  };
}

export function useStaffStats() {
  const [stats, setStats] = useState<StaffStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStaffStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get<StaffStats>(dashboardAdminEndpoints.staffStats);
      setStats(response.data);
    } catch (err: unknown) {
      const errorMsg = getErrorMessage(err);
      setError(errorMsg);
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStaffStats();
  }, [fetchStaffStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStaffStats,
  };
}
