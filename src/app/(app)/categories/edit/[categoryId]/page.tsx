import { notFound } from "next/navigation";

import { CategoryForm } from "~/components/categories/category-form";
import { PageHeader } from "~/components/page-header";
import { api } from "~/trpc/server";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}) {
  const { categoryId } = await params;
  const category = await api.category.getCategoryById({ id: categoryId });

  if (!category) {
    notFound();
  }

  return (
    <>
      <PageHeader title="Edit Category" />
      <main className="flex-1 p-4">
        <CategoryForm category={category} />
      </main>
    </>
  );
}
