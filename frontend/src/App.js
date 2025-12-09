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
// Vendor
import Vendor from "./pages/vendor/Vendor.jsx";
// Franchisee Dashboard
import FranchiseeDashboard from "./pages/franchisee_subadmin/FranchiseeDashboard.jsx";

// Home
import Home from "./pages/home/Home";
// Profile
import Profile from "./pages/profile/Profile";
import MyReports from "./pages/profile/MyReports.jsx";
import MyRecycleRequests from "./pages/profile/MyRecycleRequests.jsx";

// Services
import Upload from "./pages/services/report/Upload.jsx";
import OspDashboard from "./pages/osp/OspDashboard.jsx";
import Recycle from "./pages/services/recycle/Recycle.jsx";

// Committee Section
import CommitteeForms from "./pages/services/committee/CommitteeForms.jsx";
import CommitteeDashboard from "./pages/services/committee/CommitteeDashboard.jsx";

// Event section
import Event from "./pages/services/event/Event.jsx";
import EventDetail from './pages/services/event/EventDetail.jsx';
import EventSignUpForm from "./pages/services/event/EventSignUpForm.jsx";

// Franchisee Section
import FranchiseeForm from "./pages/subadmin/franchisee_form/FranchiseeForm.jsx";

//Training
import Training from "./pages/services/training/training.jsx";
import LevelDetail from "./pages/services/training/components/levelhub.jsx";
import RecyclingGame from './pages/games/RecyclingGame';

// Carbon Footprint
import CarbonFootprintDash from "./pages/cfdash/cfdash.jsx";

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
            {/* -- Vendor Routes -- */}
            <Route path="/Vendor" element={<Vendor />} />
            {/* -- Authentication --*/}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/otp" element={<Otp />} />
            {/* -- User Profile --*/}
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/reports" element={<MyReports />} />
            <Route path="/profile/recycle-requests" element={<MyRecycleRequests />} />
            {/* -- Core Routes -- */}
            <Route path="/upload" element={<Upload />} />
            <Route path="/osp" element={<OspDashboard />} />
            {/* - Committee Routes - */}
            <Route path="/committee" element={<CommitteeForms />} />
            <Route
              path="/committee/dashboard"
              element={<CommitteeDashboard />}
            />
            <Route path="/events" element={<Event />} />
            <Route path="/events/:id" element={<EventDetail />} />
            <Route path="/events/:id/signup" element={<EventSignUpForm />} />
            <Route path="/recycle" element={<Recycle />} />
            <Route path="/franchisee-dashboard" element={<FranchiseeDashboard />} />
            <Route path="/shop" element={<Shop />} />
            {/* -- Officials Routes -- */}
            <Route path="/officials" element={<OfficialsDashboard />} />
            <Route path="/officials/event/create" element={<EventForm />} />
            <Route path="/officials/franchisee/create" element={<FranchiseeForm />} />
            <Route
              path="/officials/report/:id"
              element={<OfficialsReportDisplay />}
            />
            <Route path="/training" element={<Training />} />
            <Route path="/training/levels/:id" element={<LevelDetail />} />
            <Route path="/training/game" element={<RecyclingGame />} />
            <Route path="/cfdash" element={<CarbonFootprintDash />} />
            <Route path="*" element={<NotFound/>}/>
          </Routes>
          <Footer />
        </CommitteeAuthProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
