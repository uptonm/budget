import type { $Enums } from "@prisma/client";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import { PageHeader } from "~/components/page-header";
import { TransactionTable } from "~/components/transactions/transaction-table";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { TransactionType } from "~/lib/enumUtils";
import { api, HydrateClient } from "~/trpc/server";

export function TransactionsPage({ type }: { type: $Enums.TransactionType }) {
  void api.transaction.getTransactionsByType.prefetch({ type });

  const label = TransactionType.toString(type);
  const noun = TransactionType.toNoun(type);

  return (
    <HydrateClient>
      <PageHeader
        title={label}
        action={
          <Button asChild>
            <Link href={`${TransactionType.toRoute(type)}/create`}>
              <Plus />
              Track {noun.charAt(0).toUpperCase() + noun.slice(1)}
            </Link>
          </Button>
        }
      />
      <main className="flex-1 p-4">
        <Suspense fallback={<TableSkeleton />}>
          <TransactionTable type={type} />
        </Suspense>
      </main>
    </HydrateClient>
  );
}

function TableSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-9 w-full max-w-sm" />
      <Skeleton className="h-96 w-full" />
    </div>
  );
}
