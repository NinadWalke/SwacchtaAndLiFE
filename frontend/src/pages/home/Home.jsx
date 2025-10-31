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

      <section id="training" className="training-features-section">
        <div className="training-content-wrapper">
          {/* --- Section Header --- */}
          <header className="training-header">
            <h2 className="training-header-title">Start Your Green Journey</h2>
            <p className="training-header-subtitle">
              Simple changes in your daily routine can make a massive
              difference. Here are some key practices to help our community and
              planet thrive.
            </p>
          </header>

          {/* --- Practices Grid --- */}
          <div className="training-grid">
            {/* Practice Card 1: Reduce */}
            <article className="training-card">
              <div className="training-card-icon">♻️</div>
              <h3 className="training-card-title">1. Reduce & Refuse</h3>
              <p className="training-card-text">
                The best way to manage waste is to not create it. Refuse
                single-use plastics like straws, bags, and cutlery. Opt for
                reusable water bottles, coffee cups, and shopping bags.
              </p>
            </article>

            {/* Practice Card 2: Reuse */}
            <article className="training-card">
              <div className="training-card-icon">🔄</div>
              <h3 className="training-card-title">2. Reuse & Repurpose</h3>
              <p className="training-card-text">
                Before you toss it, think: can this be used again? Glass jars
                make great storage containers. Old clothes can become cleaning
                rags. Get creative and give items a second life.
              </p>
            </article>

            {/* Practice Card 3: Recycle */}
            <article className="training-card">
              <div className="training-card-icon">🚮</div>
              <h3 className="training-card-title">3. Recycle Correctly</h3>
              <p className="training-card-text">
                Recycling is powerful, but only when done right. Learn your
                local rules. Clean your recyclables and avoid
                "wish-cycling"—when in doubt, throw it out in the general waste.
              </p>
            </article>

            {/* Practice Card 4: Report (Ties to app) */}
            <article className="training-card">
              <div className="training-card-icon">📱</div>
              <h3 className="training-card-title">4. Report & Act</h3>
              <p className="training-card-text">
                Be the eyes of your community. When you see illegal dumping,
                overflowing bins, or litter, use this app to report it. Your
                action helps keep our public spaces clean.
              </p>
            </article>
          </div>
        </div>
      </section>
      
      {/* --- FOOTER --- */}
      <footer className="home__footer">
        <p>
          &copy; {new Date().getFullYear()} Swacchta&Life. All Rights Reserved.
        </p>
      </footer>
    </main>
  );
}
