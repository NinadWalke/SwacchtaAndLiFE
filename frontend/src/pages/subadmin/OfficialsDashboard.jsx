import React, { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axiosConfig";
import "./OfficialsDashboard.css";

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
  const [location, setLocation] = useState({ latitude: null, longitude: null });

  // OSP Selection State
  const [showOspSelection, setShowOspSelection] = useState(false);
  const [activeOsps, setActiveOsps] = useState([]);
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [loadingOsps, setLoadingOsps] = useState(false);

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

      if (status === "deleted") {
        setAllReports(newReports);
        return;
      }

      setAllReports((prevReports) =>
        prevReports.map((r) => (r._id === reportId ? { ...r, status } : r))
      );
    } catch (err) {
      console.error("Error toggling status:", err);
      alert("Failed to update report status. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const openOspSelection = async (reportId) => {
    setLoadingOsps(true);
    setShowOspSelection(true);
    setSelectedReportId(reportId);

    try {
      const res = await api.get("/osp/active");
      setActiveOsps(res.data.osps);
    } catch (err) {
      console.error("Failed to load active OSPs:", err);
      alert("Failed to load available OSPs.");
      setShowOspSelection(false);
    } finally {
      setLoadingOsps(false);
    }
  };

  const assignReportToOsp = async (ospId) => {
    try {
      const res = await api.post(`/reports/${selectedReportId}/assign`, {
        ospId,
      });

      setAllReports((prev) =>
        prev.map((r) =>
          r._id === selectedReportId
            ? { ...r, status: "allotted", assignedTo: ospId }
            : r
        )
      );

      // Close OSP selection and go back to reports view
      setShowOspSelection(false);
      setSelectedReportId(null);
      setActiveOsps([]);

      alert("Report successfully allotted to OSP!");
    } catch (err) {
      console.error("Error assigning report:", err);
      alert("Failed to allot report.");
    }
  };

  const cancelOspSelection = () => {
    setShowOspSelection(false);
    setSelectedReportId(null);
    setActiveOsps([]);
  };

  const stats = useMemo(() => {
    const total = allReports.length;
    const pending = allReports.filter((r) => r.status === "pending").length;
    const resolved = allReports.filter((r) => r.status === "resolved").length;
    return { total, pending, resolved };
  }, [allReports]);

  const mapReports = allReports.filter(
    (r) =>
      r?.location?.coordinates &&
      Array.isArray(r.location.coordinates) &&
      r.location.coordinates.length === 2 &&
      typeof r.location.coordinates[0] === "number" &&
      typeof r.location.coordinates[1] === "number"
  );

  // Get the selected report details
  const selectedReport = allReports.find((r) => r._id === selectedReportId);

  if (loading && allReports.length === 0) {
    return <div className="loading-state">Loading Dashboard...</div>;
  }

  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <h1 className="dashboard-header__title">Officials Dashboard</h1>
        <button
          className="btn btn--primary"
          onClick={() => navigate("/officials/event/create")}
        >
          Create New Event
        </button>
        <button
          className="btn btn--primary"
          onClick={() => navigate("/officials/franchisee/create")}
        >
          Add a franchisee
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
            {mapReports.map((r) => (
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
                      <strong>Attendees:</strong> {ev?.registrations?.length}
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
        )}
      </section>

      {/* --- REPORTS TABLE OR OSP SELECTION --- */}
      <section className="dashboard-module">
        {!showOspSelection ? (
          <>
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
                          onClick={() =>
                            r.status === "pending"
                              ? openOspSelection(r._id)
                              : toggleStatusDB(r._id)
                          }
                          disabled={loading | r.status === "allotted"}
                        >
                          {loading
                            ? "Processing"
                            : r.status === "pending"
                            ? "Allot Report"
                            : r.status === "allotted"
                            ? "Report Allotted"
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
          </>
        ) : (
          <div className="osp-selection-container">
            <div className="osp-selection-header">
              <button className="btn btn--back" onClick={cancelOspSelection}>
                ← Back to Reports
              </button>
              <h2 className="module-header">Assign Report to OSP</h2>
            </div>

            {selectedReport && (
              <div className="selected-report-info">
                <h3>Report Details</h3>
                <p>
                  <strong>Report ID:</strong> {selectedReport._id.slice(-6)}
                </p>
                <p>
                  <strong>Time:</strong>{" "}
                  {new Date(selectedReport.time).toLocaleString()}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={`status-badge status--${selectedReport.status}`}
                  >
                    {selectedReport.status}
                  </span>
                </p>
              </div>
            )}

            <div className="osp-selection-content">
              <h3>Available OSPs</h3>
              {loadingOsps ? (
                <p className="loading-text">Loading OSPs...</p>
              ) : activeOsps.length === 0 ? (
                <p className="no-osps-message">
                  No OSPs are currently on duty.
                </p>
              ) : (
                <div className="osp-grid">
                  {activeOsps.map((osp) => (
                    <div key={osp._id} className="osp-card">
                      <div className="osp-info">
                        <h4 className="osp-name">
                          {osp.fname} {osp.lname}
                        </h4>
                        <p className="osp-phone">{osp.phone}</p>
                      </div>
                      <button
                        className="btn btn--primary"
                        onClick={() => assignReportToOsp(osp._id)}
                      >
                        Assign
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
