"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { formatCurrency } from "~/lib/currencyUtils";
import { api } from "~/trpc/react";

export function CategoryBreakdown() {
  const [breakdown] = api.dashboard.categoryBreakdown.useSuspenseQuery();

  const max = breakdown[0]?.total ?? 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending by category</CardTitle>
        <CardDescription>This month's expenses</CardDescription>
      </CardHeader>
      <CardContent>
        {breakdown.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No expenses tracked this month.
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {breakdown.map((category) => (
              <li key={category.categoryId}>
                <div className="mb-1 flex items-baseline justify-between gap-2 text-sm">
                  <span>{category.name}</span>
                  <span className="font-medium tabular-nums">
                    {formatCurrency(category.total)}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-expense"
                    style={{
                      width: `${max > 0 ? Math.max((category.total / max) * 100, 2) : 0}%`,
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
