import { useMutation, useQueryClient } from '@tanstack/react-query';
import { approvalApi } from '../api/approval-api';

export function useAssignMuseum() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ accountId, museumId }: { accountId: string; museumId: string }) =>
      approvalApi.assignMuseum(accountId, museumId),
    onSuccess: () => {
      // Invalidate accounts and museums queries to refresh the lists
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['museums'] });
    },
  });
}

