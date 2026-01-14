export default function HashGenerator({
  password,
  setPassword,
  hash,
  onGenerateHash,
}) {
  return (
    <div>
      <h2>Generate SHA-256 Hash</h2>

      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter password"
        style={{ padding: 10, width: 320, marginRight: 10 }}
      />

      <button onClick={onGenerateHash} style={{ padding: "10px 14px" }}>
        Generate Hash
      </button>

      {hash && (
        <div style={{ marginTop: 12 }}>
          <div>
            <b>SHA-256:</b>
          </div>
          <code style={{ display: "block", marginTop: 6 }}>{hash}</code>
        </div>
      )}
    </div>
  );
}
