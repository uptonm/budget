import { $Enums } from "@prisma/client";

import { TransactionFormPage } from "~/components/transactions/transaction-form-page";

export default async function Page({
  params,
}: {
  params: Promise<{ transactionId: string }>;
}) {
  const { transactionId } = await params;
  return (
    <TransactionFormPage
      type={$Enums.TransactionType.SAVINGS}
      transactionId={transactionId}
    />
  );
}
