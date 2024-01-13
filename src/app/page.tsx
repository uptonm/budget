import { Card, Col, Row } from "antd";
import Title from "antd/es/typography/Title"; // TODO: Optimize imports

import { ContentContainer } from "~/app/_components/shared/containers/ContentContainer";
import { ProtectedRoute } from "~/app/_components/shared/containers/ProtectedRoute";
import { SidebarContainer } from "~/app/_components/shared/containers/SidebarContainer";

export default function HomePage() {
  return (
    <ProtectedRoute>
      <SidebarContainer>
        <ContentContainer
          header={
            <Title level={2} className="mb-0">
              Dashboard
            </Title>
          }
        >
          <Row gutter={16} className="h-full pt-4">
            <Col span={12}>
              <div className="flex h-full w-full flex-col items-center justify-stretch space-y-4">
                <Card title="Monthly Spending" className="w-full flex-grow" />
                <Card
                  title="Transactions To Review"
                  className="w-full flex-grow"
                />
                <Card title="Monthly Income" className="w-full flex-grow" />
              </div>
            </Col>
            <Col span={12}>
              <div className="flex h-full w-full flex-col items-center justify-stretch space-y-4">
                <Card title="Net Worth" className="w-full flex-grow" />
                <Card title="Top Categories" className="w-full flex-grow" />
                <Card title="Next Two Weeks" className="w-full flex-grow" />
              </div>
            </Col>
          </Row>
        </ContentContainer>
      </SidebarContainer>
    </ProtectedRoute>
  );
}
