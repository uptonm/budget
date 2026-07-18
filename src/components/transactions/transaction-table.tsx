"use client";

import { $Enums, type Transaction } from "@prisma/client";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { DataTable } from "~/components/data-table";
import { SortableHeader } from "~/components/sortable-header";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { formatCurrency } from "~/lib/currencyUtils";
import { TransactionFrequency, TransactionType } from "~/lib/enumUtils";
import { api } from "~/trpc/react";

export function TransactionTable({ type }: { type: $Enums.TransactionType }) {
  const [pendingDelete, setPendingDelete] = useState<{
    ids: string[];
    clearSelection: () => void;
  } | null>(null);

  const utils = api.useUtils();
  const [transactions] = api.transaction.getTransactionsByType.useSuspenseQuery(
    { type },
  );

  const deleteTransactions = api.transaction.deleteTransactions.useMutation({
    onSuccess: async (_, input) => {
      toast.success(
        `Deleted ${input.ids.length} ${TransactionType.toString(type).toLowerCase()}`,
      );
      await utils.transaction.invalidate();
    },
    onError: (error) => toast.error(error.message),
  });

  const columns = useMemo<ColumnDef<Transaction>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
      },
      {
        accessorKey: "name",
        header: ({ column }) => (
          <SortableHeader column={column}>Name</SortableHeader>
        ),
        cell: ({ row }) => (
          <div>
            <div className="font-medium">{row.original.name}</div>
            {row.original.description ? (
              <div className="text-muted-foreground text-sm">
                {row.original.description}
              </div>
            ) : null}
          </div>
        ),
      },
      {
        accessorKey: "amount",
        header: ({ column }) => (
          <SortableHeader column={column}>Amount</SortableHeader>
        ),
        cell: ({ row }) => (
          <span className="font-medium tabular-nums">
            {formatCurrency(row.original.amount)}
          </span>
        ),
      },
      {
        accessorKey: "date",
        header: ({ column }) => (
          <SortableHeader column={column}>Date</SortableHeader>
        ),
        cell: ({ row }) => format(row.original.date, "MMM d, yyyy"),
      },
      {
        accessorKey: "frequency",
        header: "Frequency",
        cell: ({ row }) => (
          <Badge
            variant={
              row.original.frequency ===
              $Enums.TransactionFrequency.NON_RECURRING
                ? "outline"
                : "secondary"
            }
          >
            {TransactionFrequency.toString(row.original.frequency)}
          </Badge>
        ),
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <div className="flex justify-end">
            <Button variant="ghost" size="icon" asChild>
              <Link
                href={`${TransactionType.toRoute(type)}/edit/${row.original.id}`}
              >
                <Pencil />
                <span className="sr-only">Edit</span>
              </Link>
            </Button>
          </div>
        ),
        enableSorting: false,
      },
    ],
    [type],
  );

  return (
    <>
      <DataTable
        columns={columns}
        data={transactions}
        getRowId={(row) => row.id}
        searchPlaceholder={`Search ${TransactionType.toString(type).toLowerCase()}…`}
        emptyMessage={`No ${TransactionType.toString(type).toLowerCase()} tracked yet.`}
        toolbarActions={(selectedRows, clearSelection) =>
          selectedRows.length > 0 ? (
            <Button
              variant="destructive"
              size="sm"
              disabled={deleteTransactions.isPending}
              onClick={() =>
                setPendingDelete({
                  ids: selectedRows.map((row) => row.id),
                  clearSelection,
                })
              }
            >
              <Trash2 />
              Delete {selectedRows.length} selected
            </Button>
          ) : null
        }
      />
      <AlertDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete {pendingDelete?.ids.length}{" "}
              {TransactionType.toString(type).toLowerCase()}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the selected records. This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (!pendingDelete) return;
                deleteTransactions.mutate({ ids: pendingDelete.ids });
                pendingDelete.clearSelection();
                setPendingDelete(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
