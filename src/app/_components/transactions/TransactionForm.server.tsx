"use server";

import { type $Enums } from "@prisma/client";
import { clearCachesByServerAction } from "~/app/_actions/revalidatePaths";
import { TransactionForm } from "~/app/_components/transactions/TransactionForm";
import { api } from "~/trpc/server";

type TransactionFormServerProps = {
  type: $Enums.TransactionType;
  transactionId?: string;
};

export async function TransactionFormServer({
  type,
  transactionId,
}: TransactionFormServerProps) {
  const transaction = transactionId
    ? (await api.transaction.getTransactionById.query({ id: transactionId })) ??
      null
    : null;
  const categories = await api.category.getCategoriesByTransactionType.query({
    type,
  });

  return (
    <TransactionForm
      type={type}
      categories={categories}
      transaction={transaction}
      clearCachesByServerAction={clearCachesByServerAction}
    />
  );
}
