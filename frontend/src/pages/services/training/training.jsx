import React from "react";
import "./training.css";

import Chatbot from "./components/Chatbot";
import { LEVELS } from "./components/level"; // data array
import { Link } from "react-router-dom"; // navigation for each level card

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
              to={`/training/levels/${level.id}`} // Use this if your route is training-based
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
      {/* -------- GAMES SECTION -------- */}
      <section className="games-section">
        <div className="games-header">
          <h2 className="games-title">Educational Games</h2>
          <p className="games-subtitle">
            Fun and interactive games for children to learn waste management,
            segregation, and recycling.
          </p>
        </div>

        <div className="games-content">
          <div className="game-card">
            <div className="game-icon">🎮</div>
            <h3 className="game-name">Recycling Rush</h3>
            <p className="game-desc">
              Drag and drop waste items into the correct bins. Learn
              biodegradable, recyclable, hazardous, and mixed waste categories.
            </p>

            <Link to="/training/game" className="game-btn">
              Play Now →
            </Link>
          </div>
          <div className="game-card coming-soon">
            <div className="game-icon">⏳</div>
            <h3 className="game-name">More Games Coming Soon</h3>
            <p className="game-desc">
              We're building interactive environmental challenges, quizzes, and
              sorting mini-games to help you learn while having fun. Stay tuned!
            </p>

            <button
              className="game-btn"
              disabled
              style={{ opacity: 0.6, cursor: "not-allowed" }}
            >
              Coming Soon
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
