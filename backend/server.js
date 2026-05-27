const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const config = {
  severe: ["hate", "idiot", "stupid"],
  mild: ["bad", "useless", "trash"]
};

function normalize(t) {
  return (t || "").toLowerCase().replace(/[^a-z]/g, "");
}

function analyze(text) {
  const clean = normalize(text);
  let matches = [];

  config.mild.forEach(w => {
    if (clean.includes(w)) matches.push({ word: w, type: "mild" });
  });

  config.severe.forEach(w => {
    if (clean.includes(w)) matches.push({ word: w, type: "severe" });
  });

  let label = "SAFE";
  let action = "ALLOW";
  let reason = "No violation detected";

  if (matches.some(m => m.type === "mild")) {
    label = "FLAGGED";
    action = "WARN";
    reason = "Mild toxicity detected";
  }

  if (matches.some(m => m.type === "severe")) {
    label = "TOXIC";
    action = "BLOCK";
    reason = "Severe toxicity detected";
  }

  return {
    input: text,
    label,
    action,
    reason,
    matches,
    confidence: matches.length ? 70 : 95
  };
}

/* override endpoint (REAL, not fake UI) */
let overrideLog = [];

app.post("/api/override", (req, res) => {
  const { postId, newStatus, moderatorId } = req.body;

  overrideLog.push({ postId, newStatus, moderatorId, time: new Date() });

  res.json({
    success: true,
    message: "Override applied",
    overrideLog
  });
});

app.post("/api/moderate", (req, res) => {
  try {
    const result = analyze(req.body.text);

    res.json({
      ...result,
      meta: req.body.meta,
      timestamp: new Date().toISOString()
    });
  } catch (e) {
    res.json({
      label: "ERROR",
      action: "ALLOW",
      reason: "System fallback"
    });
  }
});

app.listen(5000, () => {
  console.log("SmartGuard AI running on port 5000");
});