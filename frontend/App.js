import React, { useEffect, useState } from "react";

const initialStats = () =>
  JSON.parse(localStorage.getItem("sg_stats")) || {
    safe: 0,
    flagged: 0,
    toxic: 0
  };

export default function App() {
  const [feed, setFeed] = useState([]);
  const [stats, setStats] = useState(initialStats());

  const comments = [
    "I hate this",
    "Great work team",
    "You are stupid",
    "Amazing system",
    "This is bad",
    "Love it"
  ];

  const moderate = async (text) => {
    const res = await fetch("http://localhost:5000/api/moderate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        meta: {
          userId: "user_01",
          postId: Math.random().toString(36).slice(2)
        }
      })
    });

    return await res.json();
  };

  const override = async (postId) => {
    await fetch("http://localhost:5000/api/override", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        postId,
        newStatus: "SAFE",
        moderatorId: "mod_01"
      })
    });

    alert("Override sent to backend");
  };

  useEffect(() => {
    let i = 0;

    const interval = setInterval(async () => {
      const result = await moderate(comments[i % comments.length]);
      i++;

      setFeed((prev) => [result, ...prev.slice(0, 6)]);

      setStats((prev) => {
        const updated = {
          safe: prev.safe + (result.label === "SAFE"),
          flagged: prev.flagged + (result.label === "FLAGGED"),
          toxic: prev.toxic + (result.label === "TOXIC")
        };

        localStorage.setItem("sg_stats", JSON.stringify(updated));
        return updated;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ fontFamily: "Segoe UI", padding: 20 }}>
      <h2>🛡 SmartGuard AI — Final Submission System</h2>

      {/* STATS */}
      <div style={{ display: "flex", gap: 10 }}>
        <Box t="SAFE" v={stats.safe} c="green" />
        <Box t="FLAGGED" v={stats.flagged} c="orange" />
        <Box t="TOXIC" v={stats.toxic} c="red" />
      </div>

      <hr />

      {/* FEED */}
      {feed.map((item, i) => (
        <div key={i} style={card(item.label)}>
          <b>{item.input}</b>
          <p>{item.label} → {item.action}</p>
          <p>{item.reason}</p>

          {item.label !== "SAFE" && (
            <button onClick={() => override(item.meta.postId)}>
              Moderator Override
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

function Box({ t, v, c }) {
  return (
    <div style={{ background: c, color: "white", padding: 10 }}>
      <b>{t}</b> {v}
    </div>
  );
}

function card(type) {
  return {
    padding: 10,
    margin: 8,
    borderLeft: `5px solid ${
      type === "TOXIC" ? "red" : type === "FLAGGED" ? "orange" : "green"
    }`,
    background: "#f5f5f5"
  };
}