import { useState } from "react";
import { Link, useNavigate} from "react-router-dom";
import api from '../utils/axiosConfig';

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    dob: "",
    gender: "",
    address: "",
    phone: "",
    aadhar: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    profileImg: "",
    role: "user",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
  
    try {
      const res = await api.post("/auth/sign-up", {
        fname: formData.fname,
        lname: formData.lname,
        email: formData.email,
        username: formData.username?.trim().toLowerCase(),
        password: formData.password,
        address: formData.address,
        gender: formData.gender,
        dob: formData.dob,
        phone: formData.phone,
        aadhar: formData.aadhar,
      });
  
      alert(res.data.message || "Signup successful!");
      navigate("/login");
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || "Signup failed. Try again!";
      alert(errorMsg);
    }
  };
  

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #c8e6c9 0%, #81c784 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        className="mt-5 mb-5"
        style={{
          maxWidth: 700,
          width: "100%",
          padding: 24,
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
        }}
      >
        <h2 style={{ textAlign: "center", color: "#388e3c" }}>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          {/* First Name */}
          <label htmlFor="fname">First Name</label>
          <input
            id="fname"
            name="fname"
            type="text"
            placeholder="Enter your first name"
            value={formData.fname}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          {/* Last Name */}
          <label htmlFor="lname">Last Name</label>
          <input
            id="lname"
            name="lname"
            type="text"
            placeholder="Enter your last name"
            value={formData.lname}
            onChange={handleChange}
            style={inputStyle}
          />
          {/* Username */}
          <label htmlFor="fname">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="Enter your username"
            value={formData.username}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          {/* Date of Birth */}
          <label htmlFor="dob">Date of Birth</label>
          <input
            id="dob"
            name="dob"
            type="date"
            value={formData.dob}
            onChange={handleChange}
            style={inputStyle}
          />

          {/* Gender */}
          <label htmlFor="gender">Gender</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          {/* Address */}
          <label htmlFor="address">Address</label>
          <input
            id="address"
            name="address"
            type="text"
            placeholder="Enter your address"
            value={formData.address}
            onChange={handleChange}
            style={inputStyle}
          />

          {/* Phone */}
          <label htmlFor="phone">Phone</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="10-digit Indian phone"
            pattern="[6-9]\d{9}"
            value={formData.phone}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          {/* Aadhar */}
          <label htmlFor="aadhar">Aadhar</label>
          <input
            id="aadhar"
            name="aadhar"
            type="text"
            placeholder="12-digit Aadhar"
            minLength={12}
            maxLength={12}
            value={formData.aadhar}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          {/* Email */}
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          {/* Password */}
          <label htmlFor="password">Password</label>
          <div style={{ position: "relative" }}>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{ ...inputStyle, paddingRight: 60 }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              style={toggleButtonStyle}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* Confirm Password */}
          <label htmlFor="confirmPassword">Confirm Password</label>
          <div style={{ position: "relative" }}>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              style={{ ...inputStyle, paddingRight: 60 }}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((prev) => !prev)}
              style={toggleButtonStyle}
            >
              {showConfirm ? "Hide" : "Show"}
            </button>
          </div>

          
          <button type="submit" style={buttonStyle}>
            Sign Up
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: 18 }}>
          <span style={{ color: "#555" }}>Already have an account? </span>
          <Link
            to="/login"
            style={{
              color: "#388e3c",
              fontWeight: "bold",
              textDecoration: "none",
            }}
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: 8,
  margin: "8px 0",
  borderRadius: 4,
  border: "1px solid #ccc",
};

const buttonStyle = {
  width: "100%",
  padding: 10,
  background: "#388e3c",
  color: "#fff",
  border: "none",
  borderRadius: 4,
  marginTop: 12,
  cursor: "pointer",
  fontWeight: "bold",
};

const toggleButtonStyle = {
  position: "absolute",
  right: 10,
  top: "50%",
  transform: "translateY(-50%)",
  background: "transparent",
  border: "none",
  color: "#388e3c",
  cursor: "pointer",
  fontWeight: "bold",
};
