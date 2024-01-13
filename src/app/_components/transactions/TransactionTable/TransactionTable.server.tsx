"use server";

import { api } from "~/trpc/server";

import { type $Enums } from "@prisma/client";
import { TransactionTableLazyWrapper } from "~/app/_components/transactions/TransactionTable/TransactionTableLazyWrapper";

type TransactionTableServerProps = {
  type: $Enums.TransactionType;
};

export async function TransactionTableServer({
  type,
}: TransactionTableServerProps) {
  const transactions = await api.transaction.getTransactionsByType.query({
    type,
  });

  return (
    <TransactionTableLazyWrapper type={type} transactions={transactions} />
  );
}
