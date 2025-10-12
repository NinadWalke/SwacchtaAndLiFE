import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import api from "../../utils/axiosConfig";
import "./AdminDashboard.css"; // Import the new stylesheet

// THEME COLORS for charts, matching the CSS variables for consistency
const THEME_COLORS = {
  pending: '#f39c12',
  allotted: '#3498db',
  resolved: '#27ae60',
};

export default function AdminDashboard() {
  const [reports, setReports] = useState([]);
  const [counts, setCounts] = useState({ total: 0, pending: 0, allotted: 0, resolved: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await api.get("/reports");
        const data = res.data.reports || [];
        const sortedReports = data.sort((a, b) => new Date(b.time) - new Date(a.time));
        setReports(sortedReports);

        const pending = data.filter((r) => r.status === "pending").length;
        const allotted = data.filter((r) => r.status === "allotted").length;
        const resolved = data.filter((r) => r.status === "resolved").length;
        setCounts({ total: data.length, pending, allotted, resolved });
      } catch (err) {
        console.error("Failed to fetch reports:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const chartData = [
    { name: "Pending", value: counts.pending, fill: THEME_COLORS.pending },
    { name: "Allotted", value: counts.allotted, fill: THEME_COLORS.allotted },
    { name: "Resolved", value: counts.resolved, fill: THEME_COLORS.resolved },
  ];

  if (loading) {
    return <div className="loading-state">Loading Dashboard Data...</div>;
  }

  return (
    <main className="admin-dashboard-page">
      <header className="dashboard-header">
        <h1 className="dashboard-header__title">Admin Dashboard</h1>
      </header>
      
      {/* --- STATS CARDS --- */}
      <section className="stats-grid">
        <div className="stat-card">
          <h2 className="stat-card__title">Total Reports</h2>
          <p className="stat-card__value">{counts.total}</p>
        </div>
        <div className="stat-card">
          <h2 className="stat-card__title">Pending</h2>
          <p className="stat-card__value" style={{ color: THEME_COLORS.pending }}>{counts.pending}</p>
        </div>
        <div className="stat-card">
          <h2 className="stat-card__title">Allotted</h2>
          <p className="stat-card__value" style={{ color: THEME_COLORS.allotted }}>{counts.allotted}</p>
        </div>
        <div className="stat-card">
          <h2 className="stat-card__title">Resolved</h2>
          <p className="stat-card__value" style={{ color: THEME_COLORS.resolved }}>{counts.resolved}</p>
        </div>
      </section>

      <div className="dashboard-grid">
        {/* --- BAR CHART MODULE --- */}
        <section className="dashboard-module dashboard-module--chart-bar">
          <h2 className="module-header">Reports by Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip cursor={{ fill: 'rgba(219, 226, 233, 0.3)' }} />
              <Legend />
              <Bar dataKey="value">
                {chartData.map((entry) => (
                  <Cell key={`bar-${entry.name}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </section>

        {/* --- PIE CHART MODULE --- */}
        <section className="dashboard-module dashboard-module--chart-pie">
          <h2 className="module-header">Status Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                {chartData.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </section>

        {/* --- TABLE MODULE --- */}
        <section className="dashboard-module dashboard-module--table">
          <h2 className="module-header">Recent Reports</h2>
          <div className="table-container">
            <table className="reports-table">
              <thead>
                <tr>
                  <th>Report ID</th>
                  <th>Date & Time</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Submitted By</th>
                </tr>
              </thead>
              <tbody>
                {reports.slice(0, 10).map((r) => ( // Display top 10 recent reports
                  <tr key={r._id}>
                    <td>{r._id.slice(-8)}...</td>
                    <td>{new Date(r.time).toLocaleString()}</td>
                    <td>{r.location || "N/A"}</td>
                    <td><span className={`status-badge status--${r.status}`}>{r.status}</span></td>
                    <td>{r.reportOwner?.username || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}