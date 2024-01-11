import { Suspense } from "react";
import Title from "antd/es/typography/Title";

import { ContentContainer } from "~/app/_components/shared/containers/ContentContainer";
import { SidebarContainer } from "~/app/_components/shared/containers/SidebarContainer";
import { LoadingDetail } from "~/app/_components/shared/LoadingDetail";
import { ProtectedRoute } from "~/app/_components/shared/containers/ProtectedRoute";
import { TransactionFormServer } from "~/app/_components/transactions/TransactionForm.server";

export default function CreateTransactionPage() {
  return (
    <ProtectedRoute>
      <SidebarContainer>
        <ContentContainer
          header={
            <Title level={2} className="mb-0">
              Create Transaction
            </Title>
          }
        >
          <Suspense
            fallback={
              <LoadingDetail
                title="Loading Transaction Creator"
                description="This may take a few seconds"
              />
            }
          >
            <TransactionFormServer />
          </Suspense>
        </ContentContainer>
      </SidebarContainer>
    </ProtectedRoute>
  );
}
