import React, { useState, useEffect } from "react";
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
  const [stats, setStats] = useState(summaryStats);
  const [reports, setReports] = useState(reportsList);

  // Chart data
  const barData = [
    { name: "Pending", value: stats.pending },
    { name: "Resolved", value: stats.resolved },
  ];

  const pieData = [
    { name: "Pending", value: stats.pending },
    { name: "Resolved", value: stats.resolved },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin Dashboard - City Summary</h2>

      {/* Total Reports */}
      <div style={{ marginBottom: "20px", fontSize: "18px" }}>
        <strong>Total Reports:</strong> {stats.totalReports}
      </div>

      {/* Charts */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "40px",
          marginBottom: "40px",
        }}
      >
        {/* Bar Chart */}
        <div style={{ flex: "1 1 300px", height: "300px" }}>
          <h3>Status Overview (Bar Chart)</h3>
          <ResponsiveContainer width="100%" height="100%">
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
        <div style={{ flex: "1 1 300px", height: "300px" }}>
          <h3>Status Overview (Pie Chart)</h3>
          <ResponsiveContainer width="100%" height="100%">
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
      <h3>All Reports (Read-only)</h3>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          textAlign: "left",
        }}
      >
        <thead>
          <tr style={{ borderBottom: "2px solid #ccc" }}>
            <th>ID</th>
            <th>Location</th>
            <th>Status</th>
            <th>Submitted By</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((r) => (
            <tr key={r.id} style={{ borderBottom: "1px solid #eee" }}>
              <td>{r.id}</td>
              <td>{r.location}</td>
              <td>{r.status}</td>
              <td>{r.submittedBy}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
