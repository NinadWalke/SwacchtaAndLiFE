import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Custom marker icons
const redIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const greenIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function OfficialsDashboard() {
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
      lat: 28.620,
      lng: 77.215,
      status: "Resolved",
    },
    {
      id: 3,
      location: "Sector 30",
      lat: 28.625,
      lng: 77.220,
      status: "Pending",
    },
  ]);

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

  return (
    <div style={{ padding: "20px" }}>
      <h2>Officials Dashboard - City Reports</h2>

      {/* Map */}
      <MapContainer
        center={[28.615, 77.210]}
        zoom={13}
        style={{ height: "400px", width: "100%", marginBottom: "20px" }}
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
              <button onClick={() => toggleStatus(r.id)}>
                Mark {r.status === "Resolved" ? "Pending" : "Resolved"}
              </button>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Table */}
      <h3>Reports List</h3>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid #ccc" }}>
            <th>ID</th>
            <th>Location</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((r) => (
            <tr key={r.id} style={{ borderBottom: "1px solid #eee" }}>
              <td>{r.id}</td>
              <td>{r.location}</td>
              <td>{r.status}</td>
              <td>
                <button onClick={() => toggleStatus(r.id)}>
                  Mark {r.status === "Resolved" ? "Pending" : "Resolved"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
