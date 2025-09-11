import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/login", label: "Login" },
    { to: "/signup", label: "Signup" },
    { to: "/otp", label: "OTP" },
    { to: "/profile", label: "Profile" },
    { to: "/upload", label: "Upload" },
    { to: "/admin", label: "Admin" },
    { to: "/officials", label: "Officials" },
  ];

  return (
    <header className="navbar">
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <img
          src="https://img.icons8.com/color/48/000000/recycle.png"
          alt="Logo"
          style={{ width: 40, height: 40, marginRight: 8 }}
        />
        <h1>Swacchta&Life</h1>
      </div>
      <nav className="nav-links" style={{ display: menuOpen ? "flex" : "", flexDirection: menuOpen ? "column" : "row" }}>
        {navLinks.map(link => (
          <Link
            key={link.to}
            to={link.to}
            className={location.pathname === link.to ? "active" : ""}
            style={{
              fontWeight: location.pathname === link.to ? "bold" : "normal",
              background: location.pathname === link.to ? "#388e3c" : "none",
              color: location.pathname === link.to ? "#ffd600" : "white",
              borderRadius: 6,
              padding: "6px 14px",
              transition: "background 0.3s, color 0.3s"
            }}
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      {/* Hamburger for mobile */}
      <button
        className="navbar-toggle"
        style={{
          background: "none",
          border: "none",
          color: "white",
          fontSize: 28,
          cursor: "pointer",
          display: "none",
          marginLeft: 16
        }}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle navigation"
      >
        ☰
      </button>
      <style>
        {`
          @media (max-width: 700px) {
            .nav-links {
              display: ${menuOpen ? "flex" : "none"};
              flex-direction: column;
              position: absolute;
              top: 60px;
              left: 0;
              width: 100%;
              background: #1b5e20;
              padding: 16px 0;
              z-index: 99;
            }
            .navbar-toggle {
              display: block;
            }
          }
        `}
      </style>
    </header>
  );
}