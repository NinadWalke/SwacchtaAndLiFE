import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../components/AuthContext";
import services from './components/services';
import api from "../../utils/axiosConfig";
import CarbonFootprintDash from "../cfdash/cfdash";
// Import the new stylesheet
import "./Home.css";

// Public maps
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Custom CSS-based marker icons
const createMarkerIcon = (status) => {
  return L.divIcon({
    className: `marker-pin ${status}`,
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    popupAnchor: [0, -35],
  });
};

export default function Home() {
  const navigate = useNavigate();
  const [allReports, setAllReports] = useState([]);
  const [franchisees, setFranchisees] = useState([]);
  const [events, setEvents] = useState([]);
  const images = [
    '/assets/HeroImg1.jpg',
    '/assets/HeroImg2.jpg',
    '/assets/HeroImg3.jpg'
  ];
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  useEffect(() => {
    const slideshowTimer = setInterval(() => {
      setCurrentImgIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    
    return () => clearInterval(slideshowTimer);
  }, []);

  const inlineHeroStyle = {
    backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${images[currentImgIndex]})`,
    transition: 'background-image 1.5s ease-in-out',
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  };
  
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const { user } = useAuth();

  useEffect(() => {
    const getReports = async () => {
      try {
        const res = await api.get("/reports");
        const sortedReports = res.data.reports.sort(
          (a, b) => new Date(b.time) - new Date(a.time)
        );
        setAllReports(sortedReports);
      } catch (error) {
        console.error("Failed to fetch reports:", error);
        alert("Could not fetch reports.");
      }
    };

    const getEvents = async () => {
      try {
        const res = await api.get("/events");
        const filteredReports = res.data.filter(
          (e) =>
            e?.eventLocationData?.coordinates &&
            Array.isArray(e.eventLocationData.coordinates) &&
            e.eventLocationData.coordinates.length === 2 &&
            typeof e.eventLocationData.coordinates[0] === "number" &&
            typeof e.eventLocationData.coordinates[1] === "number"
        );
        setEvents(filteredReports);
      } catch (error) {
        console.error("Failed to fetch events:", error);
        alert("Could not fetch events.");
      }
    };

    const getUserLocation = async () => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        },
        (err) => {
          console.log("Location permission denied: ", err);
          alert("Location is required to report garbage.");
        },
        { enableHighAccuracy: true }
      );
    };

    const getFranchisees = async () => {
      try {
        const res = await api.get("/recycle/franchisees");
        setFranchisees(res.data.franchisees || []);
      } catch (err) {
        console.error("Failed to fetch franchisees:", err);
      }
    };

    getReports();
    getEvents();
    getUserLocation();
    getFranchisees();
  }, []);

  return (
    <main className="home-page">
      {/* --- HERO SECTION --- */}
      <section className="home__hero" style={inlineHeroStyle}>
        <div className="home__hero-content">
          <h1 className="home__hero-title">Empowering Clean Cities</h1>
          <p className="home__hero-subtitle">
            GreenSathi is a smart waste management platform that leverages
            machine learning and citizen participation for sustainable urban
            cleanliness. Join us in building a cleaner, greener future.
          </p>

          <div className="home__hero-actions">
            {!user ? (
              <>
                <Link to="/signup" className="btn btn--primary">
                  Sign Up Free
                </Link>
                <Link to="/login" className="btn btn--secondary">
                  Login
                </Link>
              </>
            ) : (
              <Link to="/upload" className="btn btn--secondary">
                Upload Garbage Location
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* --- MAP MODULE --- */}
      <section className="dashboard-module">
        <h2 className="module-header">Live Reports Map</h2>
        {location.latitude && location.longitude && (
          <MapContainer
            center={[location.latitude, location.longitude]}
            zoom={14}
            style={{ height: "450px", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            {allReports.map((r) => (
              <Marker
                key={r._id}
                position={[
                  r.location.coordinates[1],
                  r.location.coordinates[0],
                ]}
                icon={createMarkerIcon(r.status)}
              >
                <Popup>
                  <strong>Report ID: {r._id.slice(-6)}</strong>
                  <br />
                  Status:{" "}
                  <span className={`status-badge status--${r.status}`}>
                    {r.status}
                  </span>
                </Popup>
              </Marker>
            ))}
            {events.map((ev) => (
              <Marker
                key={ev._id}
                position={[
                  ev.eventLocationData.coordinates[1],
                  ev.eventLocationData.coordinates[0],
                ]}
                icon={createMarkerIcon("event")}
              >
                <Popup>
                  <div style={{ minWidth: "180px" }}>
                    <strong>{ev.eventName}</strong>
                    <br />
                    <span>
                      <strong>Hosted By:</strong> {ev.eventHostedBy}
                    </span>
                    <br />
                    <span>
                      <strong>Date:</strong>{" "}
                      {new Date(ev.eventDateTime).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <br />
                    <span>
                      <strong>Time:</strong>{" "}
                      {new Date(ev.eventDateTime).toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <br />
                    <span>
                      <strong>Attendees:</strong>{" "}
                      {ev?.registrations?.length || 0}
                    </span>
                    <br />

                    <button
                      className="btn btn--secondary"
                      style={{ marginTop: "10px" }}
                      onClick={() => navigate(`/events/${ev._id}`)}
                    >
                      View Details
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
            {franchisees.map((f) => (
              <Marker
                key={f._id}
                position={[
                  f.location.coordinates[1],
                                    f.location.coordinates[0],
                ]}
                icon={createMarkerIcon("franchisee")}
              >
                <Popup>
                  <div style={{ minWidth: "180px" }}>
                    <strong>{f.centerName}</strong>
                    <br />
                    <span>
                      <strong>Owner:</strong> {f.owner?.fname} {f.owner?.lname}
                    </span>
                    <br />
                    <span>
                      <strong>Phone:</strong> {f.phone}
                    </span>
                    <br />
                    <span>
                      <strong>Pincode:</strong> {f.pincode}
                    </span>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
      </section>

      {/* --- SERVICES SECTION WITH FLIP CARDS --- */}
      <section id="services" className="services-section">
        <div className="section-header">
          <h2>Our Comprehensive Services</h2>
          <p>
            Hover over each card to discover detailed information about how we're 
            revolutionizing waste management through innovation and community engagement.
          </p>
        </div>

        <div className="flip-cards-grid">
          {services.map((service) => (
            <div key={service.id} className="flip-card">
              <div className="flip-card-inner">
                {/* Front Side */}
                <div className="flip-card-front">
                  <div className="card-icon">{service.icon}</div>
                  <h3 className="card-title">{service.title}</h3>
                  <p className="card-description">{service.frontDesc}</p>
                  <span className="flip-hint">Hover to learn more</span>
                </div>

                {/* Back Side */}
                <div className="flip-card-back">
                  <h3 className="card-back-title">{service.backTitle}</h3>
                  <ul className="card-details-list">
                    {service.backDetails.map((detail, index) => (
                      <li key={index}>{detail}</li>
                    ))}
                  </ul>
                  <div className="card-back-icon">{service.icon}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- CARBON FOOTPRINT CALCULATOR --- */}
      <section className="carbon-calculator-section">
        <CarbonFootprintDash />
      </section>
      
      

      {/* --- FOOTER --- */}
      <footer className="home__footer">
        <p>
          &copy; {new Date().getFullYear()} GreenSathi. All Rights Reserved.
        </p>
      </footer>
    </main>
  );
}