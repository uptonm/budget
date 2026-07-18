import { Suspense } from "react";

import {
  RecentTransactions,
  UpcomingRecurring,
} from "~/components/dashboard/activity-lists";
import { CashFlowChart } from "~/components/dashboard/cash-flow-chart";
import { CategoryBreakdown } from "~/components/dashboard/category-breakdown";
import { StatTiles } from "~/components/dashboard/stat-tiles";
import { PageHeader } from "~/components/page-header";
import { Skeleton } from "~/components/ui/skeleton";
import { api, HydrateClient } from "~/trpc/server";

export default function DashboardPage() {
  void api.dashboard.monthlyCashFlow.prefetch();
  void api.dashboard.categoryBreakdown.prefetch();
  void api.dashboard.recentTransactions.prefetch();
  void api.dashboard.upcomingRecurring.prefetch();

  return (
    <HydrateClient>
      <PageHeader title="Dashboard" />
      <main className="flex flex-1 flex-col gap-4 p-4">
        <Suspense fallback={<Skeleton className="h-28 w-full" />}>
          <StatTiles />
        </Suspense>
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Suspense fallback={<Skeleton className="h-96 w-full" />}>
              <CashFlowChart />
            </Suspense>
          </div>
          <Suspense fallback={<Skeleton className="h-96 w-full" />}>
            <CategoryBreakdown />
          </Suspense>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <Suspense fallback={<Skeleton className="h-72 w-full" />}>
            <RecentTransactions />
          </Suspense>
          <Suspense fallback={<Skeleton className="h-72 w-full" />}>
            <UpcomingRecurring />
          </Suspense>
        </div>
      </main>
    </HydrateClient>
  );
}
