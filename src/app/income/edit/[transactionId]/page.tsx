import { $Enums } from "@prisma/client";
import Title from "antd/es/typography/Title"; // TODO: Optimize imports
import { Suspense } from "react";

import { ContentContainer } from "~/app/_components/shared/containers/ContentContainer";
import { ProtectedRoute } from "~/app/_components/shared/containers/ProtectedRoute";
import { SidebarContainer } from "~/app/_components/shared/containers/SidebarContainer";
import { LoadingDetail } from "~/app/_components/shared/LoadingDetail";
import { TransactionFormServer } from "~/app/_components/transactions/TransactionForm/TransactionForm.server";

export default function EditIncomePage({
  params: { transactionId },
}: {
  params: { transactionId: string };
}) {
  return (
    <ProtectedRoute>
      <SidebarContainer>
        <ContentContainer
          header={
            <Title level={2} className="mb-0">
              Edit Income
            </Title>
          }
        >
          <Suspense
            fallback={
              <LoadingDetail
                title="Loading Income Editor"
                description="This may take a few seconds"
              />
            }
          >
            <TransactionFormServer
              type={$Enums.TransactionType.INCOME}
              transactionId={transactionId}
            />
          </Suspense>
        </ContentContainer>
      </SidebarContainer>
    </ProtectedRoute>
  );
}
