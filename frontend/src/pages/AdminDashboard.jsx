import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Dummy data for summary stats
const summaryStats = {
  totalReports: 50,
  pending: 20,
  resolved: 30,
};

// Dummy reports list
const reportsList = [
  { id: 1, location: "Sector 10", status: "Pending", submittedBy: "User A" },
  { id: 2, location: "Sector 20", status: "Resolved", submittedBy: "User B" },
  { id: 3, location: "Sector 30", status: "Pending", submittedBy: "User C" },
  { id: 4, location: "Sector 40", status: "Resolved", submittedBy: "User D" },
  { id: 5, location: "Sector 50", status: "Pending", submittedBy: "User E" },
];

// Colors for Pie chart
const COLORS = ["#FF8042", "#0088FE"];

export default function AdminDashboard() {
  const [stats] = useState(summaryStats);
  const [reports] = useState(reportsList);

  const barData = [
    { name: "Pending", value: stats.pending },
    { name: "Resolved", value: stats.resolved },
  ];

  const pieData = [
    { name: "Pending", value: stats.pending },
    { name: "Resolved", value: stats.resolved },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
      padding: "40px 0"
    }}>
      <div style={{
        maxWidth: 1100,
        margin: "0 auto",
        padding: 32,
        background: "#fff",
        border: "1px solid #ddd",
        borderRadius: 16,
        boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
        display: "flex",
        flexDirection: "column",
        gap: 32
      }}>
        <h2 style={{ color: "#1976d2", fontSize: 32, fontWeight: 700, marginBottom: 8 }}>
          Admin Dashboard
        </h2>
        {/* Summary Cards */}
        <div style={{
          display: "flex",
          gap: 24,
          marginBottom: 24,
          flexWrap: "wrap"
        }}>
          <div style={{
            flex: "1 1 200px",
            background: "#e3f2fd",
            borderRadius: 12,
            padding: 24,
            textAlign: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.07)"
          }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#1976d2" }}>Total Reports</div>
            <div style={{ fontSize: 32, fontWeight: 800 }}>{stats.totalReports}</div>
          </div>
          <div style={{
            flex: "1 1 200px",
            background: "#fffde7",
            borderRadius: 12,
            padding: 24,
            textAlign: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.07)"
          }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#fbc02d" }}>Pending</div>
            <div style={{ fontSize: 32, fontWeight: 800 }}>{stats.pending}</div>
          </div>
          <div style={{
            flex: "1 1 200px",
            background: "#e8f5e9",
            borderRadius: 12,
            padding: 24,
            textAlign: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.07)"
          }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#388e3c" }}>Resolved</div>
            <div style={{ fontSize: 32, fontWeight: 800 }}>{stats.resolved}</div>
          </div>
        </div>

        {/* Charts */}
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "40px",
          marginBottom: "40px",
          justifyContent: "space-between"
        }}>
          {/* Bar Chart */}
          <div style={{ flex: "1 1 400px", height: "300px", background: "#f5f5f5", borderRadius: 12, padding: 24 }}>
            <h3 style={{ color: "#1976d2", marginBottom: 12 }}>Status Overview (Bar Chart)</h3>
            <ResponsiveContainer width="100%" height="80%">
              <BarChart data={barData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div style={{ flex: "1 1 400px", height: "300px", background: "#f5f5f5", borderRadius: 12, padding: 24 }}>
            <h3 style={{ color: "#1976d2", marginBottom: 12 }}>Status Overview (Pie Chart)</h3>
            <ResponsiveContainer width="100%" height="80%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Reports Table */}
        <div>
          <h3 style={{ color: "#1976d2", marginBottom: 16 }}>All Reports</h3>
          <div style={{
            overflowX: "auto",
            background: "#f5f5f5",
            borderRadius: 12,
            padding: 16,
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
          }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                textAlign: "left",
                fontSize: 16
              }}
            >
              <thead>
                <tr style={{ borderBottom: "2px solid #ccc" }}>
                  <th style={{ padding: "8px 12px" }}>ID</th>
                  <th style={{ padding: "8px 12px" }}>Location</th>
                  <th style={{ padding: "8px 12px" }}>Status</th>
                  <th style={{ padding: "8px 12px" }}>Submitted By</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => (
                  <tr key={r.id} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "8px 12px" }}>{r.id}</td>
                    <td style={{ padding: "8px 12px" }}>{r.location}</td>
                    <td style={{ padding: "8px 12px" }}>{r.status}</td>
                    <td style={{ padding: "8px 12px" }}>{r.submittedBy}</td>
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