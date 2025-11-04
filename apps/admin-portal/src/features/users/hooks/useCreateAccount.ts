import { useMutation, useQueryClient } from '@tanstack/react-query';
import { accountsApi } from '../api/accounts-api';
import { CreateAccountRequest } from '../types';

export function useCreateAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAccountRequest) => accountsApi.create(data),
    onSuccess: () => {
      // Invalidate accounts list
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });
}

