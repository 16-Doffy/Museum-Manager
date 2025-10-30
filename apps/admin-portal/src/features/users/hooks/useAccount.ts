import { useQuery } from '@tanstack/react-query';
import { accountsApi } from '../api/accounts-api';

export function useAccount(id: string) {
  return useQuery({
    queryKey: ['account', id],
    queryFn: () => accountsApi.getById(id),
    enabled: !!id,
  });
}

