import React, { useState } from "react";
import "./training.css";

export default function Training() {
  // ----------------------- INFO CARDS -----------------------
  const infoCards = [
    { title: "Wet Waste", desc: "Organic waste like food scraps, vegetable peels, leftovers, and similar biodegradable items." },
    { title: "Dry Waste", desc: "Paper, plastic, metal, cardboard, packaging items — all non-biodegradable waste." },
    { title: "Hazardous Waste", desc: "Batteries, electronic waste, paint cans, chemicals, medical waste and flammable items." },
    { title: "E-Waste", desc: "Mobile phones, chargers, wires, computer parts, old electronics — dispose separately." },
    { title: "Civic Sense", desc: "Basic cleanliness, using dustbins, avoiding littering and respecting shared spaces." },
    { title: "Recyclables", desc: "Plastic bottles, glass jars, metal cans — clean and dry before sending for recycling." }
  ];

  // ----------------------- Flashcards state -----------------------
  const [flippedCards, setFlippedCards] = useState(Array(infoCards.length).fill(false));
  const toggleFlip = (index) => {
    const newFlipped = [...flippedCards];
    newFlipped[index] = !newFlipped[index];
    setFlippedCards(newFlipped);
  };

  // ----------------------- QUIZ -----------------------
  const quizQuestions = [
    { q: "Which bin does plastic go into?", a: "Dry Waste" },
    { q: "Is food leftover wet waste?", a: "Yes" },
    { q: "Where should batteries be disposed?", a: "Hazardous Waste" },
    { q: "Can medical waste be mixed with dry waste?", a: "No" },
    { q: "Is glass recyclable?", a: "Yes" }
  ];

  const [quizStep, setQuizStep] = useState(0);
  const [score, setScore] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [greenCoins, setGreenCoins] = useState(0);

  const handleQuizAnswer = (answer) => {
    let newScore = score;
    if (answer === quizQuestions[quizStep].a) newScore += 1;

    if (quizStep + 1 < quizQuestions.length) {
      setQuizStep(quizStep + 1);
    } else {
      setQuizStep("done");
      setGreenCoins(newScore * 10); // 10 coins per correct answer
    }
    setScore(newScore);
  };

  // ----------------------- CHATBOT -----------------------
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! I'm your Waste Training Assistant. How can I help you?" }
  ]);

  const predefinedReplies = {
    segregation: "Segregate waste into Wet, Dry & Hazardous. Wet is organic, Dry is recyclables, Hazardous includes batteries & medical waste.",
    ewaste: "E-waste includes electronics like phones, chargers, wires. Dispose only at authorized centers.",
    bins: "Green bin → Wet waste. Blue bin → Dry waste. Red bin → Hazardous waste."
  };

  const sendUserMessage = (key) => {
    const userMsg = { sender: "user", text: key };
    const botMsg = { sender: "bot", text: predefinedReplies[key] || "Sorry, I didn't get that." };
    setMessages(prev => [...prev, userMsg, botMsg]);
  };

  return (
    <div className="training-container">
      {/* -------- HEADER & CHATBOT ICON -------- */}
      <div className="training-header">
        <h1 className="training-title">Training & Awareness</h1>
        <div className="chatbot-icon" onClick={() => setChatOpen(!chatOpen)}>💬</div>
      </div>

      {chatOpen && (
        <div className="chatbox">
          <div className="chat-messages">
            {messages.map((m, i) => (
              <div key={i} className={`chat-message ${m.sender}`}>{m.text}</div>
            ))}
          </div>
          <div className="chat-options">
            <button onClick={() => sendUserMessage("segregation")}>Segregation</button>
            <button onClick={() => sendUserMessage("ewaste")}>E-Waste</button>
            <button onClick={() => sendUserMessage("bins")}>Bins Info</button>
          </div>
        </div>
      )}

      {/* ---------------- FLASHCARDS ---------------- */}
      <h2 className="section-heading">Waste Segregation Basics</h2>
      <div className="cards-container">
        {infoCards.map((card, i) => (
          <div
            key={i}
            className={`flash-card ${flippedCards[i] ? "flipped" : ""}`}
            onClick={() => toggleFlip(i)}
          >
            <div className="front">{card.title}</div>
            <div className="back">{card.desc}</div>
          </div>
        ))}
      </div>

      {/* ---------------- QUIZ ---------------- */}
      <h2 className="section-heading">Quick Quiz</h2>
      {!showQuiz ? (
        <button className="start-quiz-btn" onClick={() => setShowQuiz(true)}>Start Quiz</button>
      ) : (
        <div className="quiz-box">
          {quizStep === "done" ? (
            <div className="quiz-result">
              <h3>Quiz Completed! 🎉</h3>
              <p>Your Score: {score} / {quizQuestions.length}</p>
              <p>GreenCoins Earned: {greenCoins} 🪙</p>
            </div>
          ) : (
            <>
              <p className="quiz-question">{quizQuestions[quizStep].q}</p>
              <div className="quiz-options">
                <button onClick={() => handleQuizAnswer("Yes")}>Yes</button>
                <button onClick={() => handleQuizAnswer("No")}>No</button>
                <button onClick={() => handleQuizAnswer("Wet Waste")}>Wet Waste</button>
                <button onClick={() => handleQuizAnswer("Dry Waste")}>Dry Waste</button>
                <button onClick={() => handleQuizAnswer("Hazardous Waste")}>Hazardous Waste</button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
