"use server";

import { clearCachesByServerAction } from "~/app/_actions/revalidatePaths";
import { CategoryForm } from "~/app/_components/categories/CategoryForm/CategoryForm";
import { api } from "~/trpc/server";

type CategoryFormServerProps = {
  categoryId?: string;
};

export async function CategoryFormServer({
  categoryId,
}: CategoryFormServerProps) {
  const category = categoryId
    ? (await api.category.getCategoryById.query({ id: categoryId })) ?? null
    : null;

  return (
    <CategoryForm
      category={category}
      clearCachesByServerAction={clearCachesByServerAction}
    />
  );
}
