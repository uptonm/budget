import { categoryRouter } from "~/server/api/category";
import { dashboardRouter } from "~/server/api/dashboard";
import { transactionRouter } from "~/server/api/transaction";
import { createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "~/server/api/user";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  category: categoryRouter,
  dashboard: dashboardRouter,
  transaction: transactionRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
