cat > backend/server.js <<'EOF'
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ ok: true, message: "Backend running" });
});

app.listen(5000, "0.0.0.0", () => {
  console.log("Backend running on port 5000");
});
EOF
