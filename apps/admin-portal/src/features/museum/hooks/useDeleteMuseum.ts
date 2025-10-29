import { useMutation, useQueryClient } from '@tanstack/react-query';
import { museumsApi } from '../api/museums-api';

export function useDeleteMuseum() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => museumsApi.delete(id),
    onSuccess: () => {
      // Invalidate museums list
      queryClient.invalidateQueries({ queryKey: ['museums'] });
    },
  });
}

