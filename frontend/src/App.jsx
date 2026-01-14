// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App

import { useState } from "react";
import { getHealth, API_BASE } from "./api";

export default function App() {
  const [status, setStatus] = useState(null);
  const [err, setErr] = useState("");

  // ✅ ADD HERE (inside App)
  const [rules, setRules] = useState({
    capitalize: false,
    lowercase: false,
    reverse: false,
    duplicate: false,
    toggleCase: false,
    appendDigits: false,
  });

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

  return (
    <div style={{ padding: 24, fontFamily: "Arial" }}>
      <h1>Project 24</h1>

      <p>
        Backend URL: <code>{API_BASE}</code>
      </p>

      <button onClick={checkBackend} style={{ padding: "10px 14px" }}>
        Check Backend Health
      </button>

      {status && (
        <pre style={{ marginTop: 16, background: "#f5f5f5", padding: 12 }}>
          {JSON.stringify(status, null, 2)}
        </pre>
      )}

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

      <button onClick={saveRules} style={{ marginTop: 12, padding: "10px 14px" }}>
        Save Rules
      </button>

      {err && (
        <p style={{ marginTop: 16, color: "red" }}>
          Error: {err}
        </p>
      )}
    </div>
  );
}
