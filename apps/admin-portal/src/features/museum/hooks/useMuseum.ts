import { useQuery } from '@tanstack/react-query';
import { museumsApi } from '../api/museums-api';

export function useMuseum(id: string) {
  return useQuery({
    queryKey: ['museum', id],
    queryFn: () => museumsApi.getById(id),
    enabled: !!id,
  });
}

