"use client";

import { $Enums } from "@prisma/client";
import { format, subMonths } from "date-fns";

import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { formatCurrency } from "~/lib/currencyUtils";
import { api } from "~/trpc/react";

const sumFor = (
  rows: { month: string; type: $Enums.TransactionType; total: number }[],
  month: Date,
  type: $Enums.TransactionType,
) => {
  const key = format(month, "yyyy-MM");
  return rows
    .filter((row) => row.month === key && row.type === type)
    .reduce((acc, row) => acc + row.total, 0);
};

export function StatTiles() {
  const [cashFlow] = api.dashboard.monthlyCashFlow.useSuspenseQuery();

  const now = new Date();
  const previous = subMonths(now, 1);

  const tiles = [
    { label: "Income", type: $Enums.TransactionType.INCOME },
    { label: "Expenses", type: $Enums.TransactionType.EXPENSE },
    { label: "Savings", type: $Enums.TransactionType.SAVINGS },
  ].map(({ label, type }) => ({
    label,
    current: sumFor(cashFlow, now, type),
    previous: sumFor(cashFlow, previous, type),
  }));

  const leftover = {
    label: "Left over",
    current:
      (tiles[0]?.current ?? 0) -
      (tiles[1]?.current ?? 0) -
      (tiles[2]?.current ?? 0),
    previous:
      (tiles[0]?.previous ?? 0) -
      (tiles[1]?.previous ?? 0) -
      (tiles[2]?.previous ?? 0),
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {[...tiles, leftover].map((tile) => {
        const delta = tile.current - tile.previous;
        return (
          <Card key={tile.label} className="gap-2 py-4">
            <CardHeader className="px-4">
              <span className="text-muted-foreground text-sm">
                {tile.label} this month
              </span>
            </CardHeader>
            <CardContent className="px-4">
              <div className="font-semibold text-2xl tabular-nums">
                {formatCurrency(tile.current)}
              </div>
              <p className="mt-1 text-muted-foreground text-xs">
                {delta === 0
                  ? "No change"
                  : `${delta > 0 ? "+" : "−"}${formatCurrency(Math.abs(delta))}`}{" "}
                vs last month
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
