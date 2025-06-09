"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Expense, Tag as TagType } from "@/lib/schema";
import { formatCurrency } from "@/utils/formatter";
import { format } from "date-fns";
import Tag from "../ui/tag";

export const columns: ColumnDef<Expense>[] = [
  {
    accessorKey: "description",
    header: "Descripción",
  },
  {
    accessorKey: "amount",
    header: "Monto",
    cell: (cell) => formatCurrency(cell.getValue() as number),
  },
  {
    accessorKey: "tags",
    header: "Tags",
    cell: (cell) => {
      const tags = cell.getValue() as TagType[];

      if (tags.length === 0) return "-";

      const [tag, ...rest] = tags;
      return (
        <div className="inline-flex items-center gap-2">
          <Tag name={tag.name} color={tag.color} />
          {rest.length > 0 && (
            <span className="text-muted-foreground text-xs">
              +{rest.length}
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "date",
    header: "Fecha",
    cell: (cell) => {
      const date = cell.getValue() as Date;
      return format(date.toISOString().replace("Z", ""), "dd/MM/yyyy");
    },
  },
  // {
  //   accessorKey: "currency",
  //   header: "Moneda",
  // },
];
