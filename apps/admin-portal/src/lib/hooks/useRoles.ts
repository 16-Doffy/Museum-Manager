"use client";

import { useState, useEffect, useCallback } from 'react';
import { RoleService } from '../api/roleService';
import { Role, RoleCreateRequest, RoleUpdateRequest, PaginatedResponse, PaginationParams } from '../api/types';

export function useRoles(searchParams?: PaginationParams) {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
  });

  const fetchRoles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await RoleService.getAll(searchParams);
      setRoles(response.items);
      setPagination({
        pageIndex: response.pageIndex,
        pageSize: response.pageSize,
        totalItems: response.totalItems,
        totalPages: response.totalPages,
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch roles');
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const createRole = useCallback(async (data: RoleCreateRequest) => {
    try {
      const response = await RoleService.create(data);
      await fetchRoles(); // Refresh list
      return response;
    } catch (err: unknown) {
      throw new Error(err instanceof Error ? err.message : 'Failed to create role');
    }
  }, [fetchRoles]);

  const updateRole = useCallback(async (id: string, data: RoleUpdateRequest) => {
    try {
      const response = await RoleService.update(id, data);
      await fetchRoles(); // Refresh list
      return response;
    } catch (err: unknown) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update role');
    }
  }, [fetchRoles]);

  const deleteRole = useCallback(async (id: string) => {
    try {
      await RoleService.delete(id);
      await fetchRoles(); // Refresh list
    } catch (err: unknown) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete role');
    }
  }, [fetchRoles]);

  return {
    roles,
    loading,
    error,
    pagination,
    fetchRoles,
    createRole,
    updateRole,
    deleteRole,
  };
}

export function useRole(id: string) {
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRole = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await RoleService.getById(id);
      setRole(response);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch role');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchRole();
  }, [fetchRole]);

  return { role, loading, error, refetch: fetchRole };
}