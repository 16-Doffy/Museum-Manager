/**
 * @fileoverview Custom Hooks for Museum Portal API
 * 
 * React hooks for API operations with loading states and error handling
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from './client';
import { artifactEndpoints, displayPositionEndpoints, areaEndpoints, visitorEndpoints, interactionEndpoints, museumEndpoints } from './endpoints';
import { mockArtifacts, mockDisplayPositions, mockAreas, mockVisitors } from './mockData';
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
      
      // Try real API first
      try {
        const response = await apiClient.get<{
          items: Artifact[];
          totalItems: number;
          pageIndex: number;
          totalPages: number;
          pageSize: number;
        }>(
          artifactEndpoints.getAll,
          searchParams as unknown as Record<string, string | number | boolean>
        );
        
        setArtifacts(response.data.items);
        setPagination({
          pageIndex: response.data.pageIndex,
          pageSize: response.data.pageSize,
          totalItems: response.data.totalItems,
          totalPages: response.data.totalPages,
        });
        return;
      } catch {
        console.log('API not available, using mock data for artifacts');
      }
      
      // Fallback to mock data
      setArtifacts(mockArtifacts);
      setPagination({
        pageIndex: 1,
        pageSize: 10,
        totalItems: mockArtifacts.length,
        totalPages: 1,
      });
      
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchArtifacts();
  }, [fetchArtifacts]);

  const createArtifact = useCallback(async (data: ArtifactCreateRequest) => {
    try {
      const response = await apiClient.post<Artifact>(artifactEndpoints.create, data);
      await fetchArtifacts(); // Refresh list
      return response.data;
    } catch (err: unknown) {
      throw new Error(getErrorMessage(err));
    }
  }, [fetchArtifacts]);

  const updateArtifact = useCallback(async (id: string, data: ArtifactUpdateRequest) => {
    try {
      const response = await apiClient.patch<Artifact>(artifactEndpoints.update(id), data);
      await fetchArtifacts(); // Refresh list
      return response.data;
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
      return response.data;
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
  };
}

export function useArtifact(id: string) {
  const { data: artifact, loading, error, execute } = useApiCall<Artifact>();

  const fetchArtifact = useCallback(() => {
    return execute(() => apiClient.get<Artifact>(artifactEndpoints.getById(id)).then(r => r.data));
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
      
      // Try real API first
      try {
        const response = await apiClient.get<{
          items: DisplayPosition[];
          totalItems: number;
          pageIndex: number;
          totalPages: number;
          pageSize: number;
        }>(
          displayPositionEndpoints.getAll,
          searchParams as unknown as Record<string, string | number | boolean>
        );
        
        setDisplayPositions(response.data.items);
        setPagination({
          pageIndex: response.data.pageIndex,
          pageSize: response.data.pageSize,
          totalItems: response.data.totalItems,
          totalPages: response.data.totalPages,
        });
        return;
      } catch {
        console.log('API not available, using mock data for display positions');
      }
      
      // Fallback to mock data
      setDisplayPositions(mockDisplayPositions);
      setPagination({
        pageIndex: 1,
        pageSize: 10,
        totalItems: mockDisplayPositions.length,
        totalPages: 1,
      });
      
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

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
      await fetchDisplayPositions(); // Refresh list
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
      
      // Try real API first
      try {
        const response = await apiClient.get<{
          items: Area[];
          totalItems: number;
          pageIndex: number;
          totalPages: number;
          pageSize: number;
        }>(
          areaEndpoints.getAll,
          searchParams as unknown as Record<string, string | number | boolean>
        );
        
        setAreas(response.data.items);
        setPagination({
          pageIndex: response.data.pageIndex,
          pageSize: response.data.pageSize,
          totalItems: response.data.totalItems,
          totalPages: response.data.totalPages,
        });
        return;
      } catch {
        console.log('API not available, using mock data for areas');
      }
      
      // Fallback to mock data
      setAreas(mockAreas);
      setPagination({
        pageIndex: 1,
        pageSize: 10,
        totalItems: mockAreas.length,
        totalPages: 1,
      });
      
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

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
      
      // Try real API first
      try {
        const response = await apiClient.get<{
          items: Visitor[];
          totalItems: number;
          pageIndex: number;
          totalPages: number;
          pageSize: number;
        }>(
          visitorEndpoints.getAll,
          searchParams as unknown as Record<string, string | number | boolean>
        );
        
        setVisitors(response.data.items);
        setPagination({
          pageIndex: response.data.pageIndex,
          pageSize: response.data.pageSize,
          totalItems: response.data.totalItems,
          totalPages: response.data.totalPages,
        });
        return;
      } catch {
        console.log('API not available, using mock data for visitors');
      }
      
      // Fallback to mock data
      setVisitors(mockVisitors);
      setPagination({
        pageIndex: 1,
        pageSize: 10,
        totalItems: mockVisitors.length,
        totalPages: 1,
      });
      
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

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
      
      const response = await apiClient.get<{
        items: Interaction[];
        totalItems: number;
        pageIndex: number;
        totalPages: number;
        pageSize: number;
      }>(
        interactionEndpoints.getAll,
        searchParams as unknown as Record<string, string | number | boolean>
      );
      
      setInteractions(response.data.items);
      setPagination({
        pageIndex: response.data.pageIndex,
        pageSize: response.data.pageSize,
        totalItems: response.data.totalItems,
        totalPages: response.data.totalPages,
      });
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

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

  return {
    interactions,
    loading,
    error,
    pagination,
    fetchInteractions,
    createInteraction,
    updateInteraction,
    deleteInteraction,
  };
}

// Museum Management Hook
export function useMuseum(id: string) {
  const { data: museum, loading, error, execute } = useApiCall<Museum>();

  const fetchMuseum = useCallback(() => {
    return execute(() => apiClient.get<Museum>(museumEndpoints.getById(id)).then(r => r.data));
  }, [id, execute]);

  useEffect(() => {
    if (id) {
      fetchMuseum();
    }
  }, [id, fetchMuseum]);

  return { museum, loading, error, refetch: fetchMuseum };
}
