import React, { useEffect, useState } from "react";

export default function App() {
  const [queue, setQueue] = useState({ pending: [] });

  const loadQueue = async () => {
    const res = await fetch("http://localhost:5000/api/queue");
    setQueue(await res.json());
  };

  useEffect(() => {
    loadQueue();
    const t = setInterval(loadQueue, 2000);
    return () => clearInterval(t);
  }, []);

  const action = async (type, item) => {
    await fetch(`http://localhost:5000/api/${type}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item)
    });

    loadQueue();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🛡️ SmartGuard Devvit Moderator Dashboard</h2>

      {queue.pending.map(item => (
        <div key={item.id} style={{
          border: "1px solid #ccc",
          margin: 10,
          padding: 10
        }}>
          <p><b>{item.text}</b></p>

          <p>Status: {item.label}</p>
          <p>Confidence: {item.confidence}</p>

          <button onClick={() => action("approve", item)}>Approve</button>
          <button onClick={() => action("remove", item)}>Remove</button>
          <button onClick={() => action("review", item)}>Review</button>
        </div>
      ))}
    </div>
  );
}