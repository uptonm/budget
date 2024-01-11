import { SidebarContainer } from "~/app/_components/shared/containers/SidebarContainer";
import { ProtectedRoute } from "~/app/_components/shared/containers/ProtectedRoute";
import { ProfilePageServer } from "~/app/_components/profile/ProfilePage.server";
import { Suspense } from "react";
import { LoadingDetail } from "~/app/_components/shared/LoadingDetail";

export default function HomePage() {
  return (
    <ProtectedRoute>
      <SidebarContainer>
        <Suspense
          fallback={
            <LoadingDetail
              title="Loading Profile"
              description="This may take a few seconds"
            />
          }
        >
          <ProfilePageServer />
        </Suspense>
      </SidebarContainer>
    </ProtectedRoute>
  );
}
