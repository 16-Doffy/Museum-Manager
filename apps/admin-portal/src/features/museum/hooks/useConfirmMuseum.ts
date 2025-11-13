import { useMutation, useQueryClient } from '@tanstack/react-query';
import { museumsApi } from '../api/museums-api';
import { ConfirmMuseumRequest } from '../types';

export function useConfirmMuseum() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, confirmStatus }: { id: string; confirmStatus: ConfirmMuseumRequest['ConfirmStatus'] }) =>
      museumsApi.confirm(id, confirmStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['museums'] });
    },
  });
}

