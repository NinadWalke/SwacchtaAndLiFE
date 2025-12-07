import React, { useState } from "react";
import "../training.css"; // uses same CSS

export default function Flashcards() {
  const infoCards = [
    { title: "Wet Waste", desc: "Organic waste like food scraps, vegetable peels, leftovers, and similar biodegradable items." },
    { title: "Dry Waste", desc: "Paper, plastic, metal, cardboard, packaging items — all non-biodegradable waste." },
    { title: "Hazardous Waste", desc: "Batteries, electronic waste, paint cans, chemicals, medical waste and flammable items." },
    { title: "E-Waste", desc: "Mobile phones, chargers, wires, computer parts, old electronics — dispose separately." },
    { title: "Civic Sense", desc: "Basic cleanliness, using dustbins, avoiding littering and respecting shared spaces." },
    { title: "Recyclables", desc: "Plastic bottles, glass jars, metal cans — clean and dry before sending for recycling." }
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
    <div>
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
    </div>
  );
}
