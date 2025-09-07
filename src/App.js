import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Otp from "./pages/Otp";
import Profile from "./pages/Profile";
import Upload from "./pages/Upload";
import AdminDashboard from "./pages/AdminDashboard";
import OfficialsDashboard from "./pages/OfficialsDashboard";

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/otp" element={<Otp />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/upload" element={<Upload />} />
	<Route path="/admin" element={<AdminDashboard />} />
        <Route path="/officials" element={<OfficialsDashboard />} />
      </Routes>
    </div>
  );
}

export default App;
