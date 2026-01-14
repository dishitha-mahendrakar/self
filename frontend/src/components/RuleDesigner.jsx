export default function RuleDesigner({ rules, setRules, onSaveRules }) {
  return (
    <div>
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
        onClick={onSaveRules}
        style={{ marginTop: 12, padding: "10px 14px" }}
      >
        Save Rules
      </button>
    </div>
  );
}
