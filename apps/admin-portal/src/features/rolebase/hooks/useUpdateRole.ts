import { useMutation, useQueryClient } from '@tanstack/react-query';
import { rolesApi } from '../api/roles-api';
import { UpdateRoleRequest } from '../types';

export function useUpdateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRoleRequest }) => rolesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rolebase-roles'] });
    },
  });
}

