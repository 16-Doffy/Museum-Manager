import { apiClient } from '@/lib/api-client';
import { Account } from '@/features/users/types';

export const approvalApi = {
  // Assign account to museum and activate both
  assignMuseum: async (accountId: string, museumId: string) => {
    const response = await apiClient.post<Account>(
      `/accounts/${accountId}/assign-museum/${museumId}`,
      {}
    );
    return response.data;
  },

  // Activate museum
  activateMuseum: async (museumId: string) => {
    const response = await apiClient.post<null>(`/museums/active/${museumId}`, {});
    return response.data;
  },
};

