"use server";

import { api } from "~/trpc/server";

import { TransactionTable } from "~/app/_components/transactions/TransactionTable";

export async function TransactionTableServer() {
  const transactions = await api.transaction.getTransactions.query();

  return <TransactionTable transactions={transactions} />;
}
