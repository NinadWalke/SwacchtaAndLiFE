// src/data/levels.js
import React from "react";
import "./level.css";

export const LEVELS = [
  {
    id: "1",
    name: "Seed Learner",
    icon: "🌿",
    tag: "Just beginning awareness",
    badgeColor: "#A3E635",
    short: "Start your sustainability journey with simple awareness tasks.",
    description: [
      "🟢 Wet Waste — food scraps, vegetable peels, tea leaves",
      "🔵 Dry Waste — plastic, paper, wrappers, cardboard",
      "⚫ Hazardous Waste — batteries, sanitary waste, chemicals",
      "🟣 E-Waste — chargers, wires, broken electronics",
    ],
    tasks: [
      "Sort ten random waste items from your home/hostel into four categories.",
    ],
  },
  {
    id: "2",
    name: "Reduce vs Reuse vs Recycle",
    icon: "🍃",
    tag: "Active participant",
    badgeColor: "#22C55E",
    short: "Do small actions daily that build eco-habits.",
    description: [
      "1. Reduce → avoid waste before it's created",
      "2. Reuse → find a new use before throwing",
      "3. Recycle → process waste only if needed",
      "Best step? Avoid waste first.",
    ],
    tasks: [
      "Choose any one item (like plastic bottle, shopping bag, container) and reuse it creatively instead of throwing.",
    ],
  },
  {
    id: "3",
    name: "Identifying Recyclable Plastics",
    icon: "🌱",
    tag: "Shares and influences others",
    badgeColor: "#16A34A",
    short: "Some plastics are recyclable while some are not.",
    description: [
      "Look for ♻️ recycling numbers:",
      "Number 1, 2, 5 - Recyclable (Bottles, milk covers, food containers)",
      "Number 3, 4, 6, 7 - Not recyclable (Plastic bags, Styrofoam, certain containers)",
    ],
    tasks: [
      "Check 5 plastic items around you and note whether they are recyclable or not.",
    ],
  },
  {
    id: "4",
    name: "Wet Waste & Compost Basics",
    icon: "🌳",
    tag: "Organic waste management",
    badgeColor: "#15803D",
    short: "Wet waste can be turned into compost instead of becoming landfill.",
    description: [
      "Good compost material:",
      "✔ Vegetable peels",
      "✔ Fruit waste",
      "✔ Tea/coffee grounds",
      "✔ Leftover food (non-oily preferred)",
    ],
    tasks: [
      "Start composting wet waste from your home/hostel for one week.",
    ],
  },
  {
    id: "5",
    name: "E-Waste Responsibility",
    icon: "🦋",
    tag: "Fully trained, certified & rewarded",
    badgeColor: "#22C55E",
    short: "Electronics contain harmful chemicals and must NEVER go in normal bins.",
    description: [
      "Examples of E-waste:",
      "📱 Phones",
      "🔌 Chargers",
      "🪫 Batteries",
      "⌚ Watches",
      "🖱 Computer accessories",
      "They must go to certified e-waste collection centers.",
    ],
    tasks: [
      "Collect 3–5 e-waste items from home/hostel and store them in a labeled container.",
    ],
  },
];
