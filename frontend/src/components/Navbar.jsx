import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
// Import the new stylesheet
import "./Navbar.css";

export default function Navbar() {
  const location = useLocation();
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  // Define navigation links in a structured way
  const navLinks = [
    // Note: It's generally better to have fewer top-level links.
    // Consider a dropdown for user-specific items.
    { to: "/", label: "Home", type: "always" },
    { to: "/login", label: "Login", type: "guest" },
    { to: "/signup", label: "Signup", type: "guest" },
    { to: "/profile", label: "Profile", type: "user" },
    { to: "/upload", label: "Upload", type: "user" },
    { to: "/leaderboard", label: "Leaderboard", type: "user" },
    // Grouping other links for potential future dropdown
    { to: "/events", label: "Events", type: "user" },
    { to: "/training", label: "Training", type: "user" },
    { to: "/committee", label: "Committee", type: "user" },
    { to: "/shop", label: "Shop", type: "user" },
    { to: "/officials", label: "Officials", type: "user" },
    { to: "/admin", label: "Admin", type: "user" }, // Consider role-based access for this
  ];

  const filteredLinks = navLinks.filter(link => {
    if (link.type === "always") return true;
    if (user && link.type === "user") return true;
    if (!user && link.type === "guest") return true;
    return false;
  });

  return (
    <header className="navbar">
      <div className="navbar__container">
        {/* Brand/Logo - links to home */}
        <Link to="/" className="navbar__brand">
          {/* Suggestion: Host your own SVG logo for better performance and quality */}
          <img
            src="Logo.png"
            alt="Swacchta&Life Logo"
            className="brand__logo"
          />
          {/* <h1 className="brand__title">Green Sathi</h1> */}
        </Link>

        {/* Navigation Links */}
        <nav className={`navbar__nav ${menuOpen ? "navbar__nav--open" : ""}`}>
          {filteredLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`nav__link ${location.pathname === link.to ? "active" : ""}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Hamburger Toggle for Mobile */}
        <button
          className={`navbar__toggle ${menuOpen ? "navbar__toggle--open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          <span className="hamburger__line hamburger__line--1"></span>
          <span className="hamburger__line hamburger__line--2"></span>
          <span className="hamburger__line hamburger__line--3"></span>
        </button>
      </div>
    </header>
  );
}