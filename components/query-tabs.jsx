"use client";

import { Button } from "@/components/ui/button";
import QueryEditor from "@/components/query-editor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, X } from "lucide-react";

export default function QueryTabs({
  activeTab,
  setActiveTab,
  queryTabs,
  setIsSaveDialogOpen,
  addQueryTab,
  closeQueryTab,
  updateQueryTab,
  executeQuery,
}) {
  const doNotEnableClose = queryTabs.length === 1;

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <TabsList className="flex w-max">
            {queryTabs.map((tab) => (
              <div key={tab.id} className="relative flex items-center">
                <TabsTrigger
                  value={tab.id.toString()}
                  className="flex items-center px-3 py-1 space-x-2"
                >
                  <span className="truncate">{tab.name}</span>
                  <span className="invisible">{"  X  "}</span>
                </TabsTrigger>
                {!doNotEnableClose && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      closeQueryTab(tab.id);
                    }}
                    className="absolute right-0 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </TabsList>
        </div>
        <Button
          onClick={addQueryTab}
          variant="outline"
          size="sm"
          className="whitespace-nowrap"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">New Query</span>
        </Button>
      </div>
      {queryTabs.map((tab) => (
        <TabsContent key={tab.id} value={tab.id.toString()}>
          <QueryEditor
            editor={tab}
            onUpdate={(updates) => updateQueryTab(tab.id, updates)}
            onSave={() => setIsSaveDialogOpen(true)}
            onExecute={(query) => executeQuery(tab.id, query)}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
}
