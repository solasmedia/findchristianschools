import { adminProcedure, router } from './_core/trpc';
import { batchUpdateSchools } from './batch-updates';

export const batchUpdatesRouter = router({
  executeAuditUpdates: adminProcedure.mutation(async () => {
    try {
      const result = await batchUpdateSchools();
      return {
        success: true,
        message: `Batch updates completed: ${result.deletedCount} deleted, ${result.updatedCount} updated`,
        ...result,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }),
});
