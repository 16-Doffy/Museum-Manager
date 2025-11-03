import { useMutation, useQueryClient } from '@tanstack/react-query';
import { accountsApi } from '../api/accounts-api';
import { Account } from '../types';

export function useDeleteAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => accountsApi.delete(id),
    onSuccess: (_, id) => {
      // Invalidate accounts list
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      
      // Optimistically update the account detail cache to set status as Inactive
      queryClient.setQueryData(['account', id], (oldData: Account | undefined) => {
        if (oldData) {
          return {
            ...oldData,
            status: 'Inactive' as const,
            updateAt: new Date().toISOString(),
          };
        }
        return oldData;
      });
    },
  });
}

