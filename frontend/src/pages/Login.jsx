import { useState } from "react";
import { Link } from "react-router-dom"; // Add this import

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add login logic here
    alert(`Email: ${email}\nPassword: ${password}`);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <div style={{
        maxWidth: 350,
        width: "100%",
        padding: 24,
        background: "#fff",
        border: "1px solid #ddd",
        borderRadius: 12,
        boxShadow: "0 4px 16px rgba(0,0,0,0.10)"
      }}>
        <h2 style={{ textAlign: "center", color: "#1976d2" }}>Login</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ width: "100%", padding: 8, margin: "8px 0", borderRadius: 4, border: "1px solid #ccc" }}
            required
          />
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ width: "100%", padding: 8, margin: "8px 0", borderRadius: 4, border: "1px solid #ccc" }}
            required
          />
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
              fontWeight: "bold"
            }}
          >
            Login
          </button>
        </form>
        <div style={{ textAlign: "center", marginTop: 18 }}>
          <span style={{ color: "#555" }}>Don't have an account? </span>
          <Link to="/signup" style={{ color: "#1976d2", fontWeight: "bold", textDecoration: "none" }}>
            Sign Up
          </Link>
        </div>
      </div>
    </div> )
}