import { Suspense } from "react";

import { ContentContainer } from "~/app/_components/containers/ContentContainer";
import { SidebarContainer } from "~/app/_components/containers/SidebarContainer";
import { CategoryFormServer } from "~/app/_components/categories/CategoryForm.server";
import { LoadingDetail } from "~/app/_components/shared/LoadingDetail";

export default function HomePage() {
  return (
    <SidebarContainer>
      <ContentContainer header="Create Category">
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
  );
}
