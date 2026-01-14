const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ ok: true, message: "Backend running" });
});

app.listen(5000, "0.0.0.0", () => {
  console.log("Backend running on port 5000");
});


app.post("/generate-hash", (req, res) => {
  const password = req.body?.password;

  if (!password) {
    return res.status(400).json({ error: "Password cannot be empty" });
  }

  const hash = crypto.createHash("sha256").update(password).digest("hex");
  fs.writeFileSync("hashes.txt", hash + "\n");
  res.json({ hash });
});

app.post("/api/save-rules", (req, res) => {
  // Start rule file with identity rule
  let rulesFile = ":\n";
  const meta = {};

  // Expect boolean flags from frontend
  // Example: { capitalize: true, reverse: true, appendDigits: true }
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

  // Write files inside backend folder
  fs.writeFileSync("rules.rule", rulesFile);
  fs.writeFileSync("rules.json", JSON.stringify(meta, null, 2));

  res.json({
    message: "Rules saved",
    meta,
    ruleLines: rulesFile.trim().split("\n").length
  });
});

app.get("/results", (req, res) => {
  const time = fs.existsSync("time.txt") ? fs.readFileSync("time.txt", "utf-8") : "0";

  const rules = fs.existsSync("rules.json")
    ? JSON.parse(fs.readFileSync("rules.json", "utf-8"))
    : {};

  // result.txt contains lines like: hash:password
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

/*
curl -X POST "http://localhost:5000/api/save-rules" \
  -H "Content-Type: application/json" \
  -d '{"capitalize":true,"appendDigits":true,"reverse":true}'

cd ~/self/backend
echo "abcd1234hash:hello123" > result.txt
echo "1.23" > time.txt
curl http://localhost:5000/results

*/