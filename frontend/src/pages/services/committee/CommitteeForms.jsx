import React, { useState } from "react";
import "./CommitteeForms.css";
import api from "../../../utils/axiosConfig";
import {Link} from "react-router-dom"
import { useCommitteeAuth } from "../../../components/CommitteeAuthContext";

// Renamed component function
function CommitteeForms() {
  const { login, committee, isAuthenticated, logout } = useCommitteeAuth();
  const [activeTab, setActiveTab] = useState("register");
  const [committeeRegistrationFormData, setCommitteeRegistrationFormData] =
    useState({
      committeeName: "",
      leaderEmail: "",
      password: "",
      confirmPassword: "",
    });
  const [committeeLoginFormData, setCommitteeLoginFormData] = useState({
    leaderEmail: "",
    password: "",
  });

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(
        "/committees/register",
        committeeRegistrationFormData
      );
      login(res.data.token, res.data.committee);
      alert("Committee Registered successfully!");
      window.location.href = "/committee/dashboard";
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/committees/login", committeeLoginFormData);

      console.log(res);
      login(res.data.token, res.data.committee);
      alert("Logged in to your committee successfully!");
      window.location.href = "/committee/dashboard";
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.message || "Login failed");
    }
  };

  // Helper functions
  const registrationOnChange = (e) => {
    setCommitteeRegistrationFormData({
      ...committeeRegistrationFormData,
      [e.target.name]: e.target.value,
    });
  };
  const loginOnChange = (e) => {
    setCommitteeLoginFormData({
      ...committeeLoginFormData,
      [e.target.name]: e.target.value,
    });
  };
  if (isAuthenticated) {
    // This JSX provides a professional "session active" card
    return (
      <main className="committee-page">
        <div className="form-card committee-logged-in">
          <header className="form-card__header">
            <h1 className="logged-in__title">Session Active</h1>
          </header>

          <p className="logged-in__subtitle">
            You are logged in as <br />
            <strong>{committee.committeeName || committee.email}</strong>
          </p>

          <div className="logged-in__actions">
            {/* New button linking to the dashboard */}
            <Link to="/committee/dashboard" className="btn btn--primary">
              Go to Dashboard
            </Link>

            {/* Restyled Logout button */}
            <button
              onClick={() => logout()}
              className="btn btn--danger-outline"
            >
              Logout
            </button>
          </div>
        </div>
      </main>
    );
  }
  return (
    <main className="committee-page">
      <div className="form-card">
        <div className="form-card__header">
          <h1 className="form-card__title">Committee Portal</h1>
          <p className="form-card__subtitle">
            {activeTab === "register"
              ? "Create a new committee account to get started."
              : "Access your committee dashboard."}
          </p>
        </div>

        <div className="form-card__tabs">
          <button
            className={`tab-button ${activeTab === "register" ? "active" : ""}`}
            onClick={() => setActiveTab("register")}
          >
            Register
          </button>
          <button
            className={`tab-button ${activeTab === "login" ? "active" : ""}`}
            onClick={() => setActiveTab("login")}
          >
            Login
          </button>
        </div>

        {activeTab === "register" && (
          <form className="committee-form" onSubmit={handleRegisterSubmit}>
            <div className="form__group">
              <label className="form__label" htmlFor="register-name">
                Committee Name
              </label>
              <input
                className="form__input"
                id="register-name"
                name="committeeName"
                type="text"
                placeholder="e.g., Thane Clean-Up Crew"
                onChange={registrationOnChange}
                value={committeeRegistrationFormData.value}
                required
              />
            </div>
            <div className="form__group">
              <label className="form__label" htmlFor="register-email">
                Email Address
              </label>
              <input
                className="form__input"
                id="register-email"
                name="leaderEmail"
                type="email"
                placeholder="you@example.com"
                onChange={registrationOnChange}
                value={committeeRegistrationFormData.value}
                required
              />
            </div>
            <div className="form__group">
              <label className="form__label" htmlFor="register-password">
                Password
              </label>
              <input
                className="form__input"
                id="register-password"
                name="password"
                type="password"
                placeholder="••••••••"
                onChange={registrationOnChange}
                value={committeeRegistrationFormData.value}
                required
              />
            </div>
            <div className="form__group">
              <label className="form__label" htmlFor="confirm-password">
                Confirm Password
              </label>
              <input
                className="form__input"
                id="confirm-password"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                onChange={registrationOnChange}
                value={committeeRegistrationFormData.value}
                required
              />
            </div>
            <button type="submit" className="btn btn--primary">
              Register
            </button>
          </form>
        )}

        {activeTab === "login" && (
          <form className="committee-form" onSubmit={handleLoginSubmit}>
            <div className="form__group">
              <label className="form__label" htmlFor="login-email">
                Email Address
              </label>
              <input
                className="form__input"
                id="login-email"
                name="leaderEmail"
                type="email"
                placeholder="you@example.com"
                onChange={loginOnChange}
                value={committeeLoginFormData.value}
                required
              />
            </div>
            <div className="form__group">
              <label className="form__label" htmlFor="login-password">
                Password
              </label>
              <input
                className="form__input"
                id="login-password"
                name="password"
                type="password"
                placeholder="••••••••"
                onChange={loginOnChange}
                value={committeeLoginFormData.value}
                required
              />
            </div>
            <button type="submit" className="btn btn--primary">
              Login
            </button>
          </form>
        )}
      </div>
    </main>
  );
}

export default CommitteeForms;
