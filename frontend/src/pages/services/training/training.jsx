import React from "react";
import "./training.css";

import Flashcards from "./components/Flashcards";
import Quiz from "./components/Quiz";
import Chatbot from "./components/Chatbot";

export default function Training() {
  return (
    <div className="training-container">
      {/* -------- HEADER & CHATBOT ICON -------- */}
      <div className="training-header">
        <h1 className="training-title">Training & Awareness</h1>
        <Chatbot />
      </div>

      {/* -------- FLASHCARDS SECTION -------- */}
      <Flashcards />

      {/* -------- QUIZ SECTION -------- */}
      <Quiz />
    </div>
  );
}
