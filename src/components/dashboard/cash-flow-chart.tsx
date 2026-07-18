"use client";

import { $Enums } from "@prisma/client";
import { addMonths, format, isSameMonth, startOfMonth } from "date-fns";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import type { ChartConfig } from "~/components/ui/chart";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";
import { formatCurrency } from "~/lib/currencyUtils";
import { api } from "~/trpc/react";

const chartConfig = {
  income: { label: "Income", color: "var(--income)" },
  expenses: { label: "Expenses", color: "var(--expense)" },
  savings: { label: "Savings", color: "var(--savings)" },
} satisfies ChartConfig;

export function CashFlowChart() {
  const [rows] = api.dashboard.monthlyCashFlow.useSuspenseQuery();

  const start = startOfMonth(addMonths(new Date(), -11));
  const data = Array.from({ length: 12 }, (_, index) => {
    const month = addMonths(start, index);
    const totalFor = (type: $Enums.TransactionType) =>
      rows
        .filter((row) => isSameMonth(row.month, month) && row.type === type)
        .reduce((acc, row) => acc + row.total, 0);
    return {
      month: format(month, "MMM"),
      income: totalFor($Enums.TransactionType.INCOME),
      expenses: totalFor($Enums.TransactionType.EXPENSE),
      savings: totalFor($Enums.TransactionType.SAVINGS),
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cash flow</CardTitle>
        <CardDescription>
          Income, expenses, and savings by month
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-72 w-full">
          <BarChart data={data} barGap={2}>
            <CartesianGrid vertical={false} strokeOpacity={0.4} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={56}
              tickFormatter={(value: number) =>
                formatCurrency(value).replace(/\.00$/, "")
              }
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => (
                    <div className="flex w-full items-center justify-between gap-4">
                      <span className="text-muted-foreground">
                        {chartConfig[name as keyof typeof chartConfig]?.label}
                      </span>
                      <span className="font-medium tabular-nums">
                        {formatCurrency(Number(value))}
                      </span>
                    </div>
                  )}
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="income"
              fill="var(--color-income)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="expenses"
              fill="var(--color-expenses)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="savings"
              fill="var(--color-savings)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
