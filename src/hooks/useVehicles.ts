import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Vehicle, InventorySummary, CreateActionPayload, ActionLog } from '../types/vehicle';
import { logger } from '../lib/logger';

const QUERY_KEY = ['vehicles'];

/**
 * Hook to fetch full inventory list & summary metrics.
 */
export function useVehicles(dealershipId: string = 'dlr-001') {
  return useQuery<InventorySummary>({
    queryKey: [...QUERY_KEY, dealershipId],
    queryFn: async () => {
      const res = await fetch(`/api/vehicles?dealershipId=${dealershipId}`);
      if (!res.ok) {
        let errMsg = `Server error ${res.status}: ${res.statusText || 'Unable to fetch inventory'}`;
        try {
          const errData = await res.json();
          if (errData?.message) errMsg = errData.message;
        } catch {
          // ignore non-json error responses
        }
        throw new Error(errMsg);
      }
      try {
        return await res.json();
      } catch {
        throw new Error('Invalid response received from the inventory service. The service worker may still be initializing.');
      }
    },
    staleTime: 30_000,
  });
}


/**
 * Hook to log a status or action for a vehicle with optimistic update and rollback.
 */
export function useLogVehicleAction(dealershipId: string = 'dlr-001') {
  const queryClient = useQueryClient();
  const queryKey = [...QUERY_KEY, dealershipId];

  return useMutation({
    mutationFn: async ({
      vehicleId,
      payload,
    }: {
      vehicleId: string;
      payload: CreateActionPayload;
    }) => {
      const res = await fetch(`/api/vehicles/${vehicleId}/actions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: 'Action mutation failed' }));
        throw new Error(err.message || 'Action mutation failed');
      }

      return res.json() as Promise<Vehicle>;
    },

    // 1. Optimistic Update
    onMutate: async ({ vehicleId, payload }) => {
      // Cancel ongoing queries to avoid overwriting optimistic update
      await queryClient.cancelQueries({ queryKey });

      // Snapshot previous state
      const previousData = queryClient.getQueryData<InventorySummary>(queryKey);

      if (previousData) {
        const optimisticLog: ActionLog = {
          id: `temp-${Date.now()}`,
          actionType: payload.actionType,
          note: payload.note,
          author: payload.author || 'Marcus Vance (Inventory Manager)',
          timestamp: new Date().toISOString(),
        };

        const updatedItems = previousData.items.map((vehicle) => {
          if (vehicle.id === vehicleId) {
            return {
              ...vehicle,
              actionHistory: [optimisticLog, ...vehicle.actionHistory],
            };
          }
          return vehicle;
        });

        queryClient.setQueryData<InventorySummary>(queryKey, {
          ...previousData,
          items: updatedItems,
        });

        logger.info('mutation.optimistic_update_applied', { vehicleId, actionType: payload.actionType });
      }

      // Return context for rollback
      return { previousData };
    },

    // 2. Rollback on error
    onError: (err, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData<InventorySummary>(queryKey, context.previousData);
        logger.error('mutation.rollback_executed', {
          vehicleId: variables.vehicleId,
          error: err.message,
        });
      }
    },

    // 3. Re-sync with server
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}
