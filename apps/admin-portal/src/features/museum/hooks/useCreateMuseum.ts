import { useMutation, useQueryClient } from '@tanstack/react-query';
import { museumsApi } from '../api/museums-api';
import { CreateMuseumRequest } from '../types';

export function useCreateMuseum() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMuseumRequest) => museumsApi.create(data),
    onSuccess: () => {
      // Invalidate museums list to refetch with new museum
      queryClient.invalidateQueries({ queryKey: ['museums'] });
    },
  });
}

