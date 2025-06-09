"use client";
import { ColumnDef } from "@tanstack/react-table";
import { type Tag as TagType } from "@/lib/schema";
import { format } from "date-fns";
import Tag from "../ui/tag";

export const columns: ColumnDef<TagType>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
    cell: (cell) => {
      const tagColor = cell.row.original.color;
      return <Tag name={cell.getValue() as string} color={tagColor} />;
    },
  },
  {
    accessorKey: "created_at",
    header: "Fecha de creación",
    cell: (cell) => format(cell.getValue() as Date, "dd/MM/yyyy"),
  },
];
