"use client";

import { $Enums, type Category } from "@prisma/client";
import type { ColumnDef } from "@tanstack/react-table";
import { Bot, Pencil, Trash2, User } from "lucide-react";
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
import { TransactionType } from "~/lib/enumUtils";
import { api } from "~/trpc/react";

const typeBadgeClass: Record<$Enums.TransactionType, string> = {
  [$Enums.TransactionType.EXPENSE]:
    "bg-expense/10 text-expense border-expense/20",
  [$Enums.TransactionType.INCOME]: "bg-income/10 text-income border-income/20",
  [$Enums.TransactionType.SAVINGS]:
    "bg-savings/10 text-savings border-savings/20",
};

export function CategoryTable() {
  const [pendingDelete, setPendingDelete] = useState<{
    ids: string[];
    clearSelection: () => void;
  } | null>(null);

  const utils = api.useUtils();
  const [categories] = api.category.getCategories.useSuspenseQuery();

  const deleteCategories = api.category.deleteCategories.useMutation({
    onSuccess: async (_, input) => {
      toast.success(`Deleted ${input.ids.length} categories`);
      await utils.category.invalidate();
    },
    onError: (error) => toast.error(error.message),
  });

  const columns = useMemo<ColumnDef<Category>[]>(
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
        cell: ({ row }) =>
          row.original.ownerType === $Enums.CategoryOwnerType.USER ? (
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label="Select row"
            />
          ) : null,
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
        accessorKey: "type",
        header: ({ column }) => (
          <SortableHeader column={column}>Type</SortableHeader>
        ),
        cell: ({ row }) => (
          <Badge
            variant="outline"
            className={typeBadgeClass[row.original.type]}
          >
            {TransactionType.toString(row.original.type)}
          </Badge>
        ),
      },
      {
        accessorKey: "ownerType",
        header: "Owner",
        cell: ({ row }) => (
          <span className="flex items-center gap-1.5 text-muted-foreground text-sm">
            {row.original.ownerType === $Enums.CategoryOwnerType.SYSTEM ? (
              <>
                <Bot className="size-3.5" /> System
              </>
            ) : (
              <>
                <User className="size-3.5" /> You
              </>
            )}
          </span>
        ),
      },
      {
        id: "actions",
        cell: ({ row }) =>
          row.original.ownerType === $Enums.CategoryOwnerType.USER ? (
            <div className="flex justify-end">
              <Button variant="ghost" size="icon" asChild>
                <Link href={`/categories/edit/${row.original.id}`}>
                  <Pencil />
                  <span className="sr-only">Edit</span>
                </Link>
              </Button>
            </div>
          ) : null,
        enableSorting: false,
      },
    ],
    [],
  );

  return (
    <>
      <DataTable
        columns={columns}
        data={categories}
        getRowId={(row) => row.id}
        searchPlaceholder="Search categories…"
        emptyMessage="No categories yet."
        toolbarActions={(selectedRows, clearSelection) =>
          selectedRows.length > 0 ? (
            <Button
              variant="destructive"
              size="sm"
              disabled={deleteCategories.isPending}
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
              Delete {pendingDelete?.ids.length} categories?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Categories with tracked transactions cannot be deleted. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (!pendingDelete) return;
                deleteCategories.mutate({ ids: pendingDelete.ids });
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
