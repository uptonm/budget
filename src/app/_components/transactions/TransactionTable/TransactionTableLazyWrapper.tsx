"use client";

import { LoadingDetail } from "~/app/_components/shared/LoadingDetail";
import dynamic from "next/dynamic";
import { type TransactionTableProps } from "~/app/_components/transactions/TransactionTable/TransactionTable";

const TransactionTable = dynamic(
  () =>
    import(
      "~/app/_components/transactions/TransactionTable/TransactionTable"
    ).then(({ TransactionTable }) => TransactionTable),
  {
    loading: () => (
      <LoadingDetail
        title="Loading Transaction Table"
        description="This may take a few seconds"
      />
    ),
  },
);

export function TransactionTableLazyWrapper(props: TransactionTableProps) {
  return <TransactionTable {...props} />;
}
