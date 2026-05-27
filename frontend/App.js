import React, { useEffect, useState } from "react";

export default function App() {
  const [feed, setFeed] = useState([]);
  const [input, setInput] = useState("");

  const communityPosts = [
    "I love this platform",
    "This is stupid system",
    "Great innovation",
    "I hate this update",
    "Amazing work team"
  ];

  const moderate = async (text) => {
    const res = await fetch("http://localhost:5000/api/moderate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        userId: "user_101",
        postId: Math.random(),
        community: "devvit-sim"
      })
    });

    return res.json();
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      const text = communityPosts[Math.floor(Math.random() * communityPosts.length)];
      const result = await moderate(text);
      setFeed(prev => [result, ...prev.slice(0, 6)]);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const sendPost = async () => {
    const result = await moderate(input);
    setFeed(prev => [result, ...prev]);
    setInput("");
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h2>🔥 SmartGuard AI — Devvit Style Moderation Simulator</h2>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Write a community post..."
      />
      <button onClick={sendPost}>Post</button>

      <hr />

      {feed.map((item, i) => (
        <div
          key={i}
          style={{
            borderLeft: item.label === "TOXIC" ? "5px solid red" : "5px solid green",
            padding: 10,
            margin: 10,
            background: "#f4f4f4"
          }}
        >
          <b>{item.input}</b>
          <p>Label: {item.label}</p>
          <p>Reason: {item.reason}</p>
          <small>User: {item.meta?.userId}</small>
        </div>
      ))}
    </div>
  );
}