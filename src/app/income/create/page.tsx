import Title from "antd/es/typography/Title";
import { Suspense } from "react";

import { $Enums } from "@prisma/client";
import { LoadingDetail } from "~/app/_components/shared/LoadingDetail";
import { ContentContainer } from "~/app/_components/shared/containers/ContentContainer";
import { ProtectedRoute } from "~/app/_components/shared/containers/ProtectedRoute";
import { SidebarContainer } from "~/app/_components/shared/containers/SidebarContainer";
import { TransactionFormServer } from "~/app/_components/transactions/TransactionForm.server";

export default function TrackIncomePage() {
  return (
    <ProtectedRoute>
      <SidebarContainer>
        <ContentContainer
          header={
            <Title level={2} className="mb-0">
              Track Income
            </Title>
          }
        >
          <Suspense
            fallback={
              <LoadingDetail
                title="Loading Income Tracker"
                description="This may take a few seconds"
              />
            }
          >
            <TransactionFormServer type={$Enums.TransactionType.INCOME} />
          </Suspense>
        </ContentContainer>
      </SidebarContainer>
    </ProtectedRoute>
  );
}
