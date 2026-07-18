import { $Enums, Prisma } from "@prisma/client";
import {
  addDays,
  addMonths,
  addQuarters,
  addWeeks,
  addYears,
  startOfMonth,
} from "date-fns";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

type CashFlowRow = {
  // "YYYY-MM" — a string key so no timezone reinterpretation happens client-side
  month: string;
  type: $Enums.TransactionType;
  total: number;
};

const nextOccurrence = (
  date: Date,
  frequency: $Enums.TransactionFrequency,
): Date | null => {
  switch (frequency) {
    case $Enums.TransactionFrequency.NON_RECURRING:
      return null;
    case $Enums.TransactionFrequency.DAILY:
      return addDays(date, 1);
    case $Enums.TransactionFrequency.WEEKLY:
      return addWeeks(date, 1);
    case $Enums.TransactionFrequency.BI_WEEKLY:
      return addWeeks(date, 2);
    case $Enums.TransactionFrequency.MONTHLY:
      return addMonths(date, 1);
    case $Enums.TransactionFrequency.BI_MONTHLY:
      return addMonths(date, 2);
    case $Enums.TransactionFrequency.QUARTERLY:
      return addQuarters(date, 1);
    case $Enums.TransactionFrequency.YEARLY:
      return addYears(date, 1);
  }
};

export const dashboardRouter = createTRPCRouter({
  monthlyCashFlow: protectedProcedure.query(async ({ ctx }) => {
    const since = startOfMonth(addMonths(new Date(), -11));
    const rows = await ctx.db.$queryRaw<CashFlowRow[]>(Prisma.sql`
      SELECT to_char(date_trunc('month', "date"), 'YYYY-MM') AS month,
             "type",
             SUM("amount")::float AS total
      FROM "Transaction"
      WHERE "userId" = ${ctx.session.user.id}
        AND "isProjected" = false
        AND "date" >= ${since}
      GROUP BY 1, 2
      ORDER BY 1
    `);
    return rows;
  }),

  categoryBreakdown: protectedProcedure.query(async ({ ctx }) => {
    const monthStart = startOfMonth(new Date());
    const grouped = await ctx.db.transaction.groupBy({
      by: ["categoryId"],
      where: {
        userId: ctx.session.user.id,
        type: $Enums.TransactionType.EXPENSE,
        isProjected: false,
        date: { gte: monthStart },
      },
      _sum: { amount: true },
    });
    const categories = await ctx.db.category.findMany({
      where: { id: { in: grouped.map((group) => group.categoryId) } },
      select: { id: true, name: true },
    });
    const nameById = new Map(categories.map((c) => [c.id, c.name]));
    return grouped
      .map((group) => ({
        categoryId: group.categoryId,
        name: nameById.get(group.categoryId) ?? "Unknown",
        total: group._sum.amount ?? 0,
      }))
      .sort((a, b) => b.total - a.total);
  }),

  recentTransactions: protectedProcedure.query(({ ctx }) =>
    ctx.db.transaction.findMany({
      where: { userId: ctx.session.user.id, isProjected: false },
      orderBy: { date: "desc" },
      take: 8,
      include: { Category: { select: { name: true } } },
    }),
  ),

  upcomingRecurring: protectedProcedure.query(async ({ ctx }) => {
    const recurring = await ctx.db.transaction.findMany({
      where: {
        userId: ctx.session.user.id,
        frequency: { not: $Enums.TransactionFrequency.NON_RECURRING },
      },
      include: { Category: { select: { name: true } } },
    });

    const now = new Date();
    const horizon = addDays(now, 14);

    return recurring
      .flatMap((transaction) => {
        // Roll each recurring transaction forward from its anchor date to its
        // first occurrence inside the window.
        let occurrence: Date | null = transaction.date;
        for (let i = 0; occurrence && occurrence < now; i++) {
          if (i > 1000) return [];
          occurrence = nextOccurrence(occurrence, transaction.frequency);
        }
        if (!occurrence || occurrence > horizon) return [];
        return [{ ...transaction, nextDate: occurrence }];
      })
      .sort((a, b) => a.nextDate.getTime() - b.nextDate.getTime());
  }),
});
