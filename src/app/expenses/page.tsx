import { PlusOutlined } from "@ant-design/icons";
import { $Enums } from "@prisma/client";
import { Button } from "antd"; // TODO: Optimize imports
import Title from "antd/es/typography/Title"; // TODO: Optimize imports
import Link from "next/link";
import { Suspense } from "react";

import { LoadingDetail } from "~/app/_components/shared/LoadingDetail";
import { ContentContainer } from "~/app/_components/shared/containers/ContentContainer";
import { ProtectedRoute } from "~/app/_components/shared/containers/ProtectedRoute";
import { SidebarContainer } from "~/app/_components/shared/containers/SidebarContainer";
import { TransactionTableServer } from "~/app/_components/transactions/TransactionTable/TransactionTable.server";

export default function ExpenseListPage() {
  return (
    <ProtectedRoute>
      <SidebarContainer>
        <ContentContainer
          header={
            <Title level={2} className="mb-0">
              Expenses
            </Title>
          }
          action={
            <Link href="/expenses/create">
              <Button type="primary" icon={<PlusOutlined />}>
                Track Expense
              </Button>
            </Link>
          }
        >
          <Suspense
            fallback={
              <LoadingDetail
                title="Loading Expenses"
                description="This may take a few seconds"
              />
            }
          >
            <TransactionTableServer type={$Enums.TransactionType.EXPENSE} />
          </Suspense>
        </ContentContainer>
      </SidebarContainer>
    </ProtectedRoute>
  );
}
