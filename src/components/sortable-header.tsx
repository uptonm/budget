"use client";

import type { Column } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

import { Button } from "~/components/ui/button";

export function SortableHeader<TData>({
  column,
  children,
}: {
  column: Column<TData>;
  children: React.ReactNode;
}) {
  const sorted = column.getIsSorted();
  const Icon =
    sorted === "asc" ? ArrowUp : sorted === "desc" ? ArrowDown : ArrowUpDown;

  return (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3"
      onClick={() => column.toggleSorting(sorted === "asc")}
    >
      {children}
      <Icon className="ml-1 size-3.5" />
    </Button>
  );
}
