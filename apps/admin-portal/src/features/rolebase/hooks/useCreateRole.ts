import { useMutation, useQueryClient } from '@tanstack/react-query';
import { rolesApi } from '../api/roles-api';
import { CreateRoleRequest } from '../types';

export function useCreateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRoleRequest) => rolesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rolebase-roles'] });
    },
  });
}

