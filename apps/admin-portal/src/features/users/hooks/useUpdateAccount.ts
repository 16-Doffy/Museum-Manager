import { useMutation, useQueryClient } from '@tanstack/react-query';
import { accountsApi } from '../api/accounts-api';
import { UpdateAccountRequest } from '../types';

export function useUpdateAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAccountRequest }) => accountsApi.update(id, data),
    onSuccess: (_, variables) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['account', variables.id] });
    },
  });
}

