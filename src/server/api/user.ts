import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const userRouter = createTRPCRouter({
  getCurrentUser: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
    });
  }),
  updateProfileImage: protectedProcedure
    .input(
      z.object({
        imageUrl: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          image: input.imageUrl,
        },
      });
      return true;
    }),
});
