import { $Enums } from "@prisma/client";

import { TransactionsPage } from "~/components/transactions/transactions-page";

export default function Page() {
  return <TransactionsPage type={$Enums.TransactionType.EXPENSE} />;
}
