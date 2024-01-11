import { ContentContainer } from "~/app/_components/shared/containers/ContentContainer";
import { SidebarContainer } from "~/app/_components/shared/containers/SidebarContainer";
import { ProtectedRoute } from "~/app/_components/shared/containers/ProtectedRoute";
import Title from "antd/es/typography/Title";

export default function HomePage() {
  return (
    <ProtectedRoute>
      <SidebarContainer>
        <ContentContainer
          header={
            <Title level={2} className="mb-0">
              Home
            </Title>
          }
        />
      </SidebarContainer>
    </ProtectedRoute>
  );
}
