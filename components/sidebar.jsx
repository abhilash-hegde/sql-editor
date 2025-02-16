"use client"

import { useState } from "react";
import TableList from "@/components/table-list";
import SavedQueries from "@/components/saved-queries";
import QueryHistory from "@/components/query-history";
import AvailableQueries from "@/components/available-queries";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronUp, ChevronDown } from "lucide-react";


export default function Sidebar({ tables, queryHistory, savedQueries, handleViewData, updateQueryTab, activeTab }) {
    const [expandedCollapsible, setExpandedCollapsible] = useState(null);
    const collapsibleList = [
        { title: "Available Queries", key: "availableQueries", component: <AvailableQueries onSelectQuery={(query) => updateQueryTab(activeTab, { query })} /> },
        { title: "Query History", key: "queryHistory", component: <QueryHistory history={queryHistory} onSelectQuery={(query) => updateQueryTab(activeTab, { query })} /> },
        { title: "Saved Queries", key: "savedQueries", component: <SavedQueries queries={savedQueries} onSelectQuery={(query) => updateQueryTab(activeTab, { query })} /> },
    ];
    return (
        <aside className="w-1/4 pr-4 space-y-4">
            <TableList tables={tables} onViewData={handleViewData} />
            {collapsibleList.map(({ title, key, component }) => (
                <CollapsibleSection key={key} title={title} isOpen={expandedCollapsible === key} setIsOpen={newOpenState => {
                    setExpandedCollapsible(newOpenState ? key : null);
                }}>
                    {component}
                </CollapsibleSection>))}
        </aside>
    );
}


function CollapsibleSection({ isOpen, setIsOpen, title, children }) {
    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger className="flex items-center">
                {isOpen ? <ChevronUp className="h-4 w-4 mr-2" /> : <ChevronDown className="h-4 w-4 mr-2" />}
                {title}
            </CollapsibleTrigger>
            <CollapsibleContent>{children}</CollapsibleContent>
        </Collapsible>
    );
}
