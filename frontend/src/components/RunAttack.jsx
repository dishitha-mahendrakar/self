export default function RunAttack({ attackType, setAttackType, onRunAttack }) {
  return (
    <div>
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

      <button onClick={onRunAttack} style={{ padding: "10px 14px" }}>
        Run Attack
      </button>
    </div>
  );
}
