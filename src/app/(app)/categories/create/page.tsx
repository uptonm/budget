import { CategoryForm } from "~/components/categories/category-form";
import { PageHeader } from "~/components/page-header";

export default function CreateCategoryPage() {
  return (
    <>
      <PageHeader title="Create Category" />
      <main className="flex-1 p-4">
        <CategoryForm category={null} />
      </main>
    </>
  );
}
