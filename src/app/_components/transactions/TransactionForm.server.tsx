"use server";

import { clearCachesByServerAction } from "~/app/_actions/revalidatePaths";
import { TransactionForm } from "~/app/_components/transactions/TransactionForm";
import { api } from "~/trpc/server";

type TransactionFormServerProps = {
  transactionId?: string;
};

export async function TransactionFormServer({
  transactionId,
}: TransactionFormServerProps) {
  const transaction = transactionId
    ? (await api.transaction.getTransactionById.query({ id: transactionId })) ??
      null
    : null;
  const categories = await api.category.getCategories.query();

  return (
    <TransactionForm
      categories={categories}
      transaction={transaction}
      clearCachesByServerAction={clearCachesByServerAction}
    />
  );
}
