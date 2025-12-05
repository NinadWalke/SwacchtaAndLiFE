import React, { useState } from "react";
import "./CommitteeForms.css";
import api from "../../../utils/axiosConfig";
import { Link } from "react-router-dom";
import { useCommitteeAuth } from "../../../components/CommitteeAuthContext";

function CommitteeForms() {
  const { login, committee, isAuthenticated, logout } = useCommitteeAuth();
  const [activeTab, setActiveTab] = useState("register");
  const [statusCheckId, setStatusCheckId] = useState("");
  const [statusResult, setStatusResult] = useState(null);
  const [committeeRegistrationFormData, setCommitteeRegistrationFormData] =
    useState({
      // Committee Info
      committeeName: "",
      description: "",
      localityType: "Society",
      approxHouseholds: "",

      // Leader Info
      leaderName: "",
      leaderEmail: "",
      leaderPhone: "",
      alternatePhone: "",

      // Address
      line1: "",
      line2: "",
      area: "",
      city: "",
      district: "",
      state: "",
      pincode: "",
      landmark: "",

      // Auth
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
      alert(
        "We have recieved your request for registration of your committee! You'll be notified on your email and SMS!"
      );
      window.location.href = "/committee";
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/committees/login", committeeLoginFormData);
      login(res.data.token, res.data.committee);
      alert("Logged in to your committee successfully!");
      window.location.href = "/committee/dashboard";
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.message || "Login failed");
    }
  };

  const handleStatusCheck = async (e) => {
    e.preventDefault();
    const res = await api.get(`/committees/${statusCheckId}/status`);
    setStatusResult(res.data);
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
          <button
            className={`tab-button ${activeTab === "status" ? "active" : ""}`}
            onClick={() => setActiveTab("status")}
          >
            Check Status
          </button>
        </div>

        {activeTab === "register" && (
          <form className="committee-form" onSubmit={handleRegisterSubmit}>
            {/* Committee Name */}
            <div className="form__group">
              <label className="form__label">Committee Name</label>
              <input
                className="form__input"
                name="committeeName"
                type="text"
                placeholder="e.g., Thane Clean-Up Crew"
                onChange={registrationOnChange}
                value={committeeRegistrationFormData.committeeName}
                required
              />
            </div>

            {/* Description */}
            <div className="form__group">
              <label className="form__label">Committee Description</label>
              <textarea
                className="form__input"
                name="description"
                placeholder="Short description of your committee"
                onChange={registrationOnChange}
                value={committeeRegistrationFormData.description}
              />
            </div>

            {/* Locality Type */}
            <div className="form__group">
              <label className="form__label">Locality Type</label>
              <select
                className="form__input"
                name="localityType"
                onChange={registrationOnChange}
                value={committeeRegistrationFormData.localityType}
              >
                <option value="Society">Society</option>
                <option value="Colony">Colony</option>
                <option value="Village">Village</option>
                <option value="Apartment">Apartment</option>
                <option value="Commercial Area">Commercial Area</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Approx Households */}
            <div className="form__group">
              <label className="form__label">Approx Households</label>
              <input
                className="form__input"
                name="approxHouseholds"
                type="number"
                placeholder="e.g., 120"
                onChange={registrationOnChange}
                value={committeeRegistrationFormData.approxHouseholds}
              />
            </div>

            {/* Leader Name */}
            <div className="form__group">
              <label className="form__label">Leader Full Name</label>
              <input
                className="form__input"
                name="leaderName"
                type="text"
                placeholder="e.g., Rohan Patil"
                onChange={registrationOnChange}
                value={committeeRegistrationFormData.leaderName}
                required
              />
            </div>

            {/* Leader Email */}
            <div className="form__group">
              <label className="form__label">Leader Email</label>
              <input
                className="form__input"
                name="leaderEmail"
                type="email"
                placeholder="leader@example.com"
                onChange={registrationOnChange}
                value={committeeRegistrationFormData.leaderEmail}
                required
              />
            </div>

            {/* Leader Phone */}
            <div className="form__group">
              <label className="form__label">Leader Phone Number</label>
              <input
                className="form__input"
                name="leaderPhone"
                type="text"
                placeholder="10-digit mobile number"
                onChange={registrationOnChange}
                value={committeeRegistrationFormData.leaderPhone}
                required
              />
            </div>

            {/* Alternate Phone */}
            <div className="form__group">
              <label className="form__label">Alternate Phone (optional)</label>
              <input
                className="form__input"
                name="alternatePhone"
                type="text"
                placeholder="Optional alternate number"
                onChange={registrationOnChange}
                value={committeeRegistrationFormData.alternatePhone}
              />
            </div>

            {/* Address Section */}
            <h3 className="form__section-title">Committee Address</h3>

            <div className="form__group">
              <label className="form__label">Address Line 1</label>
              <input
                className="form__input"
                name="line1"
                type="text"
                placeholder="Building / Street"
                onChange={registrationOnChange}
                value={committeeRegistrationFormData.line1}
                required
              />
            </div>

            <div className="form__group">
              <label className="form__label">Address Line 2</label>
              <input
                className="form__input"
                name="line2"
                type="text"
                placeholder="Optional"
                onChange={registrationOnChange}
                value={committeeRegistrationFormData.line2}
              />
            </div>

            <div className="form__group">
              <label className="form__label">Area / Locality</label>
              <input
                className="form__input"
                name="area"
                type="text"
                placeholder="e.g., Ghodbunder Road"
                onChange={registrationOnChange}
                value={committeeRegistrationFormData.area}
                required
              />
            </div>

            <div className="form__group">
              <label className="form__label">City</label>
              <input
                className="form__input"
                name="city"
                type="text"
                onChange={registrationOnChange}
                value={committeeRegistrationFormData.city}
                required
              />
            </div>

            <div className="form__group">
              <label className="form__label">District</label>
              <input
                className="form__input"
                name="district"
                type="text"
                onChange={registrationOnChange}
                value={committeeRegistrationFormData.district}
              />
            </div>

            <div className="form__group">
              <label className="form__label">State</label>
              <input
                className="form__input"
                name="state"
                type="text"
                onChange={registrationOnChange}
                value={committeeRegistrationFormData.state}
                required
              />
            </div>

            <div className="form__group">
              <label className="form__label">Pincode</label>
              <input
                className="form__input"
                name="pincode"
                type="text"
                onChange={registrationOnChange}
                value={committeeRegistrationFormData.pincode}
                required
              />
            </div>

            <div className="form__group">
              <label className="form__label">Landmark (Optional)</label>
              <input
                className="form__input"
                name="landmark"
                type="text"
                onChange={registrationOnChange}
                value={committeeRegistrationFormData.landmark}
              />
            </div>

            {/* Password */}
            <div className="form__group">
              <label className="form__label">Password</label>
              <input
                className="form__input"
                name="password"
                type="password"
                placeholder="••••••••"
                onChange={registrationOnChange}
                value={committeeRegistrationFormData.password}
                required
              />
            </div>

            <div className="form__group">
              <label className="form__label">Confirm Password</label>
              <input
                className="form__input"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                onChange={registrationOnChange}
                value={committeeRegistrationFormData.confirmPassword}
                required
              />
            </div>

            <button type="submit" className="btn btn--primary">
              Register Committee
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

        {activeTab === "status" && (
          <form className="committee-form" onSubmit={handleStatusCheck}>
            <div className="form__group">
              <label className="form__label">Enter Committee ID</label>
              <input
                className="form__input"
                type="text"
                placeholder="Enter your Committee ID"
                value={statusCheckId}
                onChange={(e) => setStatusCheckId(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn--primary">
              Check Status
            </button>

            {statusResult && (
              <div
                className="status-card"
                style={{
                  marginTop: "1.5rem",
                  padding: "1.2rem",
                  borderRadius: "8px",
                  backgroundColor: "#f5f7fa",
                  border: "1px solid #dfe3e8",
                  lineHeight: "1.6",
                }}
              >
                <h3 style={{ marginBottom: "0.5rem", color: "#0a6847" }}>
                  Committee Status
                </h3>

                <p>
                  <strong>Committee Name:</strong> {statusResult.committeeName}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    style={{
                      padding: "2px 8px",
                      borderRadius: "4px",
                      color: "white",
                      backgroundColor:
                        statusResult.committeeStatus === "APPROVED"
                          ? "#28a745"
                          : statusResult.committeeStatus === "REJECTED"
                          ? "#dc3545"
                          : statusResult.committeeStatus === "UNDER_PROCESS"
                          ? "#17a2b8"
                          : "#ffc107", // PENDING
                    }}
                  >
                    {statusResult.committeeStatus}
                  </span>
                </p>

                <p>
                  <strong>KYC Verified:</strong>{" "}
                  {statusResult.isKycVerified ? "Yes ✔️" : "No ❌"}
                </p>

                <p>
                  <strong>Committee Verified:</strong>{" "}
                  {statusResult.isCommitteeVerified ? "Yes ✔️" : "No ❌"}
                </p>
              </div>
            )}
          </form>
        )}
      </div>
    </main>
  );
}



export default CommitteeForms;