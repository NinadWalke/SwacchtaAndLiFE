import React, { useState } from "react";
import "../training.css";

export default function Flashcards() {
  const infoCards = [
    { 
      title: "Wet Waste", 
      desc: "Organic waste like food scraps, vegetable peels, leftovers, and similar biodegradable items." 
    },
    { 
      title: "Dry Waste", 
      desc: "Paper, plastic, metal, cardboard, packaging items — all non-biodegradable waste." 
    },
    { 
      title: "Hazardous Waste", 
      desc: "Batteries, electronic waste, paint cans, chemicals, medical waste and flammable items." 
    },
    { 
      title: "E-Waste", 
      desc: "Mobile phones, chargers, wires, computer parts, old electronics — dispose separately." 
    },
    { 
      title: "Civic Sense", 
      desc: "Basic cleanliness, using dustbins, avoiding littering and respecting shared spaces." 
    },
    { 
      title: "Recyclables", 
      desc: "Plastic bottles, glass jars, metal cans — clean and dry before sending for recycling." 
    }
  ];

  const [flippedCards, setFlippedCards] = useState(
    Array(infoCards.length).fill(false)
  );

  const toggleFlip = (index) => {
    const updated = [...flippedCards];
    updated[index] = !updated[index];
    setFlippedCards(updated);
  };

  return (
    <section className="gs-training-section">
      <h2 className="gs-training-section-heading">Waste Segregation Basics</h2>
      
      <div className="gs-training-cards-container">
        {infoCards.map((card, i) => (
          <div
            key={i}
            className={`gs-training-flash-card ${flippedCards[i] ? "gs-training-flash-card--flipped" : ""}`}
            onClick={() => toggleFlip(i)}
          >
            <div className="gs-training-flash-card__front">
              <span className="gs-training-flash-card__title">{card.title}</span>
            </div>
            <div className="gs-training-flash-card__back">
              <span className="gs-training-flash-card__desc">{card.desc}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
