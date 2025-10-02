import { Routes, Route } from "react-router-dom";

// Common
import Navbar from "./components/Navbar";
import Footer from './components/Footer.jsx';
// Auth
import Login from "./pages/authentication/Login";
import Signup from "./pages/authentication/Signup";
import Otp from "./pages/authentication/Otp";
// Admin
import AdminDashboard from "./pages/admin/AdminDashboard";
// Home
import Home from "./pages/home/Home";
// Profile
import Profile from "./pages/profile/Profile";
// Services
import Upload from "./pages/services/report/Upload.jsx";
import Committee from "./pages/services/committee/Committee.jsx";
import Event from './pages/services/event/Event.jsx';
import Shop from './pages/services/shop/Shop.jsx';
// Subadmin
import OfficialsDashboard from "./pages/subadmin/OfficialsDashboard";
import OfficialsReportDisplay from './pages/subadmin/OfficialsReportDisplay.jsx';
import EventForm from "./pages/subadmin/event_form/EventForm.jsx";


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
          <Route path="/committee" element={<Committee />} />
          <Route path="/events" element={<Event />} />
          <Route path="/shop" element={<Shop />} />
          {/* -- Officials Routes -- */}
          <Route path="/officials" element={<OfficialsDashboard />} />
          <Route path="/officials/create" element={<EventForm/>}/>
          <Route path="/officials/report/:id" element={<OfficialsReportDisplay/>}/>
        </Routes>
        <Footer/>
      </AuthProvider>
    </div>
  );
}

export default App;
