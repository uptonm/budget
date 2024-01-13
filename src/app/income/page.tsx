import { PlusOutlined } from "@ant-design/icons";
import { $Enums } from "@prisma/client";
import { Button } from "antd";
import Title from "antd/es/typography/Title";
import Link from "next/link";
import { Suspense } from "react";

import { LoadingDetail } from "~/app/_components/shared/LoadingDetail";
import { ContentContainer } from "~/app/_components/shared/containers/ContentContainer";
import { ProtectedRoute } from "~/app/_components/shared/containers/ProtectedRoute";
import { SidebarContainer } from "~/app/_components/shared/containers/SidebarContainer";
import { TransactionTableServer } from "~/app/_components/transactions/TransactionTable.server";

export default function IncomeListPage() {
  return (
    <ProtectedRoute>
      <SidebarContainer>
        <ContentContainer
          header={
            <Title level={2} className="mb-0">
              Income
            </Title>
          }
          action={
            <Link href="/income/create">
              <Button type="primary" icon={<PlusOutlined />}>
                Track Income
              </Button>
            </Link>
          }
        >
          <Suspense
            fallback={
              <LoadingDetail
                title="Loading Income"
                description="This may take a few seconds"
              />
            }
          >
            <TransactionTableServer type={$Enums.TransactionType.INCOME} />
          </Suspense>
        </ContentContainer>
      </SidebarContainer>
    </ProtectedRoute>
  );
}
