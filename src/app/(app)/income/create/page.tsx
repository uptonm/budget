import { $Enums } from "@prisma/client";

import { TransactionFormPage } from "~/components/transactions/transaction-form-page";

export default function Page() {
  return <TransactionFormPage type={$Enums.TransactionType.INCOME} />;
}
