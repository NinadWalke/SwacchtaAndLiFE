import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../components/AuthContext";
import api from "../utils/axiosConfig";

export default function Home() {
  const location = useLocation();
  const [currUser, setCurrUser] = useState(null);
  useEffect(() => {
    async function getUser() {
      const res = await api.get("/auth/check");
      if (res.data.authenticated) setCurrUser(res.data.user);
      else setCurrUser(null);
    }
    getUser();
  }, []);
  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <h2>Empowering Clean Cities</h2>
        <p>
          Swacchta&Life is a smart waste management platform that leverages
          machine learning and citizen participation for sustainable urban
          cleanliness. Join us in building a cleaner, greener future.
        </p>
        {!currUser ? (
          <div
            style={{ display: "flex", justifyContent: "center", gap: "20px" }}
          >
            <Link to="/signup" className="btn">
              Sign Up Free
            </Link>
            <Link
              to="/login"
              className="btn"
              style={{
                background: "#fff",
                color: "#2ecc71",
                border: "2px solid #2ecc71",
              }}
            >
              Login
            </Link>
          </div>
        ) : (
          <div
            style={{ display: "flex", justifyContent: "center", gap: "20px" }}
          >
            <Link
              to="/upload"
              className="btn"
              style={{
                background: "#fff",
                color: "#2ecc71",
                border: "2px solid #2ecc71",
              }}
            >
              Upload
            </Link>
          </div>
        )}
      </section>

      {/* Features Section */}
      <div className="card" style={{ maxWidth: 1200, margin: "40px auto" }}>
        <div
          style={{
            display: "flex",
            gap: "32px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <div
            className="card"
            style={{ flex: "1 1 300px", textAlign: "center" }}
          >
            <div style={{ fontSize: "2.5rem", color: "#388e3c" }}>🌱</div>
            <h3 style={{ fontWeight: 700, marginBottom: 8 }}>
              Eco-Friendly Solutions
            </h3>
            <p>
              Promoting sustainable waste management practices for a healthier
              environment.
            </p>
          </div>
          <div
            className="card"
            style={{ flex: "1 1 300px", textAlign: "center" }}
          >
            <div style={{ fontSize: "2.5rem", color: "#388e3c" }}>🤖</div>
            <h3 style={{ fontWeight: 700, marginBottom: 8 }}>
              AI Powered Insights
            </h3>
            <p>
              Utilize machine learning to optimize waste collection and
              recycling processes.
            </p>
          </div>
          <div
            className="card"
            style={{ flex: "1 1 300px", textAlign: "center" }}
          >
            <div style={{ fontSize: "2.5rem", color: "#388e3c" }}>👥</div>
            <h3 style={{ fontWeight: 700, marginBottom: 8 }}>
              Citizen Engagement
            </h3>
            <p>
              Empower communities to participate and contribute to urban
              cleanliness initiatives.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 Swacchta&Life | Govt. of India</p>
        <div className="mt-2">Made with ❤️ for a cleaner tomorrow</div>
      </footer>
    </div>
  );
}
