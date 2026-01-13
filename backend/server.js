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
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: "Password cannot be empty" });
  }

  const hash = crypto.createHash("sha256").update(password).digest("hex");

  // store the generated hash for later use by hashcat step
  fs.writeFileSync("hashes.txt", hash + "\n");

  res.json({ hash });
});
