export default function ResultsHistory({
  results,
  history,
  onLoadResults,
  onLoadHistory,
}) {
  return (
    <div>
      <h2>Results</h2>
      <button onClick={onLoadResults} style={{ padding: "10px 14px" }}>
        Load Results
      </button>

      {results.length === 0 ? (
        <p style={{ marginTop: 12 }}>No results yet.</p>
      ) : (
        <pre style={{ marginTop: 12, background: "#f5f5f5", padding: 12 }}>
          {JSON.stringify(results, null, 2)}
        </pre>
      )}

      <hr style={{ margin: "24px 0" }} />

      <h2>History</h2>
      <button onClick={onLoadHistory} style={{ padding: "10px 14px" }}>
        Load History
      </button>

      {history.length === 0 ? (
        <p style={{ marginTop: 12 }}>No history yet.</p>
      ) : (
        <pre style={{ marginTop: 12, background: "#f5f5f5", padding: 12 }}>
          {JSON.stringify(history, null, 2)}
        </pre>
      )}
    </div>
  );
}
