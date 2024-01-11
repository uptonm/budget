import { createTRPCRouter } from "~/server/api/trpc";
import { categoryRouter } from "~/server/api/category";
import { userRouter } from "~/server/api/user";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  category: categoryRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
