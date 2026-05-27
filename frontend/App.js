import React, { useState, useEffect } from "react";

export default function App() {
  const [text, setText] = useState("");
  const [out, setOut] = useState(null);
  const [stats, setStats] = useState(null);

  const run = async () => {
    const res = await fetch("http://localhost:5000/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });

    const json = await res.json();
    setOut(json.data);
  };

  const loadStats = async () => {
    const res = await fetch("http://localhost:5000/api/dashboard");
    setStats(await res.json());
  };

  useEffect(() => {
    loadStats();
    const t = setInterval(loadStats, 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>🛡️ SmartGuard Moderation System v15</h2>

      {stats && (
        <div style={{ background: "#eee", padding: 10 }}>
          <p>SAFE: {stats.SAFE}</p>
          <p>REVIEW: {stats.REVIEW}</p>
          <p>TOXIC: {stats.TOXIC}</p>
          <p>Total: {stats.total}</p>
        </div>
      )}

      <textarea
        rows={4}
        cols={50}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <br />
      <button onClick={run}>Analyze</button>

      {out && (
        <div style={{ marginTop: 20 }}>
          <p><b>Label:</b> {out.label}</p>
          <p><b>Score:</b> {out.score}</p>
          <p><b>Confidence:</b> {out.confidence}</p>
          <p><b>Matches:</b> {out.hits.join(", ")}</p>
        </div>
      )}
    </div>
  );
}