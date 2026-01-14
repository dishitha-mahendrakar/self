export default function HealthCheck({ API_BASE, getHealth }) {
  return (
    <div>
      <h2>Health</h2>
      <p>
        Backend URL: <code>{API_BASE}</code>
      </p>
      <button onClick={getHealth} style={{ padding: "10px 14px" }}>
        Check Backend Health
      </button>
    </div>
  );
}
