import type { $Enums } from "@prisma/client";
import { notFound } from "next/navigation";

import { PageHeader } from "~/components/page-header";
import { TransactionForm } from "~/components/transactions/transaction-form";
import { TransactionType } from "~/lib/enumUtils";
import { api } from "~/trpc/server";

type TransactionFormPageProps = {
  type: $Enums.TransactionType;
  transactionId?: string;
};

export async function TransactionFormPage({
  type,
  transactionId,
}: TransactionFormPageProps) {
  const [transaction, categories] = await Promise.all([
    transactionId
      ? api.transaction
          .getTransactionById({ id: transactionId })
          .catch(() => null)
      : Promise.resolve(null),
    api.category.getCategoriesByTransactionType({ type }),
  ]);

  if (transactionId && !transaction) {
    notFound();
  }

  const lowerNoun = TransactionType.toNoun(type);
  const noun = lowerNoun.charAt(0).toUpperCase() + lowerNoun.slice(1);

  return (
    <>
      <PageHeader title={transaction ? `Edit ${noun}` : `Track ${noun}`} />
      <main className="flex-1 p-4">
        <TransactionForm
          type={type}
          transaction={transaction}
          categories={categories}
        />
      </main>
    </>
  );
}
