import { useState, useEffect, useCallback, useMemo } from 'react';
import { AreaService } from '../api/areaService';
import { Area, AreaCreateRequest, AreaUpdateRequest, AreaSearchParams, PaginatedResponse } from '../api/types';
import { useDebounce } from './useDebounce';

export function useAreas() {
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
  });

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [includeDeleted, setIncludeDeleted] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Fetch areas
  const fetchAreas = useCallback(async (params?: AreaSearchParams) => {
    setLoading(true);
    setError(null);
    
    try {
      const searchParams: AreaSearchParams = {
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        areaName: debouncedSearchTerm || undefined,
        includeDeleted,
        ...params,
      };

      const response: PaginatedResponse<Area> = await AreaService.getAll(searchParams);
      setAreas(response.items);
      setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch areas');
      console.error('Error fetching areas:', err);
    } finally {
      setLoading(false);
    }
  }, [pagination.pageIndex, pagination.pageSize, debouncedSearchTerm, includeDeleted]);

  // Load areas on mount and when dependencies change
  useEffect(() => {
    fetchAreas();
  }, [fetchAreas]);

  // Create area
  const createArea = useCallback(async (data: AreaCreateRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const newArea = await AreaService.create(data);
      setAreas(prev => [newArea, ...prev]);
      return newArea;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create area';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update area
  const updateArea = useCallback(async (id: string, data: AreaUpdateRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedArea = await AreaService.update(id, data);
      setAreas(prev => prev.map(area => area.id === id ? updatedArea : area));
      return updatedArea;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update area';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete area
  const deleteArea = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await AreaService.delete(id);
      setAreas(prev => prev.filter(area => area.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete area';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Activate area
  const activateArea = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const activatedArea = await AreaService.activate(id);
      setAreas(prev => prev.map(area => area.id === id ? activatedArea : area));
      return activatedArea;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to activate area';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Pagination handlers
  const setPageIndex = useCallback((pageIndex: number) => {
    setPagination(prev => ({ ...prev, pageIndex }));
  }, []);

  const setPageSize = useCallback((pageSize: number) => {
    setPagination(prev => ({ ...prev, pageSize, pageIndex: 1 }));
  }, []);

  // Search handlers
  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    setPagination(prev => ({ ...prev, pageIndex: 1 }));
  }, []);

  const handleIncludeDeletedChange = useCallback((include: boolean) => {
    setIncludeDeleted(include);
    setPagination(prev => ({ ...prev, pageIndex: 1 }));
  }, []);

  // Memoized values
  const activeAreas = useMemo(() => 
    areas.filter(area => area.isActive && !area.isDeleted), 
    [areas]
  );

  const inactiveAreas = useMemo(() => 
    areas.filter(area => !area.isActive && !area.isDeleted), 
    [areas]
  );

  return {
    // Data
    areas,
    activeAreas,
    inactiveAreas,
    loading,
    error,
    pagination,
    
    // Search & Filter
    searchTerm,
    setSearchTerm: handleSearch,
    includeDeleted,
    setIncludeDeleted: handleIncludeDeletedChange,
    
    // Actions
    fetchAreas,
    createArea,
    updateArea,
    deleteArea,
    activateArea,
    
    // Pagination
    setPageIndex,
    setPageSize,
  };
}
