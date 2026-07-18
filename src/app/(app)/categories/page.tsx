import { Plus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import { CategoryTable } from "~/components/categories/category-table";
import { PageHeader } from "~/components/page-header";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { api, HydrateClient } from "~/trpc/server";

export default function CategoriesPage() {
  void api.category.getCategories.prefetch();

  return (
    <HydrateClient>
      <PageHeader
        title="Categories"
        action={
          <Button asChild>
            <Link href="/categories/create">
              <Plus />
              Create Category
            </Link>
          </Button>
        }
      />
      <main className="flex-1 p-4">
        <Suspense
          fallback={
            <div className="flex flex-col gap-4">
              <Skeleton className="h-9 w-full max-w-sm" />
              <Skeleton className="h-96 w-full" />
            </div>
          }
        >
          <CategoryTable />
        </Suspense>
      </main>
    </HydrateClient>
  );
}
