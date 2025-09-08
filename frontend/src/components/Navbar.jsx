import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
      <Link to="/" style={{ marginRight: "10px" }}>Home</Link>
      <Link to="/login" style={{ marginRight: "10px" }}>Login</Link>
      <Link to="/signup" style={{ marginRight: "10px" }}>Signup</Link>
      <Link to="/otp" style={{ marginRight: "10px" }}>OTP</Link>
      <Link to="/profile" style={{ marginRight: "10px" }}>Profile</Link>
      <Link to="/upload" style={{ marginRight: "10px" }}>Upload</Link>
      <Link to="/admin" style={{ marginRight: "10px" }}>Admin</Link>
      <Link to="/officials" style={{ marginRight: "10px" }}>Officials</Link>
    </nav>
  );
}
