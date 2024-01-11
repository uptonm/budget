import { Suspense } from "react";
import Link from "next/link";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import { ContentContainer } from "~/app/_components/shared/containers/ContentContainer";
import { SidebarContainer } from "~/app/_components/shared/containers/SidebarContainer";
import { CategoryTableServer } from "~/app/_components/categories/CategoryTable.server";
import { LoadingDetail } from "~/app/_components/shared/LoadingDetail";
import { ProtectedRoute } from "~/app/_components/shared/containers/ProtectedRoute";
import Title from "antd/es/typography/Title";

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
