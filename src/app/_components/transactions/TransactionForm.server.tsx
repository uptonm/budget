"use server";

import { getServerSession } from "next-auth";

import { clearCachesByServerAction } from "~/app/_actions/revalidatePaths";
import { TransactionForm } from "~/app/_components/transactions/TransactionForm";
import { authOptions } from "~/server/auth";
import { api } from "~/trpc/server";

type TransactionFormServerProps = {
  transactionId?: string;
};

export async function TransactionFormServer({
  transactionId,
}: TransactionFormServerProps) {
  const session = await getServerSession(authOptions);
  const transaction = transactionId
    ? (await api.transaction.getTransactionById.query({ id: transactionId })) ??
      null
    : null;
  const categories = await api.category.getCategories.query();

  return (
    <TransactionForm
      categories={categories}
      transaction={transaction}
      userId={session!.user.id}
      clearCachesByServerAction={clearCachesByServerAction}
    />
  );
}
