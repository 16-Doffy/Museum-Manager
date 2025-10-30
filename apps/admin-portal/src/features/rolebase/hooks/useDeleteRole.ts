import { useMutation, useQueryClient } from '@tanstack/react-query';
import { rolesApi } from '../api/roles-api';

export function useDeleteRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => rolesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rolebase-roles'] });
    },
  });
}

