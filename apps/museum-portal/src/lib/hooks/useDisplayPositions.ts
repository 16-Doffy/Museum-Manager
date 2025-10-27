import { useState, useEffect, useCallback, useMemo } from 'react';
import { useDisplayPositions as useDisplayPositionsAPI } from '../api/hooks';
import { DisplayPosition, DisplayPositionCreateRequest, DisplayPositionUpdateRequest, DisplayPositionSearchParams } from '../api/types';
import { useDebounce } from './useDebounce';

export function useDisplayPositions() {
  const [searchTerm, setSearchTerm] = useState('');
  const [areaName, setAreaName] = useState('');
  const [includeDeleted, setIncludeDeleted] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const pageSize = 10;
  
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const debouncedAreaName = useDebounce(areaName, 500);

  const searchParams = useMemo(() => ({
    pageIndex,
    pageSize,
    displayPositionName: debouncedSearchTerm || undefined,
    areaName: debouncedAreaName || undefined,
    includeDeleted,
  }), [pageIndex, pageSize, debouncedSearchTerm, debouncedAreaName, includeDeleted]);

  const {
    displayPositions,
    loading,
    error,
    pagination,
    createDisplayPosition: createDP,
    updateDisplayPosition: updateDP,
    deleteDisplayPosition: deleteDP,
    activateDisplayPosition: activateDP,
  } = useDisplayPositionsAPI(searchParams);

  // Create display position
  const createDisplayPosition = useCallback(async (data: DisplayPositionCreateRequest) => {
    try {
      return await createDP(data);
    } catch (err) {
      throw err;
    }
  }, [createDP]);

  // Update display position
  const updateDisplayPosition = useCallback(async (id: string, data: DisplayPositionUpdateRequest) => {
    try {
      return await updateDP(id, data);
    } catch (err) {
      throw err;
    }
  }, [updateDP]);

  // Delete display position
  const deleteDisplayPosition = useCallback(async (id: string) => {
    try {
      await deleteDP(id);
    } catch (err) {
      throw err;
    }
  }, [deleteDP]);

  // Activate display position
  const activateDisplayPosition = useCallback(async (id: string) => {
    try {
      return await activateDP(id);
    } catch (err) {
      throw err;
    }
  }, [activateDP]);

  return {
    displayPositions,
    loading,
    error,
    pagination,
    searchTerm,
    setSearchTerm,
    areaName,
    setAreaName,
    includeDeleted,
    setIncludeDeleted,
    pageIndex,
    setPageIndex,
    createDisplayPosition,
    updateDisplayPosition,
    deleteDisplayPosition,
    activateDisplayPosition,
  };
}