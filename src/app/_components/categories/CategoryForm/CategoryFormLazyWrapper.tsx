"use client";

import { LoadingDetail } from "~/app/_components/shared/LoadingDetail";
import dynamic from "next/dynamic";
import { type CategoryFormProps } from "~/app/_components/categories/CategoryForm/CategoryForm";

const CategoryForm = dynamic(
  () =>
    import("~/app/_components/categories/CategoryForm/CategoryForm").then(
      ({ CategoryForm }) => CategoryForm,
    ),
  {
    loading: () => (
      <LoadingDetail
        title="Loading Category Editor"
        description="This may take a few seconds"
      />
    ),
  },
);

export function CategoryFormLazyWrapper(props: CategoryFormProps) {
  return <CategoryForm {...props} />;
}
