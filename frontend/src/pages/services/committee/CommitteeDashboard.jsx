import React, { useEffect, useState } from "react";
import api from "../../../utils/axiosConfig";
import "./CommitteeDashboard.css"; // Import the new stylesheet
import "./Leaderboard.css";

// MAP IMPORTS
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const createMarkerIcon = (status) => {
  return L.divIcon({
    className: `marker-pin ${status}`,
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    popupAnchor: [0, -35],
  });
};

export default function CommitteeDashboard() {
  const [currCommittee, setCurrCommittee] = useState(null);
  const [committeeReports, setCommitteeReports] = useState([]);
  const [committeeEvents, setCommitteeEvents] = useState([]);
  const [committeeUsers, setCommitteeUsers] = useState([]);
  const [topReporter, setTopReporter] = useState(null);
  const [leaderboardLoading, setLeaderboardLoading] = useState(true);
  const [committeeLocation, setCommitteeLocation] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCommitteeData = async () => {
      try {
        const res = await api.get("/committees/committee");
        setCurrCommittee(res.data.committee);
      } catch (e) {
        console.error("Failed to fetch committee data:", e);
      } finally {
        setLoading(false);
      }
    };
    getCommitteeData();
  }, []);
  useEffect(() => {
    if (!currCommittee?._id) return;
    const fetchCommitteeReports = async () => {
      try {
        const res = await api.get(`/committees/${currCommittee._id}/data`);
        setCommitteeReports(res.data.reports);
        setCommitteeEvents(res.data.events);
        setCommitteeLocation({
          lat: res.data.committeeLocation.coordinates[1],
          lng: res.data.committeeLocation.coordinates[0],
        });
      } catch (e) {
        console.error("Failed to fetch committee reports:", e);
      }
    };
    fetchCommitteeReports();
  }, [currCommittee]);
  useEffect(() => {
    if (!currCommittee?._id) return;
  
    const fetchCommitteeUsers = async () => {
      try {
        setLeaderboardLoading(true);
        const res = await api.get(`/committees/${currCommittee._id}/users`);
        
        // Sort by reports count
        const sorted = res.data.users.sort(
          (a, b) => b.reports.length - a.reports.length
        );
        setTopReporter(sorted[0] || null);
        setCommitteeUsers(sorted);
      } catch (err) {
        console.error("Failed to load committee leaderboard:", err);
      } finally {
        setLeaderboardLoading(false);
      }
    };
  
    fetchCommitteeUsers();
  }, [currCommittee]);
  
  if (loading) return <div className="loading-state">Loading Dashboard...</div>;
  if (!currCommittee) return <div className="empty-state">Could not load committee data.</div>;
 
  const dateFormed = new Date(currCommittee.createdAt).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  return (
    <main className="committee-dashboard-page">
      <header className="dashboard-header">
        <h1 className="dashboard-header__title">
          Welcome, {currCommittee.committeeName}
        </h1>
        <p className="dashboard-header__subtitle">
          Here is the overview of your committee's activities and members.
        </p>
      </header>

      {/* --- STATS CARDS --- */}
      <section className="stats-grid">
        <div className="stat-card">
          <h2 className="stat-card__title">Total Members</h2>
          <p className="stat-card__value">
            {currCommittee.members?.length || 0}
          </p>
        </div>
        <div className="stat-card">
          <h2 className="stat-card__title">Date Formed</h2>
          <p className="stat-card__value" style={{ fontSize: "1.8rem" }}>
            {dateFormed}
          </p>
        </div>
        <div className="stat-card">
          <h2 className="stat-card__title">Top Reporter</h2>
          <p className="stat-card__value">
            {topReporter ? `${topReporter.fname} ${topReporter.lname}` : "N/A"}
          </p>
        </div>
      </section>
      {/* --- COMMITTEE MAP MODULE --- */}
      <section className="dashboard-module">
        <h2 className="module-header">
          Your Committee Map [Displays Committee Reports & Events]
        </h2>

        {!committeeLocation ? (
          <p>Loading map...</p>
        ) : (
          <MapContainer
            center={[committeeLocation.lat, committeeLocation.lng]}
            zoom={14}
            style={{
              height: "450px",
              width: "100%",
              borderRadius: "12px",
              marginTop: "1rem",
            }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap"
            />

            {committeeReports?.length > 0 ? (
              committeeReports.map((r) => (
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
              ))
            ) : (
              <></>
            )}

            {committeeEvents?.length > 0 &&
              committeeEvents.map((ev) => (
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
                        {new Date(ev.eventDateTime).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </span>
                      <br />
                      <span>
                        <strong>Time:</strong>{" "}
                        {new Date(ev.eventDateTime).toLocaleTimeString(
                          "en-IN",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </span>
                      <br />
                      <span>
                        <strong>Attendees:</strong> {ev.registeredUsers.length}
                      </span>
                    </div>
                  </Popup>
                </Marker>
              ))}
          </MapContainer>
        )}
      </section>

      {/* --- MEMBERS LIST MODULE --- */}
      <section className="dashboard-module">
        <h2 className="module-header">Members List</h2>
        <div className="table-container">
          <table className="members-table">
            <thead>
              <tr>
                <th>Member Name</th>
                <th>Email Address</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {currCommittee.members && currCommittee.members.length > 0 ? (
                currCommittee.members.map((member) => (
                  <tr key={member._id}>
                    <td>
                      {member.fname} {member.lname}
                    </td>
                    <td>{member.email}</td>
                    <td>{member.role}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    style={{ textAlign: "center", padding: "2rem" }}
                  >
                    No members found for this committee.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* --- COMMITTEE LEADERBOARD --- */}
      <section className="dashboard-module">
        <h2 className="module-header">Committee Leaderboard</h2>

        {leaderboardLoading ? (
          <div className="loader-container">
            <div className="loader"></div>
            <span>Loading leaderboard...</span>
          </div>
        ) : committeeUsers.length === 0 ? (
          <div className="empty-state">
            <h2>No Reports Yet</h2>
            <p>Encourage your committee members to start reporting!</p>
          </div>
        ) : (
          <div className="leaderboard-table-container">
            <table className="leaderboard-table">
              <thead>
                <tr>
                  <th className="header-rank">Rank</th>
                  <th className="header-user">User</th>
                  <th className="header-score">Reports</th>
                  <th className="header-score">GreenCoins</th>
                </tr>
              </thead>
              <tbody>
                {committeeUsers.map((u, index) => {
                  const rank = index + 1;
                  const fullName = `${u.fname} ${u.lname}`.trim();

                  let rowClass = "leaderboard-row";
                  if (rank === 1) rowClass += " rank-1-row";
                  else if (rank === 2) rowClass += " rank-2-row";
                  else if (rank === 3) rowClass += " rank-3-row";

                  let rankClass = "rank-cell";
                  if (rank === 1) rankClass += " rank-1";
                  else if (rank === 2) rankClass += " rank-2";
                  else if (rank === 3) rankClass += " rank-3";

                  return (
                    <tr key={u._id} className={rowClass}>
                      <td className={rankClass}>{rank}</td>
                      <td className="user-cell">{fullName}</td>
                      <td className="score-cell text-center">
                        {u.reports.length}
                      </td>
                      <td className="score-cell text-center">{u.points}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
