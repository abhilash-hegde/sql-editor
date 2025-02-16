import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

export default function QueryResults({ results }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sorting, setSorting] = useState([]);
  const [rowSelection, setRowSelection] = useState({});

  if (!results || results.length === 0) {
    return <div>No results to display.</div>;
  }

  function getColumns(obj, columnKey = "") {
    return Object.entries(obj).flatMap(([key, value]) => {
      if (value && typeof value === "object") {
        return getColumns(value, columnKey ? `${columnKey}.${key}` : key);
      }
      const accessorKey = columnKey ? `${columnKey}.${key}` : key;
      return {
        accessorKey,
        header: accessorKey,
        cell: ({ getValue }) => formatCell(accessorKey, getValue()),
      };
    });
  }

  function formatCell(key, value) {
    if (!value) return "";
    if (key.toLowerCase().includes("date")) {
      return new Date(value).toLocaleDateString();
    }
    return value;
  }

  const columns = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={table.getToggleAllPageRowsSelectedHandler()}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={row.getToggleSelectedHandler()}
          />
        ),
        size: 50,
      },
      {
        accessorFn: (_, index) => index + 1,
        id: "index",
        header: "#",
        cell: ({ row }) => row.index + 1,
        size: 50,
      },
      ...getColumns(results[0]),
    ],
    [results]
  );

  const filteredResults = useMemo(() => {
    return results.filter((row) =>
      Object.values(row).some((value) =>
        JSON.stringify(value ?? "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    );
  }, [results, searchTerm]);

  const table = useReactTable({
    data: filteredResults,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { sorting, rowSelection },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
  });

  function exportSelectedRows() {
    const selectedData = table.getSelectedRowModel().rows.map((row) => row.original);
    const blob = new Blob([JSON.stringify(selectedData, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "selected_rows.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search results..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Button onClick={exportSelectedRows}>Export Selected Rows</Button>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="cursor-pointer"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getIsSorted() === "asc"
                      ? " ▲"
                      : header.column.getIsSorted() === "desc"
                      ? " ▼"
                      : ""}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} style={{ width: cell.column.getSize() }}>
                    <div className="overflow-hidden text-ellipsis whitespace-nowrap max-w-[200px] line-clamp-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Pagination table={table} />
    </div>
  );
}

const Pagination = ({ table }) => {
  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex-1 text-sm text-muted-foreground">
        {table.getSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>
    </div>
  );
};
