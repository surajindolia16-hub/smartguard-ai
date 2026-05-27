import React, { useEffect, useState } from "react";

export default function App() {
  const [feed, setFeed] = useState([]);
  const [input, setInput] = useState("");

  const samplePosts = [
    "I love this platform",
    "This is stupid system",
    "Great innovation here",
    "I hate this update",
    "Amazing work team",
    "This app is useless"
  ];

  const moderate = async (text) => {
    const res = await fetch("http://localhost:5000/api/moderate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, userId: "user_1" })
    });

    return res.json();
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      const text =
        samplePosts[Math.floor(Math.random() * samplePosts.length)];

      const result = await moderate(text);

      setFeed((prev) => [result, ...prev.slice(0, 6)]);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const sendPost = async () => {
    const result = await moderate(input);
    setFeed((prev) => [result, ...prev]);
    setInput("");
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h2>🛡️ SmartGuard AI — Humanized Moderation System</h2>

      <div style={{ display: "flex", gap: 10 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Write a post..."
        />
        <button onClick={sendPost}>Post</button>
      </div>

      <hr />

      {feed.map((item, i) => (
        <div
          key={i}
          style={{
            borderLeft:
              item.label === "TOXIC"
                ? "5px solid red"
                : item.label === "REVIEW"
                ? "5px solid orange"
                : "5px solid green",
            padding: 10,
            margin: 10,
            background: "#f4f4f4"
          }}
        >
          <b>{item.input}</b>

          <p>
            Status: <b>{item.label}</b>
          </p>

          <p>Action: {item.action}</p>
          <p>Reason: {item.reason}</p>

          {item.label === "REVIEW" && (
            <small>⚠ Sent to human moderator queue</small>
          )}

          {item.matches && item.matches.length > 0 && (
            <small>
              Matched words:{" "}
              {item.matches.map((m) => m.word).join(", ")}
            </small>
          )}
        </div>
      ))}
    </div>
  );
}