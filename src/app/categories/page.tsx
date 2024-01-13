import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd"; // TODO: Optimize imports
import Title from "antd/es/typography/Title";
import Link from "next/link";
import { Suspense } from "react";

import { CategoryTableServer } from "~/app/_components/categories/CategoryTable";
import { LoadingDetail } from "~/app/_components/shared/LoadingDetail";
import { ContentContainer } from "~/app/_components/shared/containers/ContentContainer";
import { ProtectedRoute } from "~/app/_components/shared/containers/ProtectedRoute";
import { SidebarContainer } from "~/app/_components/shared/containers/SidebarContainer";

export default function CategoryListPage() {
  return (
    <ProtectedRoute>
      <SidebarContainer>
        <ContentContainer
          header={
            <Title level={2} className="mb-0">
              Categories
            </Title>
          }
          action={
            <Link href="/categories/create">
              <Button type="primary" icon={<PlusOutlined />}>
                Create Category
              </Button>
            </Link>
          }
        >
          <Suspense
            fallback={
              <LoadingDetail
                title="Loading Categories"
                description="This may take a few seconds"
              />
            }
          >
            <CategoryTableServer />
          </Suspense>
        </ContentContainer>
      </SidebarContainer>
    </ProtectedRoute>
  );
}
