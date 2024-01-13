"use client";

import { LoadingDetail } from "~/app/_components/shared/LoadingDetail";
import dynamic from "next/dynamic";
import { type CategoryTableProps } from "./CategoryTable";

const CategoryTable = dynamic(
  () =>
    import("~/app/_components/categories/CategoryTable/CategoryTable").then(
      ({ CategoryTable }) => CategoryTable,
    ),
  {
    loading: () => (
      <LoadingDetail
        title="Loading Category Table"
        description="This may take a few seconds"
      />
    ),
  },
);

export function CategoryTableLazyWrapper(props: CategoryTableProps) {
  return <CategoryTable {...props} />;
}
