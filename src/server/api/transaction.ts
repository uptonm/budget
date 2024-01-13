import { $Enums } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const transactionRouter = createTRPCRouter({
  getTransactionsByType: protectedProcedure
    .input(
      z.object({
        type: z.nativeEnum($Enums.TransactionType),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.transaction.findMany({
        where: {
          userId: ctx.session.user.id,
          type: input.type,
        },
        orderBy: [
          {
            date: "desc",
          },
        ],
      });
    }),
  getTransactionById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const transaction = await ctx.db.transaction.findUnique({
        where: {
          id: input.id,
        },
      });
      if (!transaction) {
        throw new Error("Transaction not found");
      }
      if (transaction.userId !== ctx.session.user.id) {
        throw new Error("Unauthorized");
      }
      return transaction;
    }),
  createTransaction: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().nullable(),
        amount: z.number(),
        type: z.nativeEnum($Enums.TransactionType),
        date: z.date(),
        frequency: z.nativeEnum($Enums.TransactionFrequency),
        categoryId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.transaction.create({
        data: {
          name: input.name,
          description: input.description,
          amount: input.amount,
          type: input.type,
          date: input.date,
          frequency: input.frequency,
          userId: ctx.session.user.id,
          categoryId: input.categoryId,
        },
      });
    }),
  updateTransaction: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        description: z.string().nullable(),
        amount: z.number(),
        type: z.nativeEnum($Enums.TransactionType),
        date: z.date(),
        frequency: z.nativeEnum($Enums.TransactionFrequency),
        categoryId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const transaction = await ctx.db.transaction.findUnique({
        where: {
          id: input.id,
        },
      });
      if (!transaction) {
        throw new Error("Transaction not found");
      }
      if (transaction.userId !== ctx.session.user.id) {
        throw new Error("Unauthorized");
      }
      return await ctx.db.transaction.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          description: input.description,
          amount: input.amount,
          type: input.type,
          date: input.date,
          frequency: input.frequency,
          userId: ctx.session.user.id,
          categoryId: input.categoryId,
        },
      });
    }),
  deleteTransaction: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const transaction = await ctx.db.transaction.findUnique({
        where: {
          id: input.id,
        },
      });
      if (!transaction) {
        throw new Error("Transaction not found");
      }
      if (transaction.userId !== ctx.session.user.id) {
        throw new Error("Unauthorized");
      }
      return await ctx.db.transaction.delete({
        where: {
          id: input.id,
        },
      });
    }),
  deleteTransactions: protectedProcedure
    .input(
      z.object({
        ids: z.array(z.string()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const transactions = await ctx.db.transaction.findMany({
        where: {
          id: {
            in: input.ids,
          },
        },
      });
      if (!transactions) {
        throw new Error("Transaction not found");
      }
      if (
        transactions.some(
          (transaction) => transaction.userId === ctx.session.user.id,
        )
      ) {
        throw new Error("Unauthorized");
      }
      if (transactions.length !== input.ids.length) {
        const missingTransactionIds = input.ids.filter(
          (id) => !transactions.find((transaction) => transaction.id === id),
        );
        throw new Error(
          `Transactions not found: ${missingTransactionIds.join(", ")}`,
        );
      }
      return await ctx.db.transaction.deleteMany({
        where: {
          id: {
            in: input.ids,
          },
        },
      });
    }),
});
