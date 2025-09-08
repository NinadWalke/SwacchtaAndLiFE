import { useState } from "react";

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
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
      padding: "40px 0"
    }}>
      <div style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: 32,
        background: "#fff",
        border: "1px solid #ddd",
        borderRadius: 16,
        boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
        display: "flex",
        flexDirection: "column",
        gap: 24
      }}>
        <h2 style={{ textAlign: "left", color: "#1976d2", fontSize: 32, fontWeight: 700 }}>User Profile</h2>
        {edit ? (
          <form onSubmit={handleSave} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div>
              <label>Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                style={{ width: "100%", padding: 8, margin: "8px 0", borderRadius: 4, border: "1px solid #ccc" }}
                required
              />
            </div>
            <div>
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{ width: "100%", padding: 8, margin: "8px 0", borderRadius: 4, border: "1px solid #ccc" }}
                required
              />
            </div>
            <div>
              <label>Mobile</label>
              <input
                type="tel"
                value={mobile}
                onChange={e => setMobile(e.target.value)}
                style={{ width: "100%", padding: 8, margin: "8px 0", borderRadius: 4, border: "1px solid #ccc" }}
                required
              />
            </div>
            <div>
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ width: "100%", padding: 8, margin: "8px 0", borderRadius: 4, border: "1px solid #ccc" }}
                required
              />
            </div>
            <div>
              <label>Aadhaar Card</label>
              <input
                type="text"
                value={aadhar}
                onChange={e => setAadhar(e.target.value)}
                style={{ width: "100%", padding: 8, margin: "8px 0", borderRadius: 4, border: "1px solid #ccc" }}
                required
                maxLength={14}
                placeholder="XXXX-XXXX-XXXX"
              />
            </div>
            <div>
              <label>Location</label>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                style={{ width: "100%", padding: 8, margin: "8px 0", borderRadius: 4, border: "1px solid #ccc" }}
                required
              />
            </div>
            <div>
              <label>Gender</label>
              <select
                value={gender}
                onChange={e => setGender(e.target.value)}
                style={{ width: "100%", padding: 8, margin: "8px 0", borderRadius: 4, border: "1px solid #ccc" }}
                required
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
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
              <button
                onClick={() => setEdit(true)}
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
                Edit Profile
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}