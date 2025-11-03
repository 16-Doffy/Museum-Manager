import { useQuery } from '@tanstack/react-query';
import { rolesApi } from '../api/roles-api';
import { RoleListParams } from '../types';

export function useRoles(params: RoleListParams = { pageIndex: 1, pageSize: 10 }) {
  return useQuery({
    queryKey: ['rolebase-roles', params],
    queryFn: () => rolesApi.getAll(params),
  });
}

