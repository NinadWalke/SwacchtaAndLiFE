import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";

import api from "../../utils/axiosConfig";

// Custom marker icons
const redIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const greenIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function OfficialsDashboard() {
  const navigate = useNavigate();
  const [allReports, setAllReports] = useState([]);
  // Dummy data
  const [reports, setReports] = useState([
    {
      id: 1,
      location: "Sector 10",
      lat: 28.6139,
      lng: 77.209,
      status: "Pending",
    },
    {
      id: 2,
      location: "Sector 20",
      lat: 28.62,
      lng: 77.215,
      status: "Resolved",
    },
    {
      id: 3,
      location: "Sector 30",
      lat: 28.625,
      lng: 77.22,
      status: "Pending",
    },
  ]);

  useEffect(() => {
    const getReports = async () => {
      const res = await api.get("/reports");
      const sortedReports = res.data.reports.sort((a, b) => new Date(b.time) - new Date(a.time));
      setAllReports(sortedReports);
    };
    getReports();
  }, []);
  // Toggle status function
  const toggleStatus = (id) => {
    setReports((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: r.status === "Resolved" ? "Pending" : "Resolved" }
          : r
      )
    );
  };
  const toggleStatusDB = async (reportId) => {
    try {
      const res = await api.post(`/reports/${reportId}`);
      const newStatus = res.data.status;

      // Update front-end state to reflect DB change
      setAllReports((prevReports) =>
        prevReports.map((r) =>
          r._id === reportId ? { ...r, status: newStatus } : r
        )
      );
    } catch (err) {
      console.error("Error toggling status:", err);
      alert("Failed to update report status. Try again.");
    }
  };
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
        padding: "40px 0",
      }}
    >
      <div
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          padding: 32,
          background: "#fff",
          border: "1px solid #ddd",
          borderRadius: 16,
          boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
          display: "flex",
          flexDirection: "column",
          gap: 32,
        }}
      >
        <div className="btn" onClick={() => navigate('/officials/create')}>Create Event</div>
        <h2
          style={{
            color: "#1976d2",
            fontSize: 32,
            fontWeight: 700,
            marginBottom: 8,
          }}
        >
          Officials Dashboard - City Reports 
        </h2>

        {/* Map Card */}
        <div
          style={{
            background: "#e3f2fd",
            borderRadius: 12,
            padding: 24,
            boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
          }}
        >
          <h3 style={{ color: "#1976d2", marginBottom: 16 }}>Reports Map</h3>
          <MapContainer
            center={[28.615, 77.21]}
            zoom={13}
            style={{
              height: "400px",
              width: "100%",
              marginBottom: "20px",
              borderRadius: "8px",
            }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            {reports.map((r) => (
              <Marker
                key={r.id}
                position={[r.lat, r.lng]}
                icon={r.status === "Resolved" ? greenIcon : redIcon}
              >
                <Popup>
                  <strong>{r.location}</strong>
                  <br />
                  Status: {r.status}
                  <br />
                  <button
                    onClick={() => toggleStatus(r.id)}
                    style={{
                      padding: "6px 12px",
                      background:
                        r.status === "Resolved" ? "#fbc02d" : "#388e3c",
                      color: "#fff",
                      border: "none",
                      borderRadius: 4,
                      cursor: "pointer",
                      fontWeight: "bold",
                      marginTop: 8,
                    }}
                  >
                    Mark {r.status === "Resolved" ? "Pending" : "Resolved"}
                  </button>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Table Card */}
        <div
          style={{
            background: "#f5f5f5",
            borderRadius: 12,
            padding: 24,
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          }}
        >
          <h3 style={{ color: "#1976d2", marginBottom: 16 }}>Reports List</h3>
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                textAlign: "left",
                fontSize: 16,
              }}
            >
              <thead>
                <tr style={{ borderBottom: "2px solid #ccc" }}>
                  <th style={{ padding: "8px 12px" }}>ID</th>
                  <th style={{ padding: "8px 12px" }}>Time</th>
                  <th style={{ padding: "8px 12px" }}>Location</th>
                  <th style={{ padding: "8px 12px" }}>Status</th>
                  <th style={{ padding: "8px 12px" }}>Action</th>
                  <th style={{ padding: "8px 12px" }}>Details</th>
                </tr>
              </thead>
              <tbody>
                {allReports.map((r) => (
                  <tr key={r._id} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "8px 12px" }}>{r._id}</td>
                    <td style={{ padding: "8px 12px" }}>{new Date(r.time).toLocaleString()}</td>
                    <td style={{ padding: "8px 12px" }}>{r.location}</td>
                    <td style={{ padding: "8px 12px" }}>{r.status}</td>
                    <td style={{ padding: "8px 12px" }}>
                      <button
                        onClick={() => toggleStatusDB(r._id)}
                        disabled={r.status === "resolved"}
                        style={{
                          padding: "6px 12px",
                          background:
                            r.status === "pending"
                              ? "#fbc02d" // yellow for "mark allotted"
                              : r.status === "allotted"
                              ? "#388e3c" // green for "mark resolved"
                              : "#ccc", // grey when resolved and disabled
                          color: "#fff",
                          border: "none",
                          borderRadius: 4,
                          cursor:
                            r.status === "resolved" ? "not-allowed" : "pointer",
                          fontWeight: "bold",
                        }}
                      >
                        {r.status === "pending"
                          ? "Mark Allotted"
                          : r.status === "allotted"
                          ? "Mark Resolved"
                          : "Resolved"}
                      </button>
                    </td>
                    <td style={{ padding: "8px 12px" }}>
                      <button
                        onClick={() => {
                          navigate(`/officials/report/${r._id}`);
                        }}
                        style={{
                          padding: "6px 12px",
                          background: "blue",
                          color: "#fff",
                          border: "none",
                          borderRadius: 4,
                          cursor: "pointer",
                          fontWeight: "bold",
                        }}
                      >
                        View Report
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}