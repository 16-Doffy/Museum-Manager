"use client";

import { useState, useEffect, useCallback } from 'react';
import { AccountService } from '../api/accountService';
import { Account, AccountCreateRequest, AccountUpdateRequest, PaginatedResponse, PaginationParams } from '../api/types';

export function useAccounts(searchParams?: PaginationParams) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
  });

  const fetchAccounts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await AccountService.getAll(searchParams);
      setAccounts(response.items);
      setPagination({
        pageIndex: response.pageIndex,
        pageSize: response.pageSize,
        totalItems: response.totalItems,
        totalPages: response.totalPages,
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch accounts');
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const createAccount = useCallback(async (roleId: string, museumId: string, data: AccountCreateRequest) => {
    try {
      const response = await AccountService.create(roleId, museumId, data);
      await fetchAccounts(); // Refresh list
      return response;
    } catch (err: unknown) {
      throw new Error(err instanceof Error ? err.message : 'Failed to create account');
    }
  }, [fetchAccounts]);

  const updateAccount = useCallback(async (id: string, data: AccountUpdateRequest) => {
    try {
      const response = await AccountService.update(id, data);
      await fetchAccounts(); // Refresh list
      return response;
    } catch (err: unknown) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update account');
    }
  }, [fetchAccounts]);

  const deleteAccount = useCallback(async (id: string) => {
    try {
      await AccountService.delete(id);
      await fetchAccounts(); // Refresh list
    } catch (err: unknown) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete account');
    }
  }, [fetchAccounts]);

  const activateAccount = useCallback(async (id: string) => {
    try {
      const response = await AccountService.activate(id);
      await fetchAccounts(); // Refresh list
      return response;
    } catch (err: unknown) {
      throw new Error(err instanceof Error ? err.message : 'Failed to activate account');
    }
  }, [fetchAccounts]);

  const deactivateAccount = useCallback(async (id: string) => {
    try {
      const response = await AccountService.deactivate(id);
      await fetchAccounts(); // Refresh list
      return response;
    } catch (err: unknown) {
      throw new Error(err instanceof Error ? err.message : 'Failed to deactivate account');
    }
  }, [fetchAccounts]);

  return {
    accounts,
    loading,
    error,
    pagination,
    fetchAccounts,
    createAccount,
    updateAccount,
    deleteAccount,
    activateAccount,
    deactivateAccount,
  };
}

export function useAccount(id: string) {
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAccount = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await AccountService.getById(id);
      setAccount(response);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch account');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchAccount();
  }, [fetchAccount]);

  return { account, loading, error, refetch: fetchAccount };
}