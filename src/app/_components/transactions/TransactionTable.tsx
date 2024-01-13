"use client";

import { EditOutlined } from "@ant-design/icons";
import { type $Enums, type Transaction } from "@prisma/client";
import type { ColDef, GridApi, ValueFormatterParams } from "ag-grid-community";
import type { BaseColDefOptionalDataParams } from "ag-grid-community/dist/lib/entities/colDef";
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css"; // Theme
import { AgGridReact } from "ag-grid-react";
import { Button, Popconfirm } from "antd";
import classNames from "classnames";
import Link from "next/link";
import { useRef, useState } from "react";

import { formatCurrency } from "~/lib/currencyUtils";
import { TransactionFrequency, TransactionType } from "~/lib/enumUtils";
import { api } from "~/trpc/react";
import { LoadingDetail } from "../shared/LoadingDetail";

export type TransactionTableProps = {
  type: $Enums.TransactionType;
  transactions: Transaction[];
};

const generateTransactionTableColumns = (
  type: $Enums.TransactionType,
): ColDef<Transaction>[] => [
  {
    headerCheckboxSelection: true,
    checkboxSelection: true,
    width: 50,
  },
  {
    field: "name",
  },
  {
    field: "description",
  },
  {
    field: "amount",
    valueFormatter: (params: ValueFormatterParams<Transaction, number>) =>
      formatCurrency(params.value),
  },
  {
    field: "date",
  },
  {
    field: "frequency",
    valueFormatter: (
      params: ValueFormatterParams<Transaction, $Enums.TransactionFrequency>,
    ) => (params.value ? TransactionFrequency.toString(params.value) : ""),
  },
  {
    headerName: "Actions",
    cellRenderer: (params: BaseColDefOptionalDataParams<Transaction>) => (
      <Link
        href={`${TransactionType.toRoute(type)}/edit/${params.data!.id}`}
        className="space-x-2"
      >
        <EditOutlined />
        <span>Edit</span>
      </Link>
    ),
  },
];

export function TransactionTable({
  type,
  transactions,
}: TransactionTableProps) {
  const gridApi = useRef<GridApi>();
  const [gridReady, setGridReady] = useState(false);
  const [tableRows, setTableRows] = useState<Transaction[]>(transactions);
  const [rowSelection, setRowSelection] = useState<string[]>([]);

  const { refetch } = api.transaction.getTransactionsByType.useQuery(
    { type },
    {
      onSuccess: (data) => {
        setTableRows(data);
        gridApi.current?.hideOverlay();
      },
    },
  );
  const { mutateAsync: deleteTransactionsFn, isLoading: deleteFnLoading } =
    api.transaction.deleteTransactions.useMutation();

  return (
    <>
      {!gridReady && (
        <LoadingDetail
          title={`Loading ${TransactionType.toString(type)}}`}
          description="This may take a few seconds"
        />
      )}
      <div
        className={classNames(
          "ag-theme-quartz ag-with-status-bar flex h-full flex-col items-stretch justify-stretch pt-4",
          {
            hidden: !gridReady,
          },
        )}
      >
        <AgGridReact
          suppressRowClickSelection
          rowData={tableRows}
          rowSelection="multiple"
          columnDefs={generateTransactionTableColumns(type)}
          isRowSelectable={() => true}
          onGridReady={(params) => {
            gridApi.current = params.api;
            params.api.sizeColumnsToFit();
            setGridReady(true);
          }}
          onSelectionChanged={(params) => {
            setRowSelection(params.api.getSelectedRows().map((row) => row.id));
          }}
        />
        <div className="ag-status-bar flex items-center p-2">
          <Popconfirm
            title={`Are you sure you want to delete the selected ${TransactionType.toString(
              type,
            ).toLowerCase()}?`}
            description="This action cannot be undone."
            onConfirm={async () => {
              await deleteTransactionsFn({ ids: rowSelection });
              gridApi.current?.showLoadingOverlay();
              await refetch();
            }}
          >
            <Button
              danger
              type="primary"
              loading={deleteFnLoading}
              disabled={rowSelection.length === 0}
            >
              Delete {TransactionType.toString(type)}
            </Button>
          </Popconfirm>
        </div>
      </div>
    </>
  );
}
