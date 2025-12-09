import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../components/AuthContext";
import api from "../../utils/axiosConfig";
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

  // Services data for flip cards
  const services = [
    {
      id: 1,
      icon: '📱',
      title: 'Garbage Scanning & Tracking',
      frontDesc: 'Scan waste and track collection in real-time',
      backTitle: 'Smart Scanning',
      backDetails: [
        'Phone-based waste scanner',
        'Identify waste types instantly',
        'Assign collection tasks'
        // 'Track garbage truck journey live'
      ]
    },
    {
      id: 2,
      icon: '🤖',
      title: 'AI Waste Detection',
      frontDesc: 'YOLOv8 model for automatic waste classification',
      backTitle: 'Smart AI Technology',
      backDetails: [
        'Real-time waste classification',
        'Automatic garbage identification',
        'Accurate monitoring system'
        // 'Efficient waste management'
      ]
    },
    {
      id: 3,
      icon: '👥',
      title: 'Community Engagement',
      frontDesc: 'Join local communities for cleanup events',
      backTitle: 'Build Communities',
      backDetails: [
        'Create & join communities',
        'Host cleaning events',
        'Organize training sessions',
        'Compete on leaderboards'
      ]
    },
    {
      id: 4,
      icon: '🎉',
      title: 'Event Hosting & Participation',
      frontDesc: 'Host workshops and earn GreenCoins',
      backTitle: 'Community Events',
      backDetails: [
        'Organize cleanup drives',
        'Host educational workshops',
        'Register participants easily',
        'Earn GreenCoins for activity'
      ]
    },
    {
      id: 5,
      icon: '🛒',
      title: 'E-commerce Platform',
      frontDesc: 'Shop with GreenCoins for eco supplies',
      backTitle: 'Green Shopping',
      backDetails: [
        'Spend GreenCoins to shop',
        'Buy cleaning supplies',
        'Purchase compost bins',
        'Get segregation tools'
      ]
    },
    {
      id: 6,
      icon: '📚',
      title: 'Training & Learning',
      frontDesc: 'Educational videos and chatbot guidance',
      backTitle: 'Learn & Improve',
      backDetails: [
        'Educational video library',
        'Dedicated chatbot support',
        'Hazardous waste handling',
        'Civic segregation habits'
      ]
    },
    {
      id: 7,
      icon: '♻️',
      title: 'Waste Franchise Mediator',
      frontDesc: 'Recycle e-waste and batteries for money',
      backTitle: 'Recycling Hub',
      backDetails: [
        'E-waste collection service',
        'Battery recycling program',
        'Send to recycling companies',
        'Earn money for waste items'
      ]
    },
    {
      id: 8,
      icon: '🪙',
      title: 'GreenCoins Rewards System',
      frontDesc: 'Gamified points for environmental actions',
      backTitle: 'Earn Rewards',
      backDetails: [
        'Report garbage for coins',
        'Earn from attending events',
        'Sell waste for points',
        'Use for shop discounts'
      ]
    },
    {
      id: 9,
      icon: '🏆',
      title: 'Activity Leaderboard',
      frontDesc: 'Compete and rank based on contributions',
      backTitle: 'Competition Board',
      backDetails: [
        'Rank by task frequency',
        'Total GreenCoins tracking',
        'Community member rankings'
        // 'Encourage consistent engagement'
      ]
    },
    {
      id: 10,
      icon: '⚙️',
      title: 'Admin Management',
      frontDesc: 'Central system for task and event management',
      backTitle: 'Control Center',
      backDetails: [
        'Assign garbage truck tasks',
        'Verify new communities',
        'Approve event permissions',
        'Ensure smooth operations'
      ]
    }
  ];

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
            Swacchta&Life is a smart waste management platform that leverages
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

      {/* --- TRAINING SECTION --- */}
      <section id="training" className="training-features-section">
        <div className="training-content-wrapper">
          <header className="training-header">
            <h2 className="training-header-title">Start Your Green Journey</h2>
            <p className="training-header-subtitle">
              Simple changes in your daily routine can make a massive
              difference. Here are some key practices to help our community and
              planet thrive.
            </p>
          </header>

          <div className="training-grid">
            <article className="training-card">
              <div className="training-card-icon">♻️</div>
              <h3 className="training-card-title">1. Reduce & Refuse</h3>
              <p className="training-card-text">
                The best way to manage waste is to not create it. Refuse
                single-use plastics like straws, bags, and cutlery. Opt for
                reusable water bottles, coffee cups, and shopping bags.
              </p>
            </article>

            <article className="training-card">
              <div className="training-card-icon">🔄</div>
              <h3 className="training-card-title">2. Reuse & Repurpose</h3>
              <p className="training-card-text">
                Before you toss it, think: can this be used again? Glass jars
                make great storage containers. Old clothes can become cleaning
                rags. Get creative and give items a second life.
              </p>
            </article>

            <article className="training-card">
              <div className="training-card-icon">🚮</div>
              <h3 className="training-card-title">3. Recycle Correctly</h3>
              <p className="training-card-text">
                Recycling is powerful, but only when done right. Learn your
                local rules. Clean your recyclables and avoid
                "wish-cycling"—when in doubt, throw it out in the general waste.
              </p>
            </article>

            <article className="training-card">
              <div className="training-card-icon">📱</div>
              <h3 className="training-card-title">4. Report & Act</h3>
              <p className="training-card-text">
                Be the eyes of your community. When you see illegal dumping,
                overflowing bins, or litter, use this app to report it. Your
                action helps keep our public spaces clean.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="home__footer">
        <p>
          &copy; {new Date().getFullYear()} Swacchta&Life. All Rights Reserved.
        </p>
      </footer>
    </main>
  );
}