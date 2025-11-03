import { useQuery } from '@tanstack/react-query';
import { museumsApi } from '../api/museums-api';
import { MuseumListParams } from '../types';

export function useMuseums(params: MuseumListParams = { pageIndex: 1, pageSize: 10 }) {
  return useQuery({
    queryKey: ['museums', params],
    queryFn: () => museumsApi.getAll(params),
  });
}

