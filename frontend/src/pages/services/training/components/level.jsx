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
      "Hierarchy of waste:",
      " 1️⃣ Reduce → avoid waste before it’s created",
      " 2️⃣ Reuse → find a new use before throwing",
      " 3️⃣ Recycle → process waste only if needed",
      " Best step? Avoid waste first.",
    ],
    tasks: [
      "Use a reusable bottle or bag for 3 days and document it.",
      "Segregate waste at home/hostel for 1 week.",
      "Participate in 1 cleanup / campus activity or society drive.",
    ],
  },
  {
    id: "3",
    name: "Eco Advocate",
    icon: "🌱",
    tag: "Shares and influences others",
    badgeColor: "#16A34A",
    short: "Start influencing friends and family with your actions.",
    tasks: [
      "Host a mini awareness session with at least 3 people.",
      "Create 1 social media story/post about sustainability.",
      "Get 2 people to sign up on Green Sathi / your platform.",
    ],
  },
  {
    id: "4",
    name: "Sustainability Leader",
    icon: "🌳",
    tag: "Leads drives, cleanup, events",
    badgeColor: "#15803D",
    short: "Lead by example through drives and events.",
    tasks: [
      "Lead or help organize 1 cleanup / collection drive.",
      "Coordinate 1 eco-activity in college/society.",
      "Submit a short report with photos of the activity.",
    ],
  },
  {
    id: "5",
    name: "Zero Waste Ambassador",
    icon: "🦋",
    tag: "Fully trained, certified & rewarded",
    badgeColor: "#22C55E",
    short: "Commit to a low/zero waste lifestyle and mentor others.",
    tasks: [
      "Create a 2-week low-waste challenge for yourself.",
      "Mentor at least 2 Seed Learners to reach Green Sathi.",
      "Submit a final reflection + proof (photos, logs, screenshots).",
    ],
  },
];
