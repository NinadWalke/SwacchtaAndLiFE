import React, { useState } from "react";
import "../training.css";

export default function Chatbot() {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! I'm your Waste Training Assistant. How can I help you?" }
  ]);

  const predefinedReplies = {
    segregation:
      "Segregate waste into Wet, Dry & Hazardous. Wet is organic, Dry is recyclables, Hazardous includes batteries & medical waste.",
    ewaste:
      "E-waste includes electronics like phones, chargers, wires. Dispose only at authorized centers.",
    bins:
      "Green bin → Wet waste. Blue bin → Dry waste. Red bin → Hazardous waste."
  };

  const sendUserMessage = (key) => {
    const userMsg = { sender: "user", text: key };
    const botMsg = {
      sender: "bot",
      text: predefinedReplies[key] || "Sorry, I didn't get that."
    };

    setMessages((prev) => [...prev, userMsg, botMsg]);
  };

  return (
    <>
      <div className="chatbot-icon" onClick={() => setChatOpen(!chatOpen)}>
        💬
      </div>

      {chatOpen && (
        <div className="chatbox">
          <div className="chat-messages">
            {messages.map((m, i) => (
              <div key={i} className={`chat-message ${m.sender}`}>
                {m.text}
              </div>
            ))}
          </div>

          <div className="chat-options">
            <button onClick={() => sendUserMessage("segregation")}>Segregation</button>
            <button onClick={() => sendUserMessage("ewaste")}>E-Waste</button>
            <button onClick={() => sendUserMessage("bins")}>Bins Info</button>
          </div>
        </div>
      )}
    </>
  );
}
