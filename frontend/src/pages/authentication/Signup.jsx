import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from '../../utils/axiosConfig';
import './Signup.css';

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fname: "", lname: "", dob: "", gender: "", address: "", phone: "",
    aadhar: "", email: "", username: "", password: "", confirmPassword: "",
    role: "user",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: 'error', text: "Passwords do not match!" });
      return;
    }
    
    setIsSubmitting(true);
    try {
      const { fname, lname, email, username, password, address, gender, dob, phone, aadhar } = formData;
      const res = await api.post("/auth/sign-up", {
        fname, lname, email, username: username?.trim().toLowerCase(), password,
        address, gender, dob, phone, aadhar,
      });

      setMessage({ type: 'success', text: res.data.message || "Signup successful! Redirecting to login..." });
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Signup failed. Please try again.";
      setMessage({ type: 'error', text: errorMsg });
      setIsSubmitting(false);
    }
  };
  
  const today = new Date('2025-10-12T23:21:51Z').toISOString().split('T')[0];

  return (
    <main className="auth-page">
      <div className="form-card">
        <header className="form-card__header">
          <h1 className="form-card__title">Create Your Account</h1>
          <p className="form-card__subtitle">Join the movement for a cleaner tomorrow.</p>
        </header>

        <form onSubmit={handleSubmit} className="auth-form--signup">
          <div className="form__group">
            <label className="form__label" htmlFor="fname">First Name</label>
            <input className="form__input" id="fname" name="fname" type="text" placeholder="e.g., Jane" value={formData.fname} onChange={handleChange} required />
          </div>
          <div className="form__group">
            <label className="form__label" htmlFor="lname">Last Name</label>
            <input className="form__input" id="lname" name="lname" type="text" placeholder="e.g., Doe" value={formData.lname} onChange={handleChange} required />
          </div>

          <div className="form__group form__group--full-width">
            <label className="form__label" htmlFor="username">Username</label>
            <input className="form__input" id="username" name="username" type="text" placeholder="Choose a unique username" value={formData.username} onChange={handleChange} required />
          </div>
          
          <div className="form__group">
            <label className="form__label" htmlFor="dob">Date of Birth</label>
            <input className="form__input" id="dob" name="dob" type="date" value={formData.dob} onChange={handleChange} max={today} required />
          </div>
          <div className="form__group">
            <label className="form__label" htmlFor="gender">Gender</label>
            <select className="form__select" id="gender" name="gender" value={formData.gender} onChange={handleChange} required>
              <option value="" disabled>Select gender...</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form__group form__group--full-width">
            <label className="form__label" htmlFor="address">Address</label>
            <input className="form__input" id="address" name="address" type="text" placeholder="e.g., 123 Green Earth Society, Thane" value={formData.address} onChange={handleChange} required />
          </div>

          <div className="form__group">
            <label className="form__label" htmlFor="phone">Phone</label>
            <input className="form__input" id="phone" name="phone" type="tel" placeholder="10-digit mobile number" pattern="[6-9]\d{9}" value={formData.phone} onChange={handleChange} required />
          </div>
          <div className="form__group">
            <label className="form__label" htmlFor="aadhar">Aadhar Number</label>
            <input className="form__input" id="aadhar" name="aadhar" type="text" placeholder="12-digit Aadhar number" minLength={12} maxLength={12} value={formData.aadhar} onChange={handleChange} required />
          </div>
          
          <div className="form__group form__group--full-width">
            <label className="form__label" htmlFor="email">Email</label>
            <input className="form__input" id="email" name="email" type="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="form__group">
            <label className="form__label" htmlFor="password">Password</label>
            <input className="form__input form__input--password" id="password" name="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={formData.password} onChange={handleChange} required />
            <button type="button" className="password-toggle-btn" onClick={() => setShowPassword(p => !p)}>{showPassword ? "Hide" : "Show"}</button>
          </div>
          <div className="form__group">
            <label className="form__label" htmlFor="confirmPassword">Confirm Password</label>
            <input className="form__input form__input--password" id="confirmPassword" name="confirmPassword" type={showConfirm ? "text" : "password"} placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} required />
            <button type="button" className="password-toggle-btn" onClick={() => setShowConfirm(p => !p)}>{showConfirm ? "Hide" : "Show"}</button>
          </div>

          <div className="form__group--full-width">
            <button type="submit" className="btn btn--primary" disabled={isSubmitting}>
              {isSubmitting ? 'Creating Account...' : 'Sign Up'}
            </button>
          </div>
        </form>

        {message && <div className={`form__message form__message--${message.type}`}>{message.text}</div>}

        <footer className="form-card__footer">
          <span>Already have an account? </span>
          <Link to="/login">Login</Link>
        </footer>
      </div>
    </main>
  );
}