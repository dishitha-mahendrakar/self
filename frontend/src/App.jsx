import { useState } from "react";
import { getHealth, API_BASE } from "./api";

import HealthCheck from "./components/HealthCheck";
import HashGenerator from "./components/HashGenerator";
import RuleDesigner from "./components/RuleDesigner";
import RunAttack from "./components/RunAttack";
import ResultsHistory from "./components/ResultsHistory";

export default function App() {
  const [status, setStatus] = useState(null);
  const [err, setErr] = useState("");

  const [password, setPassword] = useState("");
  const [hash, setHash] = useState("");

  const [rules, setRules] = useState({
    capitalize: false,
    lowercase: false,
    reverse: false,
    duplicate: false,
    toggleCase: false,
    appendDigits: false,
  });

  const [attackType, setAttackType] = useState("SHA-256");

  const [results, setResults] = useState([]);
  const [history, setHistory] = useState([]);

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

  return (
    <div style={{ padding: 24, fontFamily: "Arial" }}>
      <h1>Project 24</h1>

      <HealthCheck API_BASE={API_BASE} getHealth={checkBackend} />

      {status && (
        <pre style={{ marginTop: 12, background: "#f5f5f5", padding: 12 }}>
          {JSON.stringify(status, null, 2)}
        </pre>
      )}

      <hr style={{ margin: "24px 0" }} />
      <HashGenerator
        password={password}
        setPassword={setPassword}
        hash={hash}
        onGenerateHash={generateHash}
      />

      <hr style={{ margin: "24px 0" }} />
      <RuleDesigner rules={rules} setRules={setRules} onSaveRules={saveRules} />

      <hr style={{ margin: "24px 0" }} />
      <RunAttack
        attackType={attackType}
        setAttackType={setAttackType}
        onRunAttack={runAttack}
      />

      <hr style={{ margin: "24px 0" }} />
      <ResultsHistory
        results={results}
        history={history}
        onLoadResults={loadResults}
        onLoadHistory={loadHistory}
      />

      {err && (
        <p style={{ marginTop: 16, color: "red" }}>
          Error: {err}
        </p>
      )}
    </div>
  );
}
