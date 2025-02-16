self.importScripts(
  "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"
);

self.onmessage = (event) => {
  try {
    const { format, data } = event.data;
    const processedData = data.map((row) =>
      Object.fromEntries(
        Object.entries(row).map(([key, value]) => [
          key,
          typeof value === "object" && value !== null
            ? JSON.stringify(value)
            : value,
        ])
      )
    );

    let blob;
    let filename;

    if (format === "csv") {
      const csvContent = [
        Object.keys(processedData[0]).join(","),
        ...processedData.map((row) => Object.values(row).join(",")),
      ].join("\n");
      blob = new Blob([csvContent], { type: "text/csv" });
      filename = "export.csv";
    } else if (format === "xlsx") {
      const ws = XLSX.utils.json_to_sheet(processedData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Data");
      const xlsxData = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      blob = new Blob([xlsxData], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      filename = "export.xlsx";
    } else {
      blob = new Blob([JSON.stringify(processedData, null, 2)], {
        type: "application/json",
      });
      filename = "export.json";
    }
    self.postMessage({ blob, filename });
  } catch (error) {
    console.error("Export Worker Error:", error);
    self.postMessage({ error: error.message });
  }
};
