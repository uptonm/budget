"use server";

import { api } from "~/trpc/server";

import { type $Enums } from "@prisma/client";
import { TransactionTable } from "~/app/_components/transactions/TransactionTable";

type TransactionTableServerProps = {
  type: $Enums.TransactionType;
};

export async function TransactionTableServer({
  type,
}: TransactionTableServerProps) {
  const transactions = await api.transaction.getTransactionsByType.query({
    type,
  });

  return <TransactionTable type={type} transactions={transactions} />;
}
