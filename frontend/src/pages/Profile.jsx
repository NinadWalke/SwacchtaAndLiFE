import { useState } from "react";
import Navbar from "../components/Navbar";

export default function Profile() {
  const [edit, setEdit] = useState(false);
  const [name, setName] = useState("Test User");
  const [email, setEmail] = useState("test@example.com");
  const [mobile, setMobile] = useState("9876543210");
  const [password, setPassword] = useState("password123");
  const [aadhar, setAadhar] = useState("1234-5678-9012");
  const [location, setLocation] = useState("Delhi, India");
  const [gender, setGender] = useState("Male");

  const handleSave = (e) => {
    e.preventDefault();
    setEdit(false);
    alert("Profile updated!");
  };

  return (
    <div style={{ background: "#f5fdf7", minHeight: "100vh" }}>
      <Navbar />

      {/* SaaS-style Hero Section */}
      <section
        className="hero"
        style={{
          padding: "60px 0 30px 0",
          background: "linear-gradient(90deg, #2ecc71 0%, #27ae60 100%)",
          color: "white",
          textAlign: "center",
          borderRadius: "0 0 32px 32px",
          boxShadow: "0 4px 24px rgba(44,62,80,0.08)",
        }}
      >
        <h2 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: 8, letterSpacing: 1 }}>
          Account Settings
        </h2>
        <p style={{ fontSize: "1.15rem", maxWidth: 540, margin: "0 auto" }}>
          View and update your personal information for a seamless experience.
        </p>
      </section>

      {/* Profile Card */}
      <div
        className="card"
        style={{
          maxWidth: 900,
          margin: "40px auto",
          background: "#fff",
          borderRadius: 20,
          boxShadow: "0 4px 24px rgba(44,62,80,0.10)",
          padding: "40px",
          display: "flex",
          gap: "40px",
          alignItems: "flex-start",
          flexWrap: "wrap"
        }}
      >
        {/* Avatar and Basic Info */}
        <div style={{ flex: "1 1 220px", textAlign: "center" }}>
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2ecc71&color=fff&size=128`}
            alt="Avatar"
            style={{
              borderRadius: "50%",
              boxShadow: "0 2px 8px rgba(44,62,80,0.10)",
              marginBottom: 16,
              width: 128,
              height: 128,
              objectFit: "cover"
            }}
          />
          <h3 style={{ fontWeight: 700, fontSize: "1.4rem", marginBottom: 4 }}>{name}</h3>
          <div style={{ color: "#27ae60", fontWeight: 500 }}>{location}</div>
          <div style={{ color: "#888", fontSize: "1rem", marginTop: 8 }}>{email}</div>
        </div>

        {/* Details/Form */}
        <div style={{ flex: "2 1 400px" }}>
          {edit ? (
            <form onSubmit={handleSave} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              <div>
                <label>Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)}
                  className="p-2 rounded" style={{ width: "100%", marginTop: 6, border: "1px solid #ccc" }} required />
              </div>
              <div>
                <label>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  className="p-2 rounded" style={{ width: "100%", marginTop: 6, border: "1px solid #ccc" }} required />
              </div>
              <div>
                <label>Mobile</label>
                <input type="tel" value={mobile} onChange={e => setMobile(e.target.value)}
                  className="p-2 rounded" style={{ width: "100%", marginTop: 6, border: "1px solid #ccc" }} required />
              </div>
              <div>
                <label>Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                  className="p-2 rounded" style={{ width: "100%", marginTop: 6, border: "1px solid #ccc" }} required />
              </div>
              <div>
                <label>Aadhaar Card</label>
                <input type="text" value={aadhar} onChange={e => setAadhar(e.target.value)}
                  className="p-2 rounded" style={{ width: "100%", marginTop: 6, border: "1px solid #ccc" }} required maxLength={14} placeholder="XXXX-XXXX-XXXX" />
              </div>
              <div>
                <label>Location</label>
                <input type="text" value={location} onChange={e => setLocation(e.target.value)}
                  className="p-2 rounded" style={{ width: "100%", marginTop: 6, border: "1px solid #ccc" }} required />
              </div>
              <div>
                <label>Gender</label>
                <select value={gender} onChange={e => setGender(e.target.value)}
                  className="p-2 rounded" style={{ width: "100%", marginTop: 6, border: "1px solid #ccc" }} required>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <button type="submit" className="btn" style={{
                  width: "100%",
                  marginTop: 12,
                  background: "#2ecc71",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  padding: "12px 0",
                  borderRadius: 8,
                  border: "none",
                  boxShadow: "0 2px 8px rgba(44,62,80,0.07)",
                  cursor: "pointer"
                }}>
                  Save
                </button>
              </div>
            </form>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              <div>
                <p><strong>Name:</strong> {name}</p>
                <p><strong>Email:</strong> {email}</p>
                <p><strong>Aadhaar Card:</strong> {aadhar}</p>
              </div>
              <div>
                <p><strong>Mobile:</strong> {mobile}</p>
                <p><strong>Location:</strong> {location}</p>
                <p><strong>Gender:</strong> {gender}</p>
                <p><strong>Password:</strong> ******</p>
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <button onClick={() => setEdit(true)} className="btn" style={{
                  width: "100%",
                  marginTop: 12,
                  background: "#2ecc71",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  padding: "12px 0",
                  borderRadius: 8,
                  border: "none",
                  boxShadow: "0 2px 8px rgba(44,62,80,0.07)",
                  cursor: "pointer"
                }}>
                  Edit Profile
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <footer className="footer">
        <p>© 2025 Swacchta&Life | Govt. of India</p>
        <div className="mt-2">Made with ❤️ for a cleaner tomorrow</div>
      </footer>
    </div>
  );
}