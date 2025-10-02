import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from '../../utils/axiosConfig';

import {useAuth} from '../../components/AuthContext';

export default function Login() {
  // Global Context
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { username, password });
      login(res.data.user);
      alert(res.data.message || "Login successful!");
      navigate("/");
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || "Login failed. Try again!";
      alert(errorMsg);
    }
  };
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          maxWidth: 350,
          width: "100%",
          padding: 24,
          background: "#fff",
          border: "1px solid #ddd",
          borderRadius: 12,
          boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
        }}
      >
        <h2 style={{ textAlign: "center", color: "#1976d2" }}>Login</h2>
        <form onSubmit={handleSubmit}>
          {/* Username */}
          <label htmlFor="email">Username</label>
          <input
            id="username"
            type="username"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              width: "100%",
              padding: 8,
              margin: "8px 0",
              borderRadius: 4,
              border: "1px solid #ccc",
            }}
            required
          />

          {/* Password */}
          <label htmlFor="password">Password</label>
          <div style={{ position: "relative" }}>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: 8,
                margin: "8px 0",
                borderRadius: 4,
                border: "1px solid #ccc",
                paddingRight: 60,
              }}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              style={{
                position: "absolute",
                right: 10,
                top: "50%",
                transform: "translateY(-50%)",
                background: "transparent",
                border: "none",
                color: "#1976d2",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>


          <button
            type="submit"
            style={{
              width: "100%",
              padding: 10,
              background: "#1976d2",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              marginTop: 12,
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Login
          </button>
        </form>
        <div style={{ textAlign: "center", marginTop: 18 }}>
          <span style={{ color: "#555" }}>Don't have an account? </span>
          <Link
            to="/signup"
            style={{
              color: "#1976d2",
              fontWeight: "bold",
              textDecoration: "none",
            }}
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
