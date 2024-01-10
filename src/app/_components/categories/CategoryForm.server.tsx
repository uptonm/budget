"use server";

import { getServerSession } from "next-auth";

import { clearCachesByServerAction } from "~/app/_actions/revalidatePaths";
import { CategoryForm } from "~/app/_components/categories/CategoryForm";
import { authOptions } from "~/server/auth";
import { api } from "~/trpc/server";

type CategoryFormServerProps = {
  categoryId?: string;
};

export async function CategoryFormServer({
  categoryId,
}: CategoryFormServerProps) {
  const session = await getServerSession(authOptions);
  const category = categoryId
    ? (await api.category.getCategoryById.query({ id: categoryId })) ?? null
    : null;

  return (
    <CategoryForm
      category={category}
      userId={session!.user.id}
      clearCachesByServerAction={clearCachesByServerAction}
    />
  );
}
