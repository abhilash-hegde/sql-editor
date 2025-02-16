import { Fragment } from "react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function TableSchema({ schemaTable }) {
  if (!schemaTable) return null;
  const schema = require(`@/mockdata/schema/${schemaTable}.json`);
  return (
    <Card className="mb-4 p-3 shadow-sm">
      <TableSchemaContent schema={schema} />
    </Card>
  );
}

function TableSchemaContent({ schema, level }) {
  return (
    <Table className="text-sm">
      <TableHeader>
        <TableRow>
          <TableHead>Column</TableHead>
          <TableHead>Type</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {schema.map((column) => (
          <Fragment key={column.columnName}>
            <TableRow
              className={level === 0 ? "bg-gray-100 font-bold" : "pl-4"}
            >
              <TableCell className={level === 0 ? "font-semibold" : "pl-6"}>
                {column.columnName}
              </TableCell>
              <TableCell>{column.dataType}</TableCell>
            </TableRow>
            {column.children && (
              <TableRow>
                <TableCell colSpan={2} className="pl-8">
                  <TableSchemaContent
                    schema={column.children}
                    level={level + 1}
                  />
                </TableCell>
              </TableRow>
            )}
          </Fragment>
        ))}
      </TableBody>
    </Table>
  );
}
