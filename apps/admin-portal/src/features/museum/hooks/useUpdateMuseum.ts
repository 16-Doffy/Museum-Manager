import { useMutation, useQueryClient } from '@tanstack/react-query';
import { museumsApi } from '../api/museums-api';
import { UpdateMuseumRequest } from '../types';

export function useUpdateMuseum() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMuseumRequest }) => museumsApi.update(id, data),
    onSuccess: (_, variables) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['museums'] });
      queryClient.invalidateQueries({ queryKey: ['museum', variables.id] });
    },
  });
}

