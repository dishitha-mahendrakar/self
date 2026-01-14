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

  // Hash Generator
  const [password, setPassword] = useState("");
  const [hash, setHash] = useState("");

  // Rule Designer
  const [rules, setRules] = useState({
    capitalize: false,
    lowercase: false,
    reverse: false,
    duplicate: false,
    toggleCase: false,
    appendDigits: false,
  });

  // Run Attack
  const [attackType, setAttackType] = useState("SHA-256");

  // Results + History
  const [results, setResults] = useState([]);
  const [history, setHistory] = useState([]);

  // ✅ Proof Viewer (NEW)
  const [fileList, setFileList] = useState([]);
  const [fileName, setFileName] = useState("hashes.txt");
  const [fileContent, setFileContent] = useState("");

  // ---------------------------
  // Health check
  // ---------------------------
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

  // ---------------------------
  // Generate hash
  // ---------------------------
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

  // ---------------------------
  // Save rules
  // ---------------------------
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

  // ---------------------------
  // Run attack
  // ---------------------------
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

  // ---------------------------
  // Load results
  // ---------------------------
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

  // ---------------------------
  // Load history
  // ---------------------------
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

  // ✅ ---------------------------
  // ✅ Proof Viewer: list files
  // ✅ ---------------------------
  async function loadFileList() {
    setErr("");
    try {
      const res = await fetch(`${API_BASE}/debug/files`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      setFileList(data);
    } catch (e) {
      setErr(String(e.message || e));
    }
  }

  // ✅ ---------------------------
  // ✅ Proof Viewer: read file
  // ✅ ---------------------------
  async function readFile() {
    setErr("");
    setFileContent("");
    try {
      const res = await fetch(`${API_BASE}/debug/read/${fileName}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      setFileContent(data.content);
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

      {/* ✅ NEW: Proof Viewer Section */}
      <hr style={{ margin: "24px 0" }} />
      <h2>Proof: Backend Files</h2>

      <button onClick={loadFileList} style={{ padding: "10px 14px" }}>
        List Files
      </button>

      {fileList.length > 0 && (
        <pre style={{ marginTop: 12, background: "#f5f5f5", padding: 12 }}>
          {JSON.stringify(fileList, null, 2)}
        </pre>
      )}

      <div style={{ marginTop: 12 }}>
        <select
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          style={{ padding: 10, marginRight: 10 }}
        >
          <option>hashes.txt</option>
          <option>rules.rule</option>
          <option>rules.json</option>
          <option>result.txt</option>
          <option>time.txt</option>
          <option>history.json</option>
        </select>

        <button onClick={readFile} style={{ padding: "10px 14px" }}>
          Read File
        </button>
      </div>

      {fileContent !== "" && (
        <pre style={{ marginTop: 12, background: "#f5f5f5", padding: 12 }}>
          {fileContent}
        </pre>
      )}

      {err && (
        <p style={{ marginTop: 16, color: "red" }}>
          Error: {err}
        </p>
      )}
    </div>
  );
}
