import { Suspense } from "react";

import { CategoryFormServer } from "~/app/_components/categories/CategoryForm.server";
import { ContentContainer } from "~/app/_components/containers/ContentContainer";
import { SidebarContainer } from "~/app/_components/containers/SidebarContainer";
import { LoadingDetail } from "~/app/_components/shared/LoadingDetail";

export default function HomePage({
  params: { categoryId },
}: {
  params: { categoryId: string };
}) {
  return (
    <SidebarContainer>
      <ContentContainer header="Edit Category">
        <Suspense
          fallback={
            <LoadingDetail
              title="Loading Category Editor"
              description="This may take a few seconds"
            />
          }
        >
          <CategoryFormServer categoryId={categoryId} />
        </Suspense>
      </ContentContainer>
    </SidebarContainer>
  );
}
