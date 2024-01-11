import { Suspense } from "react";

import { ContentContainer } from "~/app/_components/shared/containers/ContentContainer";
import { SidebarContainer } from "~/app/_components/shared/containers/SidebarContainer";
import { CategoryFormServer } from "~/app/_components/categories/CategoryForm.server";
import { LoadingDetail } from "~/app/_components/shared/LoadingDetail";
import { ProtectedRoute } from "~/app/_components/shared/containers/ProtectedRoute";
import Title from "antd/es/typography/Title";

export default function HomePage() {
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
