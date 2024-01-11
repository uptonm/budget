import Title from "antd/es/typography/Title";
import { Suspense } from "react";

import { CategoryFormServer } from "~/app/_components/categories/CategoryForm.server";
import { ContentContainer } from "~/app/_components/shared/containers/ContentContainer";
import { ProtectedRoute } from "~/app/_components/shared/containers/ProtectedRoute";
import { SidebarContainer } from "~/app/_components/shared/containers/SidebarContainer";
import { LoadingDetail } from "~/app/_components/shared/LoadingDetail";

export default function HomePage({
  params: { categoryId },
}: {
  params: { categoryId: string };
}) {
  return (
    <ProtectedRoute>
      <SidebarContainer>
        <ContentContainer
          header={
            <Title level={2} className="mb-0">
              Edit Category
            </Title>
          }
        >
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
    </ProtectedRoute>
  );
}
