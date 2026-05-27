import React, { useEffect, useState } from "react";

export default function App() {
  const [stats, setStats] = useState(null);

  const load = async () => {
    const res = await fetch("http://localhost:5000/dashboard");
    setStats(await res.json());
  };

  useEffect(() => {
    load();
    const t = setInterval(load, 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ padding: 30, fontFamily: "Arial" }}>
      <h1>🛡️ SmartGuard V3 Dashboard</h1>

      {stats && (
        <div style={{ background: "#111", color: "white", padding: 20 }}>
          <h3>Live Moderation Stats</h3>
          <p>SAFE: {stats.SAFE}</p>
          <p>REVIEW: {stats.REVIEW}</p>
          <p>TOXIC: {stats.TOXIC}</p>
          <p>Total: {stats.total}</p>
        </div>
      )}

      <p style={{ marginTop: 20, opacity: 0.7 }}>
        Real-time Devvit moderation analytics system
      </p>
    </div>
  );
}