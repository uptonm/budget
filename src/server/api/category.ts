import { $Enums } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const categoryRouter = createTRPCRouter({
  getCategories: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.category.findMany({
      where: {
        OR: [
          { ownerType: $Enums.CategoryOwnerType.SYSTEM },
          { ownerId: ctx.session.user.id },
        ],
      },
      orderBy: [
        {
          ownerType: "asc",
        },
        {
          type: "asc",
        },
        {
          name: "asc",
        },
      ],
    });
  }),
  getCategoryById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.category.findUnique({
        where: {
          id: input.id,
        },
      });
    }),
  getCategoryNameIsUnique: protectedProcedure
    .input(
      z.object({
        name: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const category = await ctx.db.category.findFirst({
        where: {
          name: input.name,
          ownerId: ctx.session.user.id,
          ownerType: $Enums.CategoryOwnerType.USER,
        },
      });
      return !category;
    }),
  createCategory: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().nullable(),
        type: z.nativeEnum($Enums.TransactionType),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.category.create({
        data: {
          name: input.name,
          description: input.description,
          type: input.type,
          ownerId: ctx.session.user.id,
          ownerType: $Enums.CategoryOwnerType.USER,
        },
      });
    }),
  updateCategory: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        description: z.string().nullable(),
        type: z.nativeEnum($Enums.TransactionType),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const category = await ctx.db.category.findUnique({
        where: {
          id: input.id,
        },
      });
      if (!category) {
        throw new Error("Category not found");
      }
      if (category.ownerType === $Enums.CategoryOwnerType.SYSTEM) {
        throw new Error("Cannot update system category");
      }
      return await ctx.db.category.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          description: input.description,
          type: input.type,
        },
      });
    }),
  deleteCategory: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const category = await ctx.db.category.findUnique({
        where: {
          id: input.id,
        },
      });
      if (!category) {
        throw new Error("Category not found");
      }
      if (category.ownerType === $Enums.CategoryOwnerType.SYSTEM) {
        throw new Error("Cannot delete system category");
      }
      return await ctx.db.category.delete({
        where: {
          id: input.id,
        },
      });
    }),
  deleteCategories: protectedProcedure
    .input(
      z.object({
        ids: z.array(z.string()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const categories = await ctx.db.category.findMany({
        where: {
          id: {
            in: input.ids,
          },
        },
      });
      if (!categories) {
        throw new Error("Category not found");
      }
      const systemCategories = categories.filter(
        (category) => category.ownerType === $Enums.CategoryOwnerType.SYSTEM,
      );
      if (systemCategories.length > 0) {
        throw new Error("Cannot delete system category");
      }
      if (categories.length !== input.ids.length) {
        const missingCategoryIds = input.ids.filter(
          (id) => !categories.find((category) => category.id === id),
        );
        throw new Error(
          `Categories not found: ${missingCategoryIds.join(", ")}`,
        );
      }
      return await ctx.db.category.deleteMany({
        where: {
          id: {
            in: input.ids,
          },
        },
      });
    }),
});
