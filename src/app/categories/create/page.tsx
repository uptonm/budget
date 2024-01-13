import Title from "antd/es/typography/Title";
import { Suspense } from "react";

import { CategoryFormServer } from "~/app/_components/categories/CategoryForm";
import { LoadingDetail } from "~/app/_components/shared/LoadingDetail";
import { ContentContainer } from "~/app/_components/shared/containers/ContentContainer";
import { ProtectedRoute } from "~/app/_components/shared/containers/ProtectedRoute";
import { SidebarContainer } from "~/app/_components/shared/containers/SidebarContainer";

export default function CreateCategoryPage() {
  return (
    <ProtectedRoute>
      <SidebarContainer>
        <ContentContainer
          header={
            <Title level={2} className="mb-0">
              Create Category
            </Title>
          }
        >
          <Suspense
            fallback={
              <LoadingDetail
                title="Loading Category Creator"
                description="This may take a few seconds"
              />
            }
          >
            <CategoryFormServer />
          </Suspense>
        </ContentContainer>
      </SidebarContainer>
    </ProtectedRoute>
  );
}
