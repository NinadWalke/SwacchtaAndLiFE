import { Routes, Route } from "react-router-dom";

// Common
import Navbar from "./components/Navbar";
import Footer from "./components/Footer.jsx";
import NotFound from './components/NotFound.jsx';
import { CommitteeAuthProvider } from "./components/CommitteeAuthContext.jsx";

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
import MyReports from "./pages/profile/MyReports.jsx";

// Services
import Upload from "./pages/services/report/Upload.jsx";
// Leaderboard
import Leaderboard from "./pages/leaderboard/Leaderboard.jsx";

// Committee Section
import CommitteeForms from "./pages/services/committee/CommitteeForms.jsx";
import CommitteeDashboard from "./pages/services/committee/CommitteeDashboard.jsx";

// Event section
import Event from "./pages/services/event/Event.jsx";
import EventDetail from './pages/services/event/EventDetail.jsx';
import EventSignUpForm from "./pages/services/event/EventSignUpForm.jsx";

// Ecommerce
import Shop from "./pages/services/shop/Shop.jsx";
// Subadmin
import OfficialsDashboard from "./pages/subadmin/OfficialsDashboard";
import OfficialsReportDisplay from "./pages/subadmin/OfficialsReportDisplay.jsx";
import EventForm from "./pages/subadmin/event_form/EventForm.jsx";

// Auth Provider
import { AuthProvider } from "./components/AuthContext";

function App() {
  return (
    <div>
      <AuthProvider>
        <CommitteeAuthProvider>
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
            <Route path="/profile/reports" element={<MyReports />} />
            {/* -- Core Routes -- */}
            <Route path="/upload" element={<Upload />} />
            {/* -- Leaderboard Routes -- */}
            <Route path="/leaderboard" element={<Leaderboard />} />
            {/* - Committee Routes - */}
            <Route path="/committee" element={<CommitteeForms />} />
            <Route
              path="/committee/dashboard"
              element={<CommitteeDashboard />}
            />
            <Route path="/events" element={<Event />} />
            <Route path="/events/:id" element={<EventDetail />} />
            <Route path="/events/:id/signup" element={<EventSignUpForm />} />
            <Route path="/shop" element={<Shop />} />
            {/* -- Officials Routes -- */}
            <Route path="/officials" element={<OfficialsDashboard />} />
            <Route path="/officials/create" element={<EventForm />} />
            <Route
              path="/officials/report/:id"
              element={<OfficialsReportDisplay />}
            />
            <Route path="*" element={<NotFound/>}/>
          </Routes>
          <Footer />
        </CommitteeAuthProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
