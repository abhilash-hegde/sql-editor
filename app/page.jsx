"use client";

import { useState } from "react";
import { TABLES } from "@/constants/table";
import useSavedAndPastQueries from "@/hooks/useSavedAndPastQueries";
import fetchQueryData from "@/lib/fetch-query-data";
import SaveQueryDialog from "@/components/save-query-dialog";
import QueryTabs from "@/components/query-tabs";
import Sidebar from "@/components/sidebar";
import useQueryTabs from "@/hooks/useQueryTabs";

export default function SQLQueryRunner() {
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const { queryHistory, savedQueries, saveQuery, addToHistory } =
    useSavedAndPastQueries();
  const {
    queryTabs,
    activeTab,
    setActiveTab,
    addQueryTab,
    closeQueryTab,
    updateQueryTab,
  } = useQueryTabs();

  const handleViewData = (table) => {
    if (queryTabs.length === 5) {
      alert("You've reached the maximum number of query tabs.");
      return;
    }
    const query = `SELECT * FROM ${table};`;
    const newTabId = Date.now().toString();
    addQueryTab({ query, name: table, id: newTabId });
    executeQuery(newTabId, query);
  };

  const executeQuery = (id, query) => {
    fetchQueryData({ query, updateQueryTab, addToHistory, id });
  };

  return (
    <div className="container mx-auto p-4 flex">
      <Sidebar
        tables={TABLES}
        queryHistory={queryHistory}
        savedQueries={savedQueries}
        handleViewData={handleViewData}
        updateQueryTab={updateQueryTab}
        activeTab={activeTab}
      />
      <main className="w-3/4">
        <h1 className="text-2xl font-bold mb-4">SQL Query Editor</h1>
        <QueryTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          queryTabs={queryTabs}
          setIsSaveDialogOpen={setIsSaveDialogOpen}
          addQueryTab={addQueryTab}
          closeQueryTab={closeQueryTab}
          updateQueryTab={updateQueryTab}
          executeQuery={executeQuery}
        />
        <SaveQueryDialog
          isOpen={isSaveDialogOpen}
          onClose={() => setIsSaveDialogOpen(false)}
          onSave={(name) => {
            saveQuery(
              queryTabs.find((tab) => tab.id === activeTab).query,
              name
            );
            setIsSaveDialogOpen(false);
          }}
        />
      </main>
    </div>
  );
}
