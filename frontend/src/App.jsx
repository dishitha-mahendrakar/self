// =======================
// 1) Imports (top of file)
// =======================
import { useState } from "react";
import { getHealth, API_BASE } from "./api";

// =======================
// 2) Component starts here
// =======================
export default function App() {
  // ======================================
  // 3) State variables (ALL useState here)
  // ======================================

  // Health check state
  const [status, setStatus] = useState(null);
  const [err, setErr] = useState("");

  // Hash generator state
  const [password, setPassword] = useState("");
  const [hash, setHash] = useState("");

  // Rule designer state
  const [rules, setRules] = useState({
    capitalize: false,
    lowercase: false,
    reverse: false,
    duplicate: false,
    toggleCase: false,
    appendDigits: false,
  });

  // Run attack state
  const [attackType, setAttackType] = useState("SHA-256");

  // Results state
  const [results, setResults] = useState([]);

  // History state
  const [history, setHistory] = useState([]);

  // ==================================================
  // 4) Functions (ALL API calling functions written here)
  // ==================================================

  // 4.1 Health check
  async function checkBackend() {
    setErr("");
    setStatus(null);
    try {
      const data = await getHealth();
      setStatus(data);
    } catch (e) {
      setErr(String(e.message || e));
    }
  }

  // 4.2 Generate hash
  async function generateHash() {
    setErr("");
    setHash("");
    try {
      const res = await fetch(`${API_BASE}/generate-hash`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      setHash(data.hash);
    } catch (e) {
      setErr(String(e.message || e));
    }
  }

  // 4.3 Save rules
  async function saveRules() {
    setErr("");
    try {
      const res = await fetch(`${API_BASE}/api/save-rules`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rules),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      alert("Rules saved on backend!");
    } catch (e) {
      setErr(String(e.message || e));
    }
  }

  // 4.4 Run attack
  async function runAttack() {
    setErr("");
    try {
      const res = await fetch(`${API_BASE}/run-hashcat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attackType }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      alert(`Attack done: ${data.attackType} in ${data.time}s`);
    } catch (e) {
      setErr(String(e.message || e));
    }
  }

  // 4.5 Load results
  async function loadResults() {
    setErr("");
    try {
      const res = await fetch(`${API_BASE}/results`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      setResults(data);
    } catch (e) {
      setErr(String(e.message || e));
    }
  }

  // 4.6 Load history
  async function loadHistory() {
    setErr("");
    try {
      const res = await fetch(`${API_BASE}/history`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      setHistory(data);
    } catch (e) {
      setErr(String(e.message || e));
    }
  }

  // ======================================
  // 5) UI (return block starts here)
  // ======================================
  return (
    <div style={{ padding: 24, fontFamily: "Arial" }}>
      {/* ----------------------------
          SECTION A: Title + Backend URL
         ---------------------------- */}
      <h1>Project 24</h1>

      <p>
        Backend URL: <code>{API_BASE}</code>
      </p>

      {/* ----------------------------
          SECTION B: Health Check
         ---------------------------- */}
      <button onClick={checkBackend} style={{ padding: "10px 14px" }}>
        Check Backend Health
      </button>

      {status && (
        <pre style={{ marginTop: 12, background: "#f5f5f5", padding: 12 }}>
          {JSON.stringify(status, null, 2)}
        </pre>
      )}

      {/* ----------------------------
          SECTION C: Hash Generator
         ---------------------------- */}
      <hr style={{ margin: "24px 0" }} />
      <h2>Generate SHA-256 Hash</h2>

      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter password"
        style={{ padding: 10, width: 320, marginRight: 10 }}
      />

      <button onClick={generateHash} style={{ padding: "10px 14px" }}>
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

      {/* ----------------------------
          SECTION D: Rule Designer
         ---------------------------- */}
      <hr style={{ margin: "24px 0" }} />
      <h2>Rule Designer</h2>

      <div style={{ display: "grid", gap: 8, maxWidth: 320 }}>
        {Object.keys(rules).map((key) => (
          <label
            key={key}
            style={{ display: "flex", gap: 10, alignItems: "center" }}
          >
            <input
              type="checkbox"
              checked={rules[key]}
              onChange={(e) =>
                setRules((prev) => ({ ...prev, [key]: e.target.checked }))
              }
            />
            {key}
          </label>
        ))}
      </div>

      <button
        onClick={saveRules}
        style={{ marginTop: 12, padding: "10px 14px" }}
      >
        Save Rules
      </button>

      {/* ----------------------------
          SECTION E: Run Attack
         ---------------------------- */}
      <hr style={{ margin: "24px 0" }} />
      <h2>Run Attack</h2>

      <select
        value={attackType}
        onChange={(e) => setAttackType(e.target.value)}
        style={{ padding: 10, marginRight: 10 }}
      >
        <option>SHA-256</option>
        <option>MD5</option>
        <option>SHA-1</option>
        <option>NTLM</option>
      </select>

      <button onClick={runAttack} style={{ padding: "10px 14px" }}>
        Run Attack
      </button>

      {/* ----------------------------
          SECTION F: Results Viewer
         ---------------------------- */}
      <hr style={{ margin: "24px 0" }} />
      <h2>Results</h2>

      <button onClick={loadResults} style={{ padding: "10px 14px" }}>
        Load Results
      </button>

      {results.length === 0 ? (
        <p style={{ marginTop: 12 }}>No results yet.</p>
      ) : (
        <pre style={{ marginTop: 12, background: "#f5f5f5", padding: 12 }}>
          {JSON.stringify(results, null, 2)}
        </pre>
      )}

      {/* ----------------------------
          SECTION G: History Viewer
         ---------------------------- */}
      <hr style={{ margin: "24px 0" }} />
      <h2>History</h2>

      <button onClick={loadHistory} style={{ padding: "10px 14px" }}>
        Load History
      </button>

      {history.length === 0 ? (
        <p style={{ marginTop: 12 }}>No history yet.</p>
      ) : (
        <pre style={{ marginTop: 12, background: "#f5f5f5", padding: 12 }}>
          {JSON.stringify(history, null, 2)}
        </pre>
      )}

      {/* ----------------------------
          SECTION H: Error display (bottom)
         ---------------------------- */}
      {err && (
        <p style={{ marginTop: 16, color: "red" }}>
          Error: {err}
        </p>
      )}
    </div>
  );
}
