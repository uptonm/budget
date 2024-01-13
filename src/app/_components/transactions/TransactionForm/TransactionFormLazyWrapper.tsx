"use client";

import { LoadingDetail } from "~/app/_components/shared/LoadingDetail";
import dynamic from "next/dynamic";
import { type TransactionFormProps } from "~/app/_components/transactions/TransactionForm/TransactionForm";

const TransactionForm = dynamic(
  () =>
    import(
      "~/app/_components/transactions/TransactionForm/TransactionForm"
    ).then(({ TransactionForm }) => TransactionForm),
  {
    loading: () => (
      <LoadingDetail
        title="Loading Transaction Editor"
        description="This may take a few seconds"
      />
    ),
  },
);

export function TransactionFormLazyWrapper(props: TransactionFormProps) {
  return <TransactionForm {...props} />;
}
