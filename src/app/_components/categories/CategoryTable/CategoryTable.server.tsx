"use server";

import { api } from "~/trpc/server";

import { CategoryTable } from "~/app/_components/categories/CategoryTable/CategoryTable";

export async function CategoryTableServer() {
  const categories = await api.category.getCategories.query();

  return <CategoryTable categories={categories} />;
}
