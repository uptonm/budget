"use client";

import { $Enums } from "@prisma/client";
import { format } from "date-fns";
import Link from "next/link";

import { Badge } from "~/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { formatCurrency } from "~/lib/currencyUtils";
import { TransactionType } from "~/lib/enumUtils";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

const amountClass: Record<$Enums.TransactionType, string> = {
  [$Enums.TransactionType.INCOME]: "text-income",
  [$Enums.TransactionType.EXPENSE]: "text-expense",
  [$Enums.TransactionType.SAVINGS]: "text-savings",
};

const signedAmount = (type: $Enums.TransactionType, amount: number) =>
  `${type === $Enums.TransactionType.INCOME ? "+" : "−"}${formatCurrency(amount)}`;

export function RecentTransactions() {
  const [transactions] = api.dashboard.recentTransactions.useSuspenseQuery();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent activity</CardTitle>
        <CardDescription>Latest tracked transactions</CardDescription>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <p className="text-muted-foreground text-sm">Nothing tracked yet.</p>
        ) : (
          <ul className="flex flex-col divide-y">
            {transactions.map((transaction) => (
              <li
                key={transaction.id}
                className="flex items-center justify-between gap-4 py-2.5 first:pt-0 last:pb-0"
              >
                <div className="min-w-0">
                  <Link
                    href={`${TransactionType.toRoute(transaction.type)}/edit/${transaction.id}`}
                    className="block truncate font-medium text-sm hover:underline"
                  >
                    {transaction.name}
                  </Link>
                  <span className="text-muted-foreground text-xs">
                    {transaction.Category.name} ·{" "}
                    {format(
                      transaction.date,
                      transaction.date.getFullYear() ===
                        new Date().getFullYear()
                        ? "MMM d"
                        : "MMM d, yyyy",
                    )}
                  </span>
                </div>
                <span
                  className={cn(
                    "font-medium text-sm tabular-nums",
                    amountClass[transaction.type],
                  )}
                >
                  {signedAmount(transaction.type, transaction.amount)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

export function UpcomingRecurring() {
  const [upcoming] = api.dashboard.upcomingRecurring.useSuspenseQuery();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Next two weeks</CardTitle>
        <CardDescription>Upcoming recurring transactions</CardDescription>
      </CardHeader>
      <CardContent>
        {upcoming.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            Nothing recurring in the next two weeks.
          </p>
        ) : (
          <ul className="flex flex-col divide-y">
            {upcoming.map((transaction) => (
              <li
                key={transaction.id}
                className="flex items-center justify-between gap-4 py-2.5 first:pt-0 last:pb-0"
              >
                <div className="min-w-0">
                  <span className="block truncate font-medium text-sm">
                    {transaction.name}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {transaction.Category.name} ·{" "}
                    {format(transaction.nextDate, "EEE, MMM d")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {TransactionType.toString(transaction.type)}
                  </Badge>
                  <span
                    className={cn(
                      "font-medium text-sm tabular-nums",
                      amountClass[transaction.type],
                    )}
                  >
                    {signedAmount(transaction.type, transaction.amount)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
