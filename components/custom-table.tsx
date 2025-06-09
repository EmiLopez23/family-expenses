"use client";

import {
  Table as TableShad,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
} from "./ui/table";
import { ColumnDef, flexRender, useReactTable } from "@tanstack/react-table";
import { getCoreRowModel } from "@tanstack/react-table";

export default function Table<T>({
  data,
  columns,
}: {
  data: T[];
  columns: ColumnDef<T>[];
}) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const { rows } = table.getRowModel();

  return (
    <TableShad>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {rows.length > 0 ? rows.map((row) => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        )) : (
          <TableRow className="h-[400px]">
            <TableCell colSpan={columns.length} className="h-24 text-center">
              No hay gastos cargados
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </TableShad>
  );
}
