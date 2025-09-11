import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../utils/axiosConfig";
import { useAuth } from "../components/AuthContext";

export default function Profile() {
  const {logout} = useAuth();
  const [edit, setEdit] = useState(false);
  const [currUser, setCurrUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const res = await api.get("/auth/check");
      setCurrUser(res.data.user);
    };
    getUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrUser({ ...currUser, [name]: value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/profile/${currUser._id}`, currUser);
      setEdit(false);
      alert("Profile updated!");
    } catch (err) {
      console.error(err);
      alert("Error updating profile");
    }
  };
  const handleLogout = async () => {
    try {
      const res = await api.post("/auth/logout");
      if (res.data.successMsg) {
        alert(res.data.successMsg);
        // Optional: clear user from context or redirect to login
        logout();
        window.location.href = "/login"; // redirect to login page
      }
    } catch (err) {
      console.error(err);
      alert("Error logging out. Please try again.");
    }
  };
  

  if (!currUser) return <div>Loading...</div>;

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
        <h2
          style={{
            fontSize: "2.5rem",
            fontWeight: 800,
            marginBottom: 8,
            letterSpacing: 1,
          }}
        >
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
          flexWrap: "wrap",
        }}
      >
        {/* Avatar and Basic Info */}
        <div style={{ flex: "1 1 220px", textAlign: "center" }}>
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
              currUser.fname + " " + currUser.lname
            )}&background=2ecc71&color=fff&size=128`}
            alt="Avatar"
            style={{
              borderRadius: "50%",
              boxShadow: "0 2px 8px rgba(44,62,80,0.10)",
              marginBottom: 16,
              width: 128,
              height: 128,
              objectFit: "cover",
            }}
          />
          <h3
            style={{
              fontWeight: 700,
              fontSize: "1.4rem",
              marginBottom: 4,
            }}
          >
            {currUser.fname} {currUser.lname}
          </h3>
          <div style={{ color: "#27ae60", fontWeight: 500 }}>
            {currUser.address || "Location not set"}
          </div>
          <div style={{ color: "#888", fontSize: "1rem", marginTop: 8 }}>
            {currUser.email}
          </div>
        </div>

        {/* Details/Form */}
        <div style={{ flex: "2 1 400px" }}>
          {edit ? (
            <form
              onSubmit={handleSave}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 24,
              }}
            >
              <div>
                <label>First Name</label>
                <input
                  type="text"
                  name="fname"
                  value={currUser.fname}
                  onChange={handleChange}
                  className="p-2 rounded"
                  style={{
                    width: "100%",
                    marginTop: 6,
                    border: "1px solid #ccc",
                  }}
                  required
                />
              </div>
              <div>
                <label>Last Name</label>
                <input
                  type="text"
                  name="lname"
                  value={currUser.lname}
                  onChange={handleChange}
                  className="p-2 rounded"
                  style={{
                    width: "100%",
                    marginTop: 6,
                    border: "1px solid #ccc",
                  }}
                  required
                />
              </div>
              <div>
                <label>Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={currUser.dob?.split("T")[0] || ""}
                  onChange={handleChange}
                  className="p-2 rounded"
                  style={{
                    width: "100%",
                    marginTop: 6,
                    border: "1px solid #ccc",
                  }}
                />
              </div>
              <div>
                <label>Gender</label>
                <select
                  name="gender"
                  value={currUser.gender}
                  onChange={handleChange}
                  className="p-2 rounded"
                  style={{
                    width: "100%",
                    marginTop: 6,
                    border: "1px solid #ccc",
                  }}
                  required
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={currUser.phone}
                  onChange={handleChange}
                  className="p-2 rounded"
                  style={{
                    width: "100%",
                    marginTop: 6,
                    border: "1px solid #ccc",
                  }}
                />
              </div>
              <div>
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  value={currUser.address || ""}
                  onChange={handleChange}
                  className="p-2 rounded"
                  style={{
                    width: "100%",
                    marginTop: 6,
                    border: "1px solid #ccc",
                  }}
                />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <button
                  type="submit"
                  className="btn"
                  style={{
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
                    cursor: "pointer",
                  }}
                >
                  Save
                </button>
              </div>
            </form>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 24,
              }}
            >
              <div>
                <p>
                  <strong>First Name:</strong> {currUser.fname}
                </p>
                <p>
                  <strong>Last Name:</strong> {currUser.lname}
                </p>
                <p>
                  <strong>Date of Birth:</strong>{" "}
                  {currUser.dob?.split("T")[0]}
                </p>
              </div>
              <div>
                <p>
                  <strong>Gender:</strong> {currUser.gender}
                </p>
                <p>
                  <strong>Phone:</strong> {currUser.phone}
                </p>
                <p>
                  <strong>Address:</strong> {currUser.address || "N/A"}
                </p>
                <p>
                  <strong>Username:</strong> {currUser.username}
                </p>
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <button
                  onClick={() => setEdit(true)}
                  className="btn"
                  style={{
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
                    cursor: "pointer",
                  }}
                >
                  Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="btn"
                  style={{
                    width: "100%",
                    marginTop: 12,
                    background: "red",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    padding: "12px 0",
                    borderRadius: 8,
                    border: "none",
                    boxShadow: "0 2px 8px rgba(44,62,80,0.07)",
                    cursor: "pointer",
                  }}
                >
                  Logout
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