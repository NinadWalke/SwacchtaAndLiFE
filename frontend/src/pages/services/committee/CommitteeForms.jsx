import React, { useState } from "react";
import "./CommitteeForms.css";
import api from "../../../utils/axiosConfig";
import {Link} from "react-router-dom"
import { useCommitteeAuth } from "../../../components/CommitteeAuthContext";

function CommitteeForms() {
  const { login, committee, isAuthenticated, logout } = useCommitteeAuth();
  const [activeTab, setActiveTab] = useState("register");
  const [committeeRegistrationFormData, setCommitteeRegistrationFormData] =
    useState({
      committeeName: "",
      leaderEmail: "",
      fullname: "",
      contact: "",
      members: "",
      responsibilities: "",
      actions: "",
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
            <Link to="/committee/dashboard" className="btn btn--primary">
              Go to Dashboard
            </Link>

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
                value={committeeRegistrationFormData.committeeName}
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
                value={committeeRegistrationFormData.leaderEmail}
                required
              />
            </div>

            <div className="form__group">
              <label className="form__label" htmlFor="register-fullname">
                Full Name
              </label>
              <input
                className="form__input"
                id="register-fullname"
                name="fullname"
                type="text"
                placeholder="Your First and Last Name"
                onChange={registrationOnChange}
                value={committeeRegistrationFormData.fullname}
                required
              />
            </div>

            <div className="form__group">
              <label className="form__label" htmlFor="register-contact">
                Contact Number
              </label>
              <input
                className="form__input"
                id="register-contact"
                name="contact"
                type="tel"
                placeholder="10-digit Phone Number"
                onChange={registrationOnChange}
                value={committeeRegistrationFormData.contact}
                required
              />
            </div>

            <div className="form__group">
              <label className="form__label" htmlFor="register-members">
                No. of Members
              </label>
              <input
                className="form__input"
                id="register-members"
                name="members"
                type="number"
                placeholder="Number of Members"
                onChange={registrationOnChange}
                value={committeeRegistrationFormData.members}
                required
              />
            </div>

            <div className="form__group">
              <label className="form__label" htmlFor="register-responsibilities">
                Are you aware of your committee responsibilities?
              </label>
              <input
                className="form__input"
                id="register-responsibilities"
                name="responsibilities"
                type="text"
                placeholder="YES / NO"
                onChange={registrationOnChange}
                value={committeeRegistrationFormData.responsibilities}
                required
              />
            </div>

            <div className="form__group">
              <label className="form__label" htmlFor="register-actions">
                What actions will your committee take after formation?
              </label>
              <input
                className="form__input"
                id="register-actions"
                name="actions"
                type="text"
                placeholder="Eg: Clean-up drives, awareness sessions, reporting issues"
                onChange={registrationOnChange}
                value={committeeRegistrationFormData.actions}
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
                value={committeeRegistrationFormData.password}
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
                value={committeeRegistrationFormData.confirmPassword}
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
                value={committeeLoginFormData.leaderEmail}
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
                value={committeeLoginFormData.password}
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