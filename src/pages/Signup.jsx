import { useState } from "react";
import { Link } from "react-router-dom";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add signup logic here
    alert(`Name: ${name}\nEmail: ${email}\nPassword: ${password}`);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #c8e6c9 0%, #81c784 100%)",
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
        <h2 style={{ textAlign: "center", color: "#388e3c" }}>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={e => setName(e.target.value)}
            style={{ width: "100%", padding: 8, margin: "8px 0", borderRadius: 4, border: "1px solid #ccc" }}
            required
          />
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
              background: "#388e3c",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              marginTop: 12,
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            Sign Up
          </button>
        </form>
        <div style={{ textAlign: "center", marginTop: 18 }}>
          <span style={{ color: "#555" }}>Already have an account? </span>
          <Link to="/login" style={{ color: "#388e3c", fontWeight: "bold", textDecoration: "none" }}>
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}