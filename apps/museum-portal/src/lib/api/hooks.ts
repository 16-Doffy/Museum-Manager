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
import { StorageManager } from '../utils/storage';
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
  const [artifacts, setArtifacts] = useState<Artifact[]>(() => {
    console.log('🔄 useArtifacts: Loading artifacts...');
    const loaded = StorageManager.loadArtifacts(mockArtifacts);
    console.log('🔄 useArtifacts: Loaded artifacts:', loaded);
    return loaded;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
  });

  // Save to localStorage whenever artifacts change
  useEffect(() => {
    console.log('💾 useArtifacts: Saving artifacts to localStorage:', artifacts);
    StorageManager.saveArtifacts(artifacts);
  }, [artifacts]);

  const fetchArtifacts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use current artifacts from state (which includes localStorage data)
      setPagination({
        pageIndex: 1,
        pageSize: 10,
        totalItems: artifacts.length,
        totalPages: 1,
      });
      
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [artifacts]);

  useEffect(() => {
    if (!searchParams) return;
    
    const timeoutId = setTimeout(() => {
      fetchArtifacts();
    }, 300); // Debounce 300ms
    
    return () => clearTimeout(timeoutId);
  }, [searchParams, fetchArtifacts]);

  const createArtifact = useCallback(async (data: ArtifactCreateRequest) => {
    console.log('➕ createArtifact: Creating new artifact with data:', data);
    
    // Mock implementation - create complete artifact object
    const newArtifact: Artifact = {
      id: `artifact-${Date.now()}`,
      code: `ART-${Date.now()}`,
      name: data.name,
      description: data.description || '',
      periodTime: data.periodTime || '',
      year: data.year || '',
      isOriginal: data.isOriginal ?? true,
      weight: data.weight || 0,
      height: data.height || 0,
      width: data.width || 0,
      length: data.length || 0,
      origin: '',
      material: '',
      dimensions: '',
      condition: '',
      acquisitionDate: '',
      acquisitionMethod: '',
      provenance: '',
      culturalSignificance: '',
      conservationNotes: '',
        displayPositionId: undefined,
        areaId: data.areaId || undefined,
        area: data.areaId ? mockAreas.find(area => area.id === data.areaId) || undefined : undefined,
      museumId: 'museum-1',
      museum: { id: 'museum-1', name: 'Bảo tàng Lịch sử Việt Nam', isActive: true, createdAt: '', updatedAt: '' },
      isActive: true,
      isDeleted: false,
      media: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    console.log('➕ createArtifact: Created artifact:', newArtifact);
    setArtifacts(prev => {
      const updated = [...prev, newArtifact];
      console.log('➕ createArtifact: Updated artifacts array:', updated);
      return updated;
    });
    return newArtifact;
  }, []);

  const updateArtifact = useCallback(async (id: string, data: ArtifactUpdateRequest) => {
    // Mock implementation - update all changed fields
    setArtifacts(prev => prev.map(a => {
      if (a.id === id) {
        const updated = {
          ...a,
          ...data,
          updatedAt: new Date().toISOString(),
        };
        
        // If areaId is provided, update the area object
        if (data.areaId) {
          // Find the area by ID from mockAreas
          const area = mockAreas.find(area => area.id === data.areaId);
          if (area) {
            updated.area = area;
          }
        }
        
        return updated;
      }
      return a;
    }));
    const updated = artifacts.find(a => a.id === id);
    return { ...updated, ...data } as Artifact;
  }, [artifacts]);

  const deleteArtifact = useCallback(async (id: string) => {
    // Mock implementation
    setArtifacts(prev => prev.filter(a => a.id !== id));
  }, []);

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
  const [displayPositions, setDisplayPositions] = useState<DisplayPosition[]>(() => {
    return StorageManager.loadDisplayPositions(mockDisplayPositions);
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
  });

  // Save to localStorage whenever displayPositions change
  useEffect(() => {
    StorageManager.saveDisplayPositions(displayPositions);
  }, [displayPositions]);

  const fetchDisplayPositions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use current displayPositions from state (which includes localStorage data)
      setPagination({
        pageIndex: 1,
        pageSize: 10,
        totalItems: displayPositions.length,
        totalPages: 1,
      });
      
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [displayPositions]);

  useEffect(() => {
    if (!searchParams) return;
    
    const timeoutId = setTimeout(() => {
      fetchDisplayPositions();
    }, 300); // Debounce 300ms
    
    return () => clearTimeout(timeoutId);
  }, [searchParams, fetchDisplayPositions]);

  const createDisplayPosition = useCallback(async (data: DisplayPositionCreateRequest) => {
    // Mock implementation - create complete display position object
    const newDP: DisplayPosition = {
      id: `dp-${Date.now()}`,
      displayPositionName: data.displayPositionName,
      positionCode: data.positionCode,
      description: data.description || '',
      areaId: data.areaId,
      museumId: 'museum-1',
      museum: { id: 'museum-1', name: 'Bảo tàng Lịch sử Việt Nam', isActive: true, createdAt: '', updatedAt: '' },
      isActive: true,
      isDeleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setDisplayPositions(prev => [...prev, newDP]);
    return newDP;
  }, []);

  const updateDisplayPosition = useCallback(async (id: string, data: DisplayPositionUpdateRequest) => {
    // Mock implementation - update all changed fields
    setDisplayPositions(prev => prev.map(dp => {
      if (dp.id === id) {
        return {
          ...dp,
          ...data,
          updatedAt: new Date().toISOString(),
        };
      }
      return dp;
    }));
    const updated = displayPositions.find(dp => dp.id === id);
    return { ...updated, ...data } as DisplayPosition;
  }, [displayPositions]);

  const deleteDisplayPosition = useCallback(async (id: string) => {
    // Mock implementation
    setDisplayPositions(prev => prev.filter(dp => dp.id !== id));
  }, []);

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
  const [areas, setAreas] = useState<Area[]>(() => {
    return StorageManager.loadAreas(mockAreas);
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
  });

  // Save to localStorage whenever areas change
  useEffect(() => {
    StorageManager.saveAreas(areas);
  }, [areas]);

  const fetchAreas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use current areas from state (which includes localStorage data)
      setPagination({
        pageIndex: 1,
        pageSize: 10,
        totalItems: areas.length,
        totalPages: 1,
      });
      
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [areas]);

  useEffect(() => {
    if (!searchParams) return;
    
    const timeoutId = setTimeout(() => {
      fetchAreas();
    }, 300); // Debounce 300ms
    
    return () => clearTimeout(timeoutId);
  }, [searchParams, fetchAreas]);

  const createArea = useCallback(async (data: AreaCreateRequest) => {
    // Mock implementation - create complete area object
    const mockMuseums: Record<string, string> = {
      'museum-1': 'Bảo tàng Lịch sử Việt Nam',
      'museum-2': 'Bảo tàng Mỹ thuật Việt Nam',
      'museum-3': 'Bảo tàng Dân tộc học Việt Nam',
    };
    
    const newArea: Area = {
      id: `area-${Date.now()}`,
      name: data.name,
      description: data.description || '',
      museumId: data.museumId || '',
      museum: data.museumId ? { id: data.museumId, name: mockMuseums[data.museumId] || 'Bảo tàng', isActive: true, createdAt: '', updatedAt: '' } : undefined,
      isActive: true,
      isDeleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setAreas(prev => [...prev, newArea]);
    return newArea;
  }, []);

  const updateArea = useCallback(async (id: string, data: AreaUpdateRequest) => {
    // Mock implementation - update all changed fields
    setAreas(prev => prev.map(a => {
      if (a.id === id) {
        return {
          ...a,
          ...data,
          museum: data.museumId ? { id: data.museumId, name: a.museum?.name || 'Bảo tàng', isActive: true, createdAt: '', updatedAt: '' } : a.museum,
          updatedAt: new Date().toISOString(),
        };
      }
      return a;
    }));
    const updated = areas.find(a => a.id === id);
    return { ...updated, ...data } as Area;
  }, [areas]);

  const deleteArea = useCallback(async (id: string) => {
    // Mock implementation
    setAreas(prev => prev.filter(a => a.id !== id));
  }, []);

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
  const [visitors, setVisitors] = useState<Visitor[]>(() => {
    return StorageManager.loadVisitors(mockVisitors);
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
  });

  // Save to localStorage whenever visitors change
  useEffect(() => {
    StorageManager.saveVisitors(visitors);
  }, [visitors]);

  const fetchVisitors = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use current visitors from state (which includes localStorage data)
      setPagination({
        pageIndex: 1,
        pageSize: 10,
        totalItems: visitors.length,
        totalPages: 1,
      });
      
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [visitors]);

  useEffect(() => {
    if (!searchParams) return;
    
    const timeoutId = setTimeout(() => {
      fetchVisitors();
    }, 300); // Debounce 300ms
    
    return () => clearTimeout(timeoutId);
  }, [searchParams, fetchVisitors]);

  const createVisitor = useCallback(async (data: VisitorCreateRequest) => {
    // Mock implementation - create complete visitor object
    const newVisitor: Visitor = {
      id: `visitor-${Date.now()}`,
      phoneNumber: data.phoneNumber,
      status: data.status,
      name: data.name || '',
      email: data.email || '',
      nationality: data.nationality || '',
      visitDate: data.visitDate || new Date().toISOString(),
      groupSize: data.groupSize || 1,
      museumId: 'museum-1',
      museum: { id: 'museum-1', name: 'Bảo tàng Lịch sử Việt Nam', isActive: true, createdAt: '', updatedAt: '' },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setVisitors(prev => [...prev, newVisitor]);
    return newVisitor;
  }, []);

  const updateVisitor = useCallback(async (id: string, data: VisitorUpdateRequest) => {
    // Mock implementation - update in mock array
    setVisitors(prev => prev.map(v => {
      if (v.id === id) {
        const updated = { ...v, ...data, updatedAt: new Date().toISOString() };
        return updated;
      }
      return v;
    }));
    const updated = visitors.find(v => v.id === id);
    return { ...updated, ...data } as Visitor;
  }, [visitors]);

  const deleteVisitor = useCallback(async (id: string) => {
    // Mock implementation - remove from mock array
    setVisitors(prev => prev.filter(v => v.id !== id));
  }, []);

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
  const [interactions, setInteractions] = useState<Interaction[]>(() => {
    return StorageManager.loadInteractions([]);
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
  });

  // Save to localStorage whenever interactions change
  useEffect(() => {
    StorageManager.saveInteractions(interactions);
  }, [interactions]);

  const fetchInteractions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use current interactions from state (which includes localStorage data)
      setPagination({
        pageIndex: 1,
        pageSize: 10,
        totalItems: interactions.length,
        totalPages: 1,
      });
      
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [interactions]);

  useEffect(() => {
    if (!searchParams) return;
    
    const timeoutId = setTimeout(() => {
      fetchInteractions();
    }, 300); // Debounce 300ms
    
    return () => clearTimeout(timeoutId);
  }, [searchParams, fetchInteractions]);

  const createInteraction = useCallback(async (data: InteractionCreateRequest) => {
    // Mock implementation - create complete interaction object
    const newInteraction: Interaction = {
      id: `interaction-${Date.now()}`,
      visitorId: data.visitorId,
      artifactId: data.artifactId,
      interactionType: data.interactionType,
      comment: data.comment || '',
      rating: data.rating || 0,
      duration: 0,
      feedback: '',
      museumId: 'museum-1',
      museum: { id: 'museum-1', name: 'Bảo tàng Lịch sử Việt Nam', isActive: true, createdAt: '', updatedAt: '' },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setInteractions(prev => [...prev, newInteraction]);
    return newInteraction;
  }, []);

  const updateInteraction = useCallback(async (id: string, data: InteractionUpdateRequest) => {
    // Mock implementation
    setInteractions(prev => prev.map(i => i.id === id ? { ...i, ...data, updatedAt: new Date().toISOString() } : i));
    return { ...data, id } as Interaction;
  }, []);

  const deleteInteraction = useCallback(async (id: string) => {
    // Mock implementation
    setInteractions(prev => prev.filter(i => i.id !== id));
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
