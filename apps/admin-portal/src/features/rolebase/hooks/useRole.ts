import { useQuery } from '@tanstack/react-query';
import { rolesApi } from '../api/roles-api';

export function useRole(id: string) {
  return useQuery({
    queryKey: ['role', id],
    queryFn: () => rolesApi.getById(id),
    enabled: !!id,
  });
}

