import React, { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axiosConfig";
import "./OfficialsDashboard.css"; // Import the new stylesheet

// Custom CSS-based marker icons
const createMarkerIcon = (status) => {
  return L.divIcon({
    className: `marker-pin ${status}`,
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    popupAnchor: [0, -35],
  });
};

export default function OfficialsDashboard() {
  const navigate = useNavigate();
  const [allReports, setAllReports] = useState([]);
  const [events, setEvents] = useState([]);
  const [location, setLocation] = useState({ latitude: null, longitude: null }); // state for user location

  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
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
      } finally {
        setLoading(false);
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
    getReports();
    getEvents();
    getUserLocation();
  }, []);

  const toggleStatusDB = async (reportId) => {
    setLoading(true);
    try {
      const res = await api.post(`/reports/${reportId}`);
      const { status, newReports } = res.data;

      // If backend deleted the report
      if (status === "deleted") {
        setAllReports(newReports); // replace entire list
        return;
      }

      // Otherwise update only that one report's status
      setAllReports((prevReports) =>
        prevReports.map((r) => (r._id === reportId ? { ...r, status } : r))
      );
    } catch (err) {
      console.error("Error toggling status:", err);
      alert("Failed to update report status. Try again.");
    }
    finally {
      setLoading(false);
    }
  };

  // Memoize stats to avoid recalculating on every render
  const stats = useMemo(() => {
    const total = allReports.length;
    const pending = allReports.filter((r) => r.status === "pending").length;
    const resolved = allReports.filter((r) => r.status === "resolved").length;
    return { total, pending, resolved };
  }, [allReports]);

  // Use real data for the map, filtering for valid coordinates
  const mapReports = allReports.filter(
    (r) =>
      r?.location?.coordinates &&
      Array.isArray(r.location.coordinates) &&
      r.location.coordinates.length === 2 &&
      typeof r.location.coordinates[0] === "number" &&
      typeof r.location.coordinates[1] === "number"
  );

  if (loading) return <div className="loading-state">Loading Dashboard...</div>;

  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <h1 className="dashboard-header__title">Officials Dashboard</h1>
        <button
          className="btn btn--primary"
          onClick={() => navigate("/officials/create")}
        >
          Create New Event
        </button>
      </header>

      {/* --- STATS CARDS --- */}
      <section className="stats-grid">
        <div className="stat-card">
          <h2 className="stat-card__title">Total Reports</h2>
          <p className="stat-card__value">{stats.total}</p>
        </div>
        <div className="stat-card">
          <h2 className="stat-card__title">Pending Action</h2>
          <p
            className="stat-card__value"
            style={{ color: "var(--color-pending)" }}
          >
            {stats.pending}
          </p>
        </div>
        <div className="stat-card">
          <h2 className="stat-card__title">Resolved</h2>
          <p
            className="stat-card__value"
            style={{ color: "var(--color-resolved)" }}
          >
            {stats.resolved}
          </p>
        </div>
      </section>

      {/* --- MAP MODULE --- */}
      <section className="dashboard-module">
        <h2 className="module-header">Live Reports Map</h2>
        <MapContainer
          center={[location.latitude, location.longitude]}
          zoom={14}
          style={{ height: "450px", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          {mapReports.map((r) => (
            <Marker
              key={r._id}
              position={[r.location.coordinates[1], r.location.coordinates[0]]}
              icon={createMarkerIcon(r.status)}
            >
              <Popup>
                <strong>Report ID: {r._id.slice(-6)}</strong>
                <br />
                Status:{" "}
                <span className={`status-badge status--${r.status}`}>
                  {r.status}
                </span>
                <br />
                <button
                  className="btn btn--secondary"
                  style={{ marginTop: "10px" }}
                  onClick={() => navigate(`/officials/report/${r._id}`)}
                >
                  View Details
                </button>
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
                    <strong>Attendees:</strong> {ev.registeredUsers.length}
                  </span>
                  <br />

                  <button
                    className="btn btn--secondary"
                    style={{ marginTop: "10px" }}
                    onClick={() => navigate(`/officials/event/${ev._id}`)}
                  >
                    View Details
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </section>

      {/* --- TABLE MODULE --- */}
      <section className="dashboard-module">
        <h2 className="module-header">All Reports</h2>
        <div className="table-container">
          <table className="reports-table">
            <thead>
              <tr>
                <th>Report ID</th>
                <th>Time</th>
                <th>Status</th>
                <th>Action</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {allReports.map((r) => (
                <tr key={r._id}>
                  <td>{r._id.slice(-6)}...</td>
                  <td>{new Date(r.time).toLocaleString()}</td>
                  <td>
                    <span className={`status-badge status--${r.status}`}>
                      {r.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn--secondary"
                      onClick={() => toggleStatusDB(r._id)}
                      disabled={loading}
                    >
                      {loading ? "Processing" 
                        : r.status === "pending"
                        ? "Mark Allotted"
                        : r.status === "allotted"
                        ? "Mark Resolved"
                        : "Close Report"}
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn btn--primary"
                      onClick={() => navigate(`/officials/report/${r._id}`)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
