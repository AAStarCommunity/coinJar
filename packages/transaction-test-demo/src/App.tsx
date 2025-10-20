import { useState, useEffect, useCallback } from "react";
import "./App.css";
import TestEnvironmentSetup from "./components/TestEnvironmentSetup";
import TestControlPanel from "./components/TestControlPanel";
import RealTimeMetrics from "./components/RealTimeMetrics";
import ResultsExport from "./components/ResultsExport";

const BACKEND_URL = "http://localhost:4000"; // Our fake backend URL

function App() {
  const [config, setConfig] = useState({
    bundlerUrl:
      "https://api.pimlico.io/v1/sepolia/rpc?apikey=YOUR_PIMLICO_API_KEY",
    paymasterUrl: "https://api.aastar.xyz/paymaster",
  });
  const [configSaved, setConfigSaved] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [transactionsSent, setTransactionsSent] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [statusMessage, setStatusMessage] = useState("Idle");
  const [results, setResults] = useState<any[]>([]);

  const handleSaveConfig = (newConfig: {
    bundlerUrl: string;
    paymasterUrl: string;
  }) => {
    setConfig(newConfig);
    setConfigSaved(true);
    console.log("Configuration saved:", newConfig);
    // Here you might send config to backend if needed, but for now it's frontend state
  };

  const fetchStatus = useCallback(async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/test/status`);
      const data = await response.json();
      setIsRunning(data.isRunning);
      setTransactionsSent(data.transactionsSent);
      setTotalTransactions(data.totalTransactions);
      setStatusMessage(data.isRunning ? "Running" : "Stopped");
    } catch (error) {
      console.error("Failed to fetch status:", error);
      setStatusMessage("Error fetching status");
    }
  }, []);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (configSaved) {
      fetchStatus(); // Fetch initial status
      intervalId = setInterval(fetchStatus, 5000); // Poll every 5 seconds
    }
    return () => clearInterval(intervalId);
  }, [configSaved, fetchStatus]);

  const startTest = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/test/start`, {
        method: "POST",
      });
      const data = await response.json();
      console.log(data.message);
      fetchStatus(); // Update status immediately
    } catch (error) {
      console.error("Failed to start test:", error);
    }
  };

  const stopTest = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/test/stop`, {
        method: "POST",
      });
      const data = await response.json();
      console.log(data.message);
      fetchStatus(); // Update status immediately
    } catch (error) {
      console.error("Failed to stop test:", error);
    }
  };

  const exportResults = async (format: "json" | "csv") => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/test/results?format=${format}`,
      );
      if (format === "csv") {
        const csvData = await response.text();
        console.log("CSV Results:\n", csvData);
        // You might want to trigger a download here
        const blob = new Blob([csvData], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `test_results.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        const jsonData = await response.json();
        setResults(jsonData);
        console.log("JSON Results:", jsonData);
      }
    } catch (error) {
      console.error(`Failed to export ${format} results:`, error);
    }
  };

  return (
    <div className="App">
      <h1>Test Orchestration Frontend</h1>
      {!configSaved ? (
        <TestEnvironmentSetup
          onSave={handleSaveConfig}
          initialConfig={config}
        />
      ) : (
        <>
          <div className="config-display card">
            <h2>Current Configuration</h2>
            <p>Bundler: {config.bundlerUrl}</p>
            <p>Paymaster: {config.paymasterUrl}</p>
            <button onClick={() => setConfigSaved(false)}>
              Edit Configuration
            </button>
          </div>
          <TestControlPanel
            isRunning={isRunning}
            onStart={startTest}
            onStop={stopTest}
            statusMessage={statusMessage}
          />
          <RealTimeMetrics
            transactionsSent={transactionsSent}
            totalTransactions={totalTransactions}
          />
          <ResultsExport
            onExportJson={() => exportResults("json")}
            onExportCsv={() => exportResults("csv")}
          />
          {results.length > 0 && (
            <div className="card">
              <h2>Last Exported JSON Results</h2>
              <pre>{JSON.stringify(results, null, 2)}</pre>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
