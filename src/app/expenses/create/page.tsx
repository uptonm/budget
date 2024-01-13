import { $Enums } from "@prisma/client";
import Title from "antd/es/typography/Title"; // TODO: Optimize imports
import { Suspense } from "react";

import { LoadingDetail } from "~/app/_components/shared/LoadingDetail";
import { ContentContainer } from "~/app/_components/shared/containers/ContentContainer";
import { ProtectedRoute } from "~/app/_components/shared/containers/ProtectedRoute";
import { SidebarContainer } from "~/app/_components/shared/containers/SidebarContainer";
import { TransactionFormServer } from "~/app/_components/transactions/TransactionForm/TransactionForm.server";

export default function CreateExpensePage() {
  return (
    <ProtectedRoute>
      <SidebarContainer>
        <ContentContainer
          header={
            <Title level={2} className="mb-0">
              Track Expense
            </Title>
          }
        >
          <Suspense
            fallback={
              <LoadingDetail
                title="Loading Expense Tracker"
                description="This may take a few seconds"
              />
            }
          >
            <TransactionFormServer type={$Enums.TransactionType.EXPENSE} />
          </Suspense>
        </ContentContainer>
      </SidebarContainer>
    </ProtectedRoute>
  );
}
