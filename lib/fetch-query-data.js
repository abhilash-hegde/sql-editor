import availableQueries from "@/constants/available-queries";
import sqlResultGenerators from "@/lib/sql-result-generators";
import { TABLES } from "@/constants/table";
import { DATA_JSON_URL } from "@/constants/urls";

export default async function fetchQueryData({
  query,
  updateQueryTab,
  addToHistory,
  id,
}) {
  updateQueryTab(id, { isLoading: true, error: "" });
  let newTabname = "New Query Tab";

  const startTime = performance.now();

  try {
    const availableQuery = availableQueries.find(
      (availableQuery) => availableQuery.query === query
    );
    let results;

    if (availableQuery) {
      results = await fetchAvailableQueryData(availableQuery);
      newTabname = availableQuery.name;
    } else {
      let formattedQuery = query.replace(/\s\s+/g, "-").toLowerCase();
      const tableMatch = formattedQuery.match(/ * from (\w+)/);
      if (tableMatch.length > 0) {
        newTabname = tableMatch[1];
        if (TABLES.includes(tableMatch[1])) {
          results = await fetchTableData(tableMatch[1]);
        } else {
          throw new Error("Table Not Found!");
        }
      } else {
        throw new Error("Table Not Found!");
      }
    }

    const queryFetchedDate = new Date().toLocaleString();
    const endTime = performance.now();
    const executionTime = Math.round(endTime - startTime);

    const totalRows = Array.isArray(results)
      ? results.length
      : Object.keys(results).length;

    updateQueryTab(id, {
      name: newTabname,
      results,
      isLoading: false,
      executionTime,
      queryFetchedDate,
      totalRows,
    });

    addToHistory(query);
  } catch (err) {
    updateQueryTab(id, { error: err.message, isLoading: false });
  }
}

async function fetchTableData(table) {
  const response = await fetch(`${DATA_JSON_URL}${table}.json`);
  if (!response.ok) throw new Error("Failed to fetch data");
  return response.json();
}

async function fetchAvailableQueryData(availableQuery) {
  const { tables, queryKey } = availableQuery;
  const promises = tables.map(fetchTableData);
  const data = await Promise.all(promises);
  return sqlResultGenerators[queryKey](...data);
}
