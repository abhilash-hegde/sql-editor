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
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronsUpDown,
} from "lucide-react";
import exportData from "@/lib/export-data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Checkbox } from "@/components/ui/checkbox";
import ExportButton from "@/components/export-button";

export default function QueryResults({ results = [] }) {
  const {
    searchTerm,
    setSearchTerm,
    sorting,
    setSorting,
    rowSelection,
    setRowSelection,
    loadingFormat,
    setLoadingFormat,
    filteredResults,
  } = useTableData(results);

  const columns = useTableColumns(results);

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

  if (!results || results.length === 0) {
    return <div>No results to display.</div>;
  }

  const exportDataHandler = (format) => {
    setLoadingFormat((prev) => ({
      ...prev,
      [format]: true,
    }));
    const selectedData = table
      .getSelectedRowModel()
      .rows.map((row) => row.original);
    exportData(selectedData, format, () => {
      setLoadingFormat((prev) => {
        const updated = { ...prev };
        delete updated[format];
        return updated;
      });
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Input
          placeholder="Search results..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <ExportButton
          disabled={!table.getSelectedRowModel().rows.length}
          exportText="Export Selected Rows"
          exportDataHandler={exportDataHandler}
          loadingFormat={loadingFormat}
          variant="outline"
        />
      </div>
      <TableComponent table={table} />
      <TablePagination table={table} />
    </div>
  );
}

const TableComponent = ({ table }) => (
  <div className="overflow-x-auto">
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header, index) => (
              <TableHead
                key={header.id}
                onClick={header.column.getToggleSortingHandler()}
                className="cursor-pointer"
              >
                <div className="cursor-pointer inline-flex items-center gap-x-2 whitespace-nowrap">
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                  {index > 1 &&
                    (header.column.getIsSorted() === "desc" ? (
                      <ArrowDown className="w-3 h-3" />
                    ) : header.column.getIsSorted() === "asc" ? (
                      <ArrowUp className="w-3 h-3" />
                    ) : (
                      <ChevronsUpDown className="w-3 h-3" />
                    ))}
                </div>
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id} className="h-10">
            {row.getVisibleCells().map((cell) => (
              <TableCell
                key={cell.id}
                style={{ width: cell.column.getSize() }}
                className="h-10"
              >
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
);

const TablePagination = ({ table }) => {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-between px-2 space-y-4 lg:space-y-0">
      <div className="flex-1 text-sm text-muted-foreground text-center lg:text-left">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>
      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:justify-center items-center space-y-4 sm:space-y-2 sm:space-x-4 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium sm:order-3">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="flex flex-wrap justify-center items-center space-x-2 sm:order-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 sm:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 sm:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  );
};

function useTableData(results) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sorting, setSorting] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [loadingFormat, setLoadingFormat] = useState({});
  console.log(results);

  const filteredResults = useMemo(() => {
    return results.filter((row) =>
      Object.values(row).some((value) => {
        const searchTerms = searchTerm.toLowerCase().split(" ");
        return searchTerms.some((item) =>
          JSON.stringify(value ?? "")
            .toLowerCase()
            .includes(item.toLowerCase().trim())
        );
      })
    );
  }, [results, searchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    sorting,
    setSorting,
    rowSelection,
    setRowSelection,
    loadingFormat,
    setLoadingFormat,
    filteredResults,
  };
}

function useTableColumns(results) {
  const getColumns = (obj, columnKey = "") => {
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
  };

  const formatCell = (key, value) => {
    if (!value) return "";
    if (key.toLowerCase().includes("date")) {
      return new Date(value).toLocaleDateString();
    }
    return value;
  };

  return useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={table.toggleAllPageRowsSelected}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={row.toggleSelected}
          />
        ),
        size: 50,
      },
      {
        id: "index",
        header: "#",
        cell: ({ row, table }) =>
          table.getSortedRowModel().rows.findIndex((r) => r.id === row.id) + 1,
        size: 50,
      },
      ...getColumns(results[0]),
    ],
    [results]
  );
}
