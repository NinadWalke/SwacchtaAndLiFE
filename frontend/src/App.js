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
import OfficialsReportDisplay from './pages/OfficialsReportDisplay.jsx';

// Auth Provider
import { AuthProvider } from "./components/AuthContext";

function App() {
  return (
    <div>
      <AuthProvider>
        <Navbar />
        <Routes>
          {/* -- Admin Routes -- */}
          <Route path="/admin" element={<AdminDashboard />} />
          {/* -- Authentication --*/}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/otp" element={<Otp />} />
          {/* -- User Profile --*/}
          <Route path="/profile" element={<Profile />} />
          {/* -- Core Routes -- */}
          <Route path="/upload" element={<Upload />} />
          {/* -- Officials Routes -- */}
          <Route path="/officials" element={<OfficialsDashboard />} />
          <Route path="/officials/report/:id" element={<OfficialsReportDisplay/>}/>
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
