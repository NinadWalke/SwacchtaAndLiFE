import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import api from "../../utils/axiosConfig";
import "./OspDashboard.css";

const createMarkerIcon = () =>
  L.divIcon({
    className: `marker-pin assigned`,
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    popupAnchor: [0, -35],
  });

export default function OspDashboard() {
  const [assignedReports, setAssignedReports] = useState([]);
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [isOnDuty, setIsOnDuty] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reportsRes = await api.get("/reports/assigned");
        setAssignedReports(reportsRes.data.reports);

        const userRes = await api.get("/auth/check");
        setIsOnDuty(userRes.data.user.isOnDuty);

        navigator.geolocation.getCurrentPosition(
          (pos) =>
            setLocation({
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
            }),
          () => alert("Enable location to view your map"),
          { enableHighAccuracy: true }
        );
      } catch (err) {
        console.error(err);
        alert("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleDuty = async () => {
    try {
      const res = await api.post("/osp/toggle-duty");
      setIsOnDuty(res.data.isOnDuty);
      alert(`Duty status: ${res.data.isOnDuty ? "On Duty" : "Off Duty"}`);
    } catch (err) {
      console.error(err);
      alert("Failed to toggle duty status");
    }
  };

  const markResolved = async (id) => {
    try {
      await api.post(`/reports/${id}/resolve`);
      setAssignedReports((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status: "resolved" } : r))
      );
      alert("Report marked resolved!");
    } catch (err) {
      console.error(err);
      alert("Failed to resolve report");
    }
  };

  const mapReports = assignedReports.filter(
    (r) =>
      r?.location?.coordinates &&
      r.location.coordinates.length === 2 &&
      typeof r.location.coordinates[0] === "number"
  );

  if (loading) return <div className="loading">Loading OSP Dashboard...</div>;

  return (
    <main className="osp-dashboard">
      <header className="osp-header">
        <h1>OSP Dashboard</h1>
        <button className="btn btn--primary" onClick={toggleDuty}>
          {isOnDuty ? "Go Off Duty" : "Go On Duty"}
        </button>
      </header>

      <section className="stats">
        <div className="stat-card">
          <h2>Assigned Reports</h2>
          <p>{assignedReports.length}</p>
        </div>
        <div className="stat-card">
          <h2>Resolved</h2>
          <p>{assignedReports.filter((r) => r.status === "resolved").length}</p>
        </div>
      </section>

      <section className="dashboard-module map-container-wrapper">
        <h2>Your Assigned Reports</h2>

        {location.latitude && location.longitude ? (
          <MapContainer
            center={[location.latitude, location.longitude]}
            zoom={14}
            style={{ height: "400px", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {mapReports.map((r) => (
              <Marker
                key={r._id}
                position={[
                  r.location.coordinates[1],
                  r.location.coordinates[0],
                ]}
                icon={createMarkerIcon()}
              >
                <Popup>
                  <strong>Report #{r._id.slice(-6)}</strong> <br />
                  Status: {r.status}
                  {r.status === "allotted" && (
                    <button
                      className="btn btn--secondary popup-btn"
                      onClick={() => markResolved(r._id)}
                    >
                      Resolve
                    </button>
                  )}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        ) : (
          <div className="location-info">Fetching location...</div>
        )}
      </section>

      <section className="dashboard-module">
        <h2>Assigned Reports List</h2>
        <table className="reports-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Time</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {assignedReports.map((r) => (
              <tr key={r._id}>
                <td>{r._id.slice(-6)}...</td>
                <td>{new Date(r.time).toLocaleString()}</td>
                <td className={`status-tag status-${r.status}`}>
                  {r.status}
                </td>
                <td>
                  {r.status === "allotted" ? (
                    <button
                      className="btn btn--primary"
                      onClick={() => markResolved(r._id)}
                    >
                      Mark Resolved
                    </button>
                  ) : (
                    <span className="resolved-text">Resolved</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}