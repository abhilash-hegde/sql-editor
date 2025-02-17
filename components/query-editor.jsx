import { useState } from "react";
import dynamic from "next/dynamic";
import { Maximize2, Minimize2, RefreshCw } from "lucide-react";
import exportData from "@/lib/export-data";
import { Button } from "@/components/ui/button";
import SQLInput from "@/components/sql-input";
import ExportButton from "@/components/export-button";

const QueryResults = dynamic(() => import("@/components/query-results"), {
  loading: () => <p>Loading...</p>,
});

export default function QueryEditor({ editor, onUpdate, onSave, onExecute }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const {
    results,
    query,
    isLoading,
    error,
    executionTime,
    totalRows,
    queryFetchedDate,
  } = editor;

  const handleKeyDown = (event) => {
    const isMac = navigator.userAgentData
      ? navigator.userAgentData.platform.toUpperCase().includes("MAC")
      : navigator.userAgent.toUpperCase().includes("MAC");

    if (event.key === "Enter" && (isMac ? event.metaKey : event.ctrlKey)) {
      onExecute(query);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <SQLInput
          value={query}
          onChange={(e) => onUpdate({ query: e.target.value })}
          onKeyDown={handleKeyDown}
        />
        <QueryActions
          query={query}
          isLoading={isLoading}
          onExecute={onExecute}
          onSave={onSave}
        />
      </div>
      {error && <div className="text-red-500">{error}</div>}
      {results && (
        <QueryResultsContainer
          executionTime={executionTime}
          totalRows={totalRows}
          queryFetchedDate={queryFetchedDate}
          results={results}
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
          onExecute={() => onExecute(query)}
        />
      )}
    </div>
  );
}

function ExportButtons({ results }) {
  const [loadingFormat, setLoadingFormat] = useState({});

  const onExportResults = (format) => {
    setLoadingFormat((prev) => ({
      ...prev,
      [format]: true,
    }));
    exportData(results, format, () => {
      setLoadingFormat((prev) => {
        const updated = { ...prev };
        delete updated[format];
        return updated;
      });
    });
  };

  return (
    <div className="flex space-x-4">
      <ExportButton
        exportText="Export Results"
        exportDataHandler={onExportResults}
        variant="default"
        loadingFormat={loadingFormat}
      />
    </div>
  );
}

function QueryActions({ query, isLoading, onExecute, onSave }) {
  return (
    <div className="flex flex-col space-y-2 min-w-[10rem]">
      <Button
        onClick={() => onExecute(query)}
        disabled={isLoading || !query?.trim()}
      >
        {isLoading ? "Executing..." : "Execute"}
      </Button>
      <Button onClick={onSave} disabled={!query?.trim()}>
        Save Query
      </Button>
    </div>
  );
}

function QueryResultsContainer({
  results,
  isExpanded,
  setIsExpanded,
  onExecute,
  executionTime,
  queryFetchedDate,
  totalRows,
}) {
  return (
    <div
      className={
        isExpanded ? "fixed inset-0 bg-white z-50 p-4 overflow-auto" : ""
      }
    >
      <div className="flex justify-between items-center mb-2">
        <Button onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </Button>
        <div className="text-xs text-gray-700 ml-2">
          {totalRows} row(s) fetched - {executionTime}ms on {queryFetchedDate}
        </div>
        <div className="flex space-x-4">
          <Button onClick={() => onExecute()}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <ExportButtons results={results} />
        </div>
      </div>
      <QueryResults
        results={results}
        executionTime={executionTime}
        totalRows={totalRows}
      />
    </div>
  );
}
