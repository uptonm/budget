"use client";

import { RobotOutlined, UserOutlined } from "@ant-design/icons";
import { $Enums, type Category } from "@prisma/client";
import type { ColDef, GridApi, ValueFormatterParams } from "ag-grid-community";
import type { BaseColDefOptionalDataParams } from "ag-grid-community/dist/lib/entities/colDef";
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css"; // Theme
import { EditOutlined } from "@ant-design/icons";
import { AgGridReact } from "ag-grid-react";
import { Button, Popconfirm } from "antd";
import classNames from "classnames";
import Link from "next/link";
import { useRef, useState } from "react";

import { CategoryOwnerType, TransactionType } from "~/lib/enumUtils";
import { api } from "~/trpc/react";
import { LoadingDetail } from "../shared/LoadingDetail";

export type CategoryTableProps = {
  categories: Category[];
};

const categoryTableColumns: ColDef<Category>[] = [
  {
    headerCheckboxSelection: true,
    checkboxSelection: (params) =>
      params.data?.ownerType === $Enums.CategoryOwnerType.USER,
    width: 50,
  },
  {
    field: "name",
  },
  {
    field: "description",
  },
  {
    field: "type",
    valueFormatter: (
      params: ValueFormatterParams<Category, $Enums.TransactionType>,
    ) => (params.value ? TransactionType.toString(params.value) : ""),
  },
  {
    field: "ownerType",
    valueFormatter: (
      params: ValueFormatterParams<Category, $Enums.CategoryOwnerType>,
    ) => (params.value ? CategoryOwnerType.toString(params.value) : ""),
    cellRenderer: (params: BaseColDefOptionalDataParams<Category>) => (
      <div className="flex items-center space-x-2">
        {params.data?.ownerType === $Enums.CategoryOwnerType.SYSTEM ? (
          <RobotOutlined />
        ) : (
          <UserOutlined />
        )}
        <span>{CategoryOwnerType.toString(params.data!.ownerType)}</span>
      </div>
    ),
  },
  {
    headerName: "Actions",
    cellRenderer: (params: BaseColDefOptionalDataParams<Category>) =>
      params.data?.ownerType === $Enums.CategoryOwnerType.USER && (
        <Link href={`/categories/edit/${params.data.id}`} className="space-x-2">
          <EditOutlined />
          <span>Edit</span>
        </Link>
      ),
  },
];

export function CategoryTable({ categories }: CategoryTableProps) {
  const gridApi = useRef<GridApi>();
  const [gridReady, setGridReady] = useState(false);
  const [tableRows, setTableRows] = useState<Category[]>(categories);
  const [rowSelection, setRowSelection] = useState<string[]>([]);

  const { refetch } = api.category.getCategories.useQuery(undefined, {
    onSuccess: (data) => {
      setTableRows(data);
      gridApi.current?.hideOverlay();
    },
  });
  const { mutateAsync: deleteCategoriesFn, isLoading: deleteFnLoading } =
    api.category.deleteCategories.useMutation();

  return (
    <>
      {!gridReady && (
        <LoadingDetail
          title="Loading Categories"
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
          rowData={tableRows}
          rowSelection="multiple"
          columnDefs={categoryTableColumns}
          isRowSelectable={(params) =>
            params.data?.ownerType === $Enums.CategoryOwnerType.USER
          }
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
            title="Are you sure you want to delete the selected categories?"
            description="All transactions associated with these categories will be deleted."
            onConfirm={async () => {
              await deleteCategoriesFn({ ids: rowSelection });
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
              Delete Categories
            </Button>
          </Popconfirm>
        </div>
      </div>
    </>
  );
}
