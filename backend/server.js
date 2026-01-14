// =======================
// 1) Imports (top of file)
// =======================
const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const fs = require("fs");

// =======================
// 2) App setup
// =======================
const app = express();

// Middleware (must be above routes)
app.use(cors());
app.use(express.json());

// =======================
// 3) Routes start here
// =======================

// ------------------------------------
// ROUTE A) Health check
// Frontend uses: GET /health
// ------------------------------------
app.get("/health", (req, res) => {
  res.json({ ok: true, message: "Backend running" });
});

// ------------------------------------
// ROUTE B) Generate hash
// Frontend uses: POST /generate-hash
// Writes: hashes.txt (in backend folder)
// ------------------------------------
app.post("/generate-hash", (req, res) => {
  const password = req.body?.password;

  if (!password) {
    return res.status(400).json({ error: "Password cannot be empty" });
  }

  const hash = crypto.createHash("sha256").update(password).digest("hex");

  // saved in backend folder because node runs here
  fs.writeFileSync("hashes.txt", hash + "\n");

  res.json({ hash });
});

// ------------------------------------
// ROUTE C) Save rules
// Frontend uses: POST /api/save-rules
// Writes: rules.rule and rules.json
// ------------------------------------
app.post("/api/save-rules", (req, res) => {
  // Start rule file with identity rule
  let rulesFile = ":\n";
  const meta = {};

  // These flags come from frontend checkboxes
  if (req.body?.capitalize) {
    rulesFile += "c\n";
    meta.capitalize = true;
  }
  if (req.body?.lowercase) {
    rulesFile += "l\n";
    meta.lowercase = true;
  }
  if (req.body?.reverse) {
    rulesFile += "r\n";
    meta.reverse = true;
  }
  if (req.body?.duplicate) {
    rulesFile += "d\n";
    meta.duplicate = true;
  }
  if (req.body?.toggleCase) {
    rulesFile += "t\n";
    meta.toggleCase = true;
  }
  if (req.body?.appendDigits) {
    rulesFile += "$1\n$2\n$3\n";
    meta.appendDigits = true;
  }

  // Write both files
  fs.writeFileSync("rules.rule", rulesFile);
  fs.writeFileSync("rules.json", JSON.stringify(meta, null, 2));

  res.json({
    message: "Rules saved",
    meta,
    ruleLines: rulesFile.trim().split("\n").length,
  });
});

// ------------------------------------
// ROUTE D) Run attack (SIMULATED)
// Frontend uses: POST /run-hashcat
// Writes: time.txt, result.txt, history.json
// ------------------------------------
app.post("/run-hashcat", (req, res) => {
  const { attackType } = req.body || {};

  if (!attackType) {
    return res.status(400).json({ error: "attackType is required" });
  }

  // Simulate time taken
  const timeTaken = (Math.random() * 3 + 0.5).toFixed(2);
  fs.writeFileSync("time.txt", timeTaken);

  // Read hash from hashes.txt if it exists
  let hash = "";
  if (fs.existsSync("hashes.txt")) {
    hash = fs.readFileSync("hashes.txt", "utf-8").trim();
  }

  // Simulated output format expected by /results:
  // hash:password
  if (hash) {
    fs.writeFileSync("result.txt", `${hash}:hello123\n`);
  } else {
    fs.writeFileSync("result.txt", "");
  }

  // Append to history.json
  const history = fs.existsSync("history.json")
    ? JSON.parse(fs.readFileSync("history.json", "utf-8"))
    : [];

  history.push({
    attackType,
    time: Number(timeTaken),
    timestamp: new Date().toISOString(),
  });

  fs.writeFileSync("history.json", JSON.stringify(history, null, 2));

  res.json({
    message: "Attack completed (simulated)",
    attackType,
    time: timeTaken,
  });
});

// ------------------------------------
// ROUTE E) Results
// Frontend uses: GET /results
// Reads: result.txt, time.txt, rules.json
// Returns: array of {hash, password, time, rules}
// ------------------------------------
app.get("/results", (req, res) => {
  const time = fs.existsSync("time.txt")
    ? fs.readFileSync("time.txt", "utf-8")
    : "0";

  const rules = fs.existsSync("rules.json")
    ? JSON.parse(fs.readFileSync("rules.json", "utf-8"))
    : {};

  if (!fs.existsSync("result.txt")) {
    return res.json([]);
  }

  const results = fs
    .readFileSync("result.txt", "utf-8")
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const [hash, password] = line.split(":");
      return { hash, password, time, rules };
    });

  res.json(results);
});

// ------------------------------------
// ROUTE F) History
// Frontend uses: GET /history
// Reads: history.json
// ------------------------------------
app.get("/history", (req, res) => {
  if (!fs.existsSync("history.json")) {
    return res.json([]);
  }

  const history = JSON.parse(fs.readFileSync("history.json", "utf-8"));
  res.json(history);
});

// =======================
// 4) Server listen (bottom)
// =======================
app.listen(5000, "0.0.0.0", () => {
  console.log("Backend running on port 5000");
});


/*
curl -X POST "http://localhost:5000/api/save-rules" \
  -H "Content-Type: application/json" \
  -d '{"capitalize":true,"appendDigits":true,"reverse":true}'

cd ~/self/backend
echo "abcd1234hash:hello123" > result.txt
echo "1.23" > time.txt
curl http://localhost:5000/results

*/