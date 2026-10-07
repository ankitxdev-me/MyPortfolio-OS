import { toast } from './toast';

export interface OptimisticOptions<T> {
  currentData: T[];
  updateFn: (data: T[]) => T[];
  asyncOperation: () => Promise<any>;
  successMessage?: string;
  errorMessage?: string;
}

/**
 * Perform an optimistic UI update, applying changes instantly to local state,
 * while executing the backend async operation. Rolls back on error and notifies via toast.
 */
export async function performOptimisticUpdate<T>({
  currentData,
  updateFn,
  asyncOperation,
  successMessage = 'Action completed successfully!',
  errorMessage = 'Operation failed. Rolling back changes...',
}: OptimisticOptions<T>): Promise<{ success: boolean; data: T[] }> {
  // 1. Compute optimistic state
  const optimisticData = updateFn([...currentData]);

  try {
    // 2. Perform async network request
    await asyncOperation();
    if (successMessage) {
      toast.success(successMessage);
    }
    return { success: true, data: optimisticData };
  } catch (err: any) {
    // 3. Rollback on failure & notify
    toast.error(err?.message || errorMessage, 'Action Failed');
    return { success: false, data: currentData };
  }
}
