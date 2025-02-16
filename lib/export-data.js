export default function exportData(data, format, onComplete) {
  const worker = new Worker("/workers/exportWorker.js");

  worker.postMessage({ format, data });

  worker.onmessage = (event) => {
    if (event.data.error) {
      console.error("Export Error:", event.data.error);
      if (onComplete) {
        onComplete();
      }
      return;
    }
    const { blob, filename } = event.data;
    downloadBlob(blob, filename);
    if (onComplete) {
      onComplete();
    }
  };
}

function downloadBlob(blob, filename) {
  const link = document.createElement("a");
  console.log(link);
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
