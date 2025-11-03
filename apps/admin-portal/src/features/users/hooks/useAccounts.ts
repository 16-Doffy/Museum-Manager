import { useQuery } from '@tanstack/react-query';
import { accountsApi } from '../api/accounts-api';
import { AccountListParams } from '../types';

export function useAccounts(params: AccountListParams = { pageIndex: 1, pageSize: 10 }) {
  return useQuery({
    queryKey: ['accounts', params],
    queryFn: () => accountsApi.getAll(params),
  });
}

