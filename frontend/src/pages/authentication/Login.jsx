import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from '../../utils/axiosConfig';
import { useAuth } from '../../components/AuthContext';
import './Login.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    try {
      const res = await api.post("/auth/login", { username, password });
      login(res.data.user);
      setMessage({ type: 'success', text: res.data.message || "Login successful! Redirecting..." });
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Login failed. Please check your credentials.";
      setMessage({ type: 'error', text: errorMsg });
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="form-card">
        <header className="form-card__header">
          <h1 className="form-card__title">Welcome Back</h1>
          <p className="form-card__subtitle">Log in to continue to Swacchta&Life.</p>
        </header>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form__group">
            <label className="form__label" htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              className="form__input"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form__group">
            <label className="form__label" htmlFor="password">Password</label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              className="form__input form__input--password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button type="submit" className="btn btn--primary" disabled={isSubmitting}>
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {message && (
          <div className={`form__message form__message--${message.type}`}>
            {message.text}
          </div>
        )}

        <footer className="form-card__footer">
          <span>Don't have an account? </span>
          <Link to="/signup">Sign Up</Link>
        </footer>
      </div>
    </main>
  );
}