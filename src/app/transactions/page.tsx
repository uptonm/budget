import { Suspense } from "react";
import Link from "next/link";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import { ContentContainer } from "~/app/_components/shared/containers/ContentContainer";
import { SidebarContainer } from "~/app/_components/shared/containers/SidebarContainer";
import { TransactionTableServer } from "~/app/_components/transactions/TransactionTable.server";
import { LoadingDetail } from "~/app/_components/shared/LoadingDetail";
import { ProtectedRoute } from "~/app/_components/shared/containers/ProtectedRoute";
import Title from "antd/es/typography/Title";

export default function TransactionListPage() {
  return (
    <ProtectedRoute>
      <SidebarContainer>
        <ContentContainer
          header={
            <Title level={2} className="mb-0">
              Transactions
            </Title>
          }
          action={
            <Link href="/transactions/create">
              <Button type="primary" icon={<PlusOutlined />}>
                Create Transaction
              </Button>
            </Link>
          }
        >
          <Suspense
            fallback={
              <LoadingDetail
                title="Loading Transactions"
                description="This may take a few seconds"
              />
            }
          >
            <TransactionTableServer />
          </Suspense>
        </ContentContainer>
      </SidebarContainer>
    </ProtectedRoute>
  );
}
