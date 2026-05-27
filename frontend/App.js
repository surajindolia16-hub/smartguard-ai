import React, { useEffect, useState } from "react";

export default function App() {
  const [queue, setQueue] = useState({ pending: [] });

  const fetchQueue = async () => {
    const res = await fetch("http://localhost:5000/api/queue");
    const data = await res.json();
    setQueue(data);
  };

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 2000);
    return () => clearInterval(interval);
  }, []);

  const action = async (type, post) => {
    await fetch(`http://localhost:5000/api/${type}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(post)
    });

    fetchQueue();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🛡️ SmartGuard Moderator Dashboard (Devvit Ready)</h2>

      <h3>📌 Pending Queue</h3>

      {queue.pending?.map((p) => (
        <div key={p.id} style={{
          border: "1px solid #ccc",
          padding: 10,
          margin: 10
        }}>
          <p><b>{p.text}</b></p>

          <p>Status: {p.label}</p>
          <p>Confidence: {p.confidence}</p>

          <button onClick={() => action("approve", p)}>Approve</button>
          <button onClick={() => action("remove", p)}>Remove</button>
          <button onClick={() => action("review", p)}>Review</button>
        </div>
      ))}
    </div>
  );
}