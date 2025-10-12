import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../components/AuthContext";
// Import the new stylesheet
import "./Home.css";

export default function Home() {
  const { user } = useAuth();

  return (
    // Semantic main tag for the page content
    <main className="home-page">
      {/* --- HERO SECTION --- */}
      <section className="home__hero">
        <div className="home__hero-content">
          {/* SEO Improvement: Using h1 for the primary page title */}
          <h1 className="home__hero-title">Empowering Clean Cities</h1>
          <p className="home__hero-subtitle">
            Swacchta&Life is a smart waste management platform that leverages
            machine learning and citizen participation for sustainable urban
            cleanliness. Join us in building a cleaner, greener future.
          </p>
          
          {/* Cleaned up button container */}
          <div className="home__hero-actions">
            {!user ? (
              <>
                <Link to="/signup" className="btn btn--primary">
                  Sign Up Free
                </Link>
                <Link to="/login" className="btn btn--secondary">
                  Login
                </Link>
              </>
            ) : (
              <Link to="/upload" className="btn btn--secondary">
                Upload Garbage Location
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section id="features" className="home__features">
        {/* Professionalism: A dedicated header for the section provides context. */}
        <div className="section-header">
          <h2>A Modern Approach to Waste Management</h2>
          <p>
            We combine technology and community action to create a powerful,
            transparent, and effective cleanliness solution.
          </p>
        </div>

        {/* Cleaned up grid container */}
        <div className="home__features-grid">
          {/* Card 1 */}
          <div className="feature-card">
            {/* Suggestion: Replace emojis with a consistent SVG icon set for a more professional look */}
            <div className="feature-card__icon">🌱</div>
            <h3 className="feature-card__title">Eco-Friendly Solutions</h3>
            <p className="feature-card__text">
              Promoting sustainable waste management practices for a healthier
              environment.
            </p>
          </div>

          {/* Card 2 */}
          <div className="feature-card">
            <div className="feature-card__icon">🤖</div>
            <h3 className="feature-card__title">AI-Powered Insights</h3>
            <p className="feature-card__text">
              Utilize machine learning to optimize waste collection and
              recycling processes.
            </p>
          </div>

          {/* Card 3 */}
          <div className="feature-card">
            <div className="feature-card__icon">👥</div>
            <h3 className="feature-card__title">Citizen Engagement</h3>
            <p className="feature-card__text">
              Empower communities to participate and contribute to urban
              cleanliness initiatives.
            </p>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="home__footer">
        <p>&copy; {new Date().getFullYear()} Swacchta&Life. All Rights Reserved.</p>
      </footer>
    </main>
  );
}