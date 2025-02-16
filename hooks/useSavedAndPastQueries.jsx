import { useState, useEffect } from "react";

export default function useSavedAndPastQueries() {
    const [savedQueries, setSavedQueries] = useState([]);
    const [queryHistory, setQueryHistory] = useState([]);

    useEffect(() => {
        const storedQueries = JSON.parse(localStorage.getItem("savedQueries")) || [];
        const storedHistory = JSON.parse(localStorage.getItem("queryHistory")) || [];
        setSavedQueries(storedQueries);
        setQueryHistory(storedHistory);
    }, []);

    function saveQuery(query, name) {
        const newQuery = { name, query };
        const updatedQueries = [...savedQueries, newQuery];
        setSavedQueries(updatedQueries);
        localStorage.setItem("savedQueries", JSON.stringify(updatedQueries));
    }

    function addToHistory(query) {
        const newHistory = [{ query, timestamp: new Date().toISOString() }, ...queryHistory.slice(0, 9)];
        setQueryHistory(newHistory);
        localStorage.setItem("queryHistory", JSON.stringify(newHistory));
    }

    return { queryHistory, savedQueries, saveQuery, addToHistory };
}
