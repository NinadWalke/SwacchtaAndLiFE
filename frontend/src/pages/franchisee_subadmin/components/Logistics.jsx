import React, { useEffect, useState } from "react";
import "./Logistics.css";
import api from "../../../utils/axiosConfig";

function Logistics() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/recycle/franchisee/requests");
        const requests = res.data.requests || [];

        const total = requests.length;
        const approved = requests.filter((r) => r.status === "APPROVED").length;
        const rejected = requests.filter((r) => r.status === "REJECTED").length;
        const pending = requests.filter((r) => r.status === "PENDING").length;

        const totalKg = requests
          .filter((r) => r.status === "APPROVED")
          .reduce((sum, r) => sum + (r.weightKg || 0), 0);

        setStats({ total, approved, rejected, pending, totalKg });

        // Sort latest 5
        setRecent(requests.slice(0, 5));
      } catch (err) {
        console.error("Failed to fetch logistics data", err);
      }
    };

    fetchStats();
  }, []);

  if (!stats) return <p>Loading logistics...</p>;

  return (
    <div className="logistics-section">
      <h2 className="section-title">Logistics Overview</h2>
      <p className="section-subtitle">Monitor requests and collection metrics.</p>

      {/* --- Stat Cards --- */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>{stats.total}</h3>
          <p>Total Requests</p>
        </div>

        <div className="stat-card stat-approved">
          <h3>{stats.approved}</h3>
          <p>Approved</p>
        </div>

        <div className="stat-card stat-pending">
          <h3>{stats.pending}</h3>
          <p>Pending</p>
        </div>

        <div className="stat-card stat-rejected">
          <h3>{stats.rejected}</h3>
          <p>Rejected</p>
        </div>

        <div className="stat-card stat-weight">
          <h3>{stats.totalKg.toFixed(1)} kg</h3>
          <p>Total Waste Collected</p>
        </div>
      </div>

      {/* --- Recent Activity Table --- */}
      <h3 className="recent-title">Recent Requests</h3>

      <table className="logistics-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Waste Type</th>
            <th>Weight</th>
            <th>Status</th>
            <th>Submitted</th>
          </tr>
        </thead>
        <tbody>
          {recent.map((req) => (
            <tr key={req._id}>
              <td>{req.user?.fname || "N/A"}</td>
              <td>{req.wasteType?.name}</td>
              <td>{req.weightKg || 0} kg</td>
              <td>
                <span className={`status-tag status-${req.status.toLowerCase()}`}>
                  {req.status}
                </span>
              </td>
              <td>{new Date(req.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Logistics;
