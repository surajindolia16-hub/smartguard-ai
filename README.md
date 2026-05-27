# 🛡️ SmartGuard AI — Real-Time Content Moderation System

## 🚀 Overview
SmartGuard AI is a real-time, explainable content moderation system that detects toxic, flagged, and safe messages using a rule-based AI engine.

It is designed to simulate real-world social media moderation systems like those used in platforms such as Reddit, Discord, and Twitter.

The system focuses on **transparency, explainability, and moderation control**, rather than black-box AI decisions.

---

## 🎯 Problem Statement
Social platforms struggle with:
- Toxic content detection in real-time
- Lack of transparency in moderation decisions
- No human override control system
- Difficulty in tracking moderation history

---

## 💡 Solution
SmartGuard AI solves this by introducing:

✔ Real-time content analysis  
✔ Explainable moderation decisions  
✔ Configurable rule-based detection system  
✔ Moderator override support  
✔ Live dashboard-style UI  

---

## ⚙️ Tech Stack

### Backend:
- Node.js
- Express.js
- CORS API handling

### Frontend:
- React.js
- JavaScript (ES6)
- LocalStorage (for persistence)

---

## 🧠 How It Works

1. User submits a text message
2. Backend normalizes and analyzes text
3. System checks against moderation rules:
   - Mild toxicity → FLAGGED
   - Severe toxicity → TOXIC
   - Clean content → SAFE
4. Backend returns structured response with:
   - label
   - action
   - confidence
   - metadata
5. Frontend displays real-time feed + stats dashboard

---

## 📊 Features

- ⚡ Real-time moderation simulation
- 🧠 Explainable AI-style decision output
- 📡 Live feed dashboard UI
- 📊 Safe / Flagged / Toxic analytics
- 🔁 Persistent stats using LocalStorage
- 🧑‍⚖️ Moderator override system (human-in-loop design)
- 🔧 Configurable moderation rules (no hardcoding dependency)

---

## 🧑‍💻 System Architecture

Frontend (React UI)
        ↓
API Request (fetch)
        ↓
Backend (Express Server)
        ↓
Rule-Based AI Engine
        ↓
Response (Label + Reason + Confidence)
        ↓
Frontend Dashboard Update

---

## 📸 UI Preview
(Add screenshots of dashboard here)

---

## 🔥 Key Highlights (Why this project stands out)

✔ Designed like a real production moderation system  
✔ Includes human override mechanism  
✔ Explainable AI decisions (not black-box)  
✔ Modular rule-based architecture  
✔ Real-time simulation of social media feed  

---

## 🚀 Future Improvements

- Integration with real ML/NLP model (BERT / GPT-based moderation)
- WebSocket-based live streaming system
- Role-based admin dashboard
- Database integration (MongoDB / PostgreSQL)
- Multi-community moderation support

---

## 👨‍💻 Author

Built as a Hackathon Project  
Focus: Real-world AI moderation systems + transparency in decision making

Suraj Indolia
---

## 📌 Note

This project demonstrates how **rule-based AI systems can be used as a transparent alternative to black-box moderation models**, making decisions explainable and auditable.
