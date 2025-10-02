import { useState } from "react";

export default function Otp() {
  const [otp, setOtp] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add OTP verification logic here
    alert(`Entered OTP: ${otp}`);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #fffde7 0%, #ffe082 100%)",
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
        <h2 style={{ textAlign: "center", color: "#fbc02d" }}>OTP Verification</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={e => setOtp(e.target.value)}
            style={{ width: "100%", padding: 10, margin: "16px 0", borderRadius: 4, border: "1px solid #ccc", fontSize: 18, letterSpacing: 4, textAlign: "center" }}
            maxLength={6}
            required
          />
          <button
            type="submit"
            style={{
              width: "100%",
              padding: 10,
              background: "#fbc02d",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            Verify
          </button>
        </form>
      </div>
    </div>
  );
}