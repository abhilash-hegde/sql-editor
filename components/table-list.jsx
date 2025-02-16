"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Eye, EyeOff, Table } from "lucide-react";
import TableSchema from "./table-schema";

export default function TableList({ tables, onViewData }) {
  const [openTable, setOpenTable] = useState(null);
  const [schemaTable, setSchemaTable] = useState(null);

  const onCollapseOpenChange = (table) => () => {
    setOpenTable(openTable === table ? null : table);
    setSchemaTable(null);
  };

  const renderTable = (table) => (
    <Collapsible
      key={table}
      open={openTable === table}
      onOpenChange={onCollapseOpenChange(table)}
      className="bg-gray-50 px-2 rounded-md"
    >
      <CollapsibleTrigger asChild>
        <Button variant="text" className="w-full justify-between">
          {table}
          {openTable === table ? (
            <ChevronUp className="h-3 w-3" />
          ) : (
            <ChevronDown className="h-3 w-3" />
          )}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <TableActions
          table={table}
          schemaTable={schemaTable}
          setSchemaTable={setSchemaTable}
          onViewData={onViewData}
        />
      </CollapsibleContent>
    </Collapsible>
  );

  return (
    <div className="space-y-2">
      <h2 className="text-xl font-bold">Tables</h2>
      {tables.map(renderTable)}
    </div>
  );
}

function TableActions({ table, schemaTable, setSchemaTable, onViewData }) {
  const onSchemaVisibilityChange = () => {
    setSchemaTable((prev) => (prev === table ? null : table));
  };

  return (
    <>
      <div className="flex flex-col xl:flex-row space-y-2 xl:space-y-0 xl:space-x-2 align-center mt-1 pb-1">
        <Button
          onClick={() => onViewData(table)}
          variant="outline"
          className="text-xs bg-white"
        >
          <Table className="h-2 w-2 mr-1" />
          View Data
        </Button>
        <Button
          onClick={onSchemaVisibilityChange}
          variant="outline"
          className="text-xs bg-white"
        >
          {schemaTable ? (
            <EyeOff className="h-2 w-2 mr-1" />
          ) : (
            <Eye className="h-2 w-2 mr-1" />
          )}
          {schemaTable ? "Hide" : "View"} Schema
        </Button>
      </div>
      <div className="m-4">
        {schemaTable && <TableSchema schemaTable={schemaTable} />}
      </div>
    </>
  );
}
