import React from "react";
import "./training.css";

import Chatbot from "./components/Chatbot";
import { LEVELS } from "./components/level"; // data array
import { Link } from "react-router-dom";     // navigation for each level card

export default function Training() {
  return (
    <div className="training-container">

      {/* -------- LEVEL SECTION -------- */}
      <section className="levels-section">
        <div className="levels-header">
          <h2 className="levels-title">GREEN MISSIONS</h2>
          <p className="levels-subtitle">
            Complete tasks to earn GREEN COINS.
          </p>
        </div>

        {/* -------- LEVEL CARDS -------- */}
        <div className="levels-grid">
          {LEVELS.map((level) => (
            <Link
              key={level.id}
              to={`/training/levels/${level.id}`}  // Use this if your route is training-based
              className="level-card"
            >
              <div className="level-rank">Level {level.id}</div>
              <div className="level-icon">{level.icon}</div>
              <h3 className="level-name">{level.name}</h3>
              <span className="level-tag">{level.tag}</span>
              <p className="level-short">{level.short}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}