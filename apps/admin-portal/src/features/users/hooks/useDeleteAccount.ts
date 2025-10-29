import { useMutation, useQueryClient } from '@tanstack/react-query';
import { accountsApi } from '../api/accounts-api';

export function useDeleteAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => accountsApi.delete(id),
    onSuccess: () => {
      // Invalidate accounts list
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });
}

