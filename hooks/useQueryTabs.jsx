import { useState } from "react";

const DEFAULT_QUERY_TAB = {
  id: Date.now().toString(),
  name: "Query Tab",
  query: "",
  results: null,
  isLoading: false,
  error: "",
};

export default function useQueryTabs() {
  const [queryTabs, setQueryTabs] = useState([DEFAULT_QUERY_TAB]);
  const [activeTab, setActiveTab] = useState(DEFAULT_QUERY_TAB.id);

  const addQueryTab = ({
    id = Date.now().toString(),
    query = "",
    name = "Query Tab",
  } = {}) => {
    if (queryTabs.length === 5) {
      alert("You've reached the maximum number of query tabs.");
      return;
    }
    const newTab = {
      id,
      name,
      query,
      results: null,
      isLoading: false,
      error: "",
    };
    setQueryTabs((prev) => [...prev, newTab]);
    setTimeout(() => {
      setActiveTab(id.toString());
    }, 0);
  };

  const closeQueryTab = (id) => {
    setQueryTabs((prev) => prev.filter((tab) => tab.id !== id));
    if (activeTab.toString() === id.toString()) {
      console.log(activeTab.toString() === id.toString());
      const lastTab = queryTabs[queryTabs.length - 2];
      setActiveTab(lastTab ? lastTab.id : DEFAULT_QUERY_TAB.id);
    }
  };

  const updateQueryTab = (id, updates) => {
    setQueryTabs((prev) =>
      prev.map((tab) => (tab.id === id ? { ...tab, ...updates } : tab))
    );
  };

  return {
    queryTabs,
    activeTab,
    setActiveTab,
    addQueryTab,
    setQueryTabs,
    closeQueryTab,
    updateQueryTab,
  };
}
