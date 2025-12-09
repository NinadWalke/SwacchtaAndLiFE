import React, { useEffect, useState } from "react";
import api from "../../../utils/axiosConfig";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import './CommitteeDashboard.css';
import './LeaderboardTable.css';

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
  const [allReports, setAllReports] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [allFranchisees, setAllFranchisees] = useState([]);
  const [topReporter, setTopReporter] = useState(null);
  const [leaderboardLoading, setLeaderboardLoading] = useState(true);
  const [committeeLocation, setCommitteeLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  // Analytics States
  const [reportAnalytics, setReportAnalytics] = useState({
    total: 0,
    pending: 0,
    allotted: 0,
    resolved: 0,
  });
  const [eventAnalytics, setEventAnalytics] = useState({
    total: 0,
    upcoming: 0,
    past: 0,
    totalAttendees: 0,
  });
  const [franchiseeAnalytics, setFranchiseeAnalytics] = useState({
    total: 0,
    active: 0,
    totalCollectedKg: 0,
  });

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

  // Fetch all reports, events, and franchisees for analytics
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [reportsRes, eventsRes, franchiseesRes] = await Promise.all([
          api.get("/reports"),
          api.get("/events"),
          api.get("/recycle/franchisees"),
        ]);

        const reports = reportsRes.data.reports || [];
        const events = eventsRes.data || [];
        const franchisees = franchiseesRes.data.franchisees || [];

        setAllReports(reports);
        setAllEvents(events);
        setAllFranchisees(franchisees);

        // Calculate report analytics
        const reportStats = {
          total: reports.length,
          pending: reports.filter((r) => r.status === "pending").length,
          allotted: reports.filter((r) => r.status === "allotted").length,
          resolved: reports.filter((r) => r.status === "resolved").length,
        };
        setReportAnalytics(reportStats);

        // Calculate event analytics
        const now = new Date();
        const upcomingEvents = events.filter(
          (e) => new Date(e.eventDateTime) > now
        );
        const pastEvents = events.filter((e) => new Date(e.eventDateTime) <= now);
        const totalAttendees = events.reduce(
          (sum, e) => sum + (e.registrations?.length || 0),
          0
        );
        setEventAnalytics({
          total: events.length,
          upcoming: upcomingEvents.length,
          past: pastEvents.length,
          totalAttendees,
        });

        // Calculate franchisee analytics
        const activeFranchisees = franchisees.filter((f) => f.isActive);
        const totalCollected = franchisees.reduce(
          (sum, f) => sum + (f.totalCollectedKg || 0),
          0
        );
        setFranchiseeAnalytics({
          total: franchisees.length,
          active: activeFranchisees.length,
          totalCollectedKg: totalCollected,
        });
      } catch (err) {
        console.error("Failed to fetch analytics data:", err);
      }
    };

    fetchAllData();
  }, []);

  if (loading)
    return <div className="loading-state">Loading Dashboard...</div>;
  if (!currCommittee)
    return <div className="empty-state">Could not load committee data.</div>;

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

      {/* --- MAIN STATS CARDS --- */}
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

      {/* --- REPORT ANALYTICS --- */}
      <section className="dashboard-module">
        <h2 className="module-header">Report Analytics</h2>
        <div className="analytics-grid">
          <div className="analytics-card">
            <div className="analytics-card__icon">📊</div>
            <div className="analytics-card__content">
              <h3 className="analytics-card__title">Total Reports</h3>
              <p className="analytics-card__value">{reportAnalytics.total}</p>
            </div>
          </div>
          <div className="analytics-card analytics-card--warning">
            <div className="analytics-card__icon">⏳</div>
            <div className="analytics-card__content">
              <h3 className="analytics-card__title">Pending</h3>
              <p className="analytics-card__value">{reportAnalytics.pending}</p>
            </div>
          </div>
          <div className="analytics-card analytics-card--info">
            <div className="analytics-card__icon">🚛</div>
            <div className="analytics-card__content">
              <h3 className="analytics-card__title">Allotted</h3>
              <p className="analytics-card__value">{reportAnalytics.allotted}</p>
            </div>
          </div>
          <div className="analytics-card analytics-card--success">
            <div className="analytics-card__icon">✅</div>
            <div className="analytics-card__content">
              <h3 className="analytics-card__title">Resolved</h3>
              <p className="analytics-card__value">{reportAnalytics.resolved}</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- EVENT ANALYTICS --- */}
      <section className="dashboard-module">
        <h2 className="module-header">Event Analytics</h2>
        <div className="analytics-grid">
          <div className="analytics-card">
            <div className="analytics-card__icon">🎉</div>
            <div className="analytics-card__content">
              <h3 className="analytics-card__title">Total Events</h3>
              <p className="analytics-card__value">{eventAnalytics.total}</p>
            </div>
          </div>
          <div className="analytics-card analytics-card--info">
            <div className="analytics-card__icon">📅</div>
            <div className="analytics-card__content">
              <h3 className="analytics-card__title">Upcoming</h3>
              <p className="analytics-card__value">{eventAnalytics.upcoming}</p>
            </div>
          </div>
          <div className="analytics-card analytics-card--secondary">
            <div className="analytics-card__icon">📜</div>
            <div className="analytics-card__content">
              <h3 className="analytics-card__title">Past Events</h3>
              <p className="analytics-card__value">{eventAnalytics.past}</p>
            </div>
          </div>
          <div className="analytics-card analytics-card--success">
            <div className="analytics-card__icon">👥</div>
            <div className="analytics-card__content">
              <h3 className="analytics-card__title">Total Attendees</h3>
              <p className="analytics-card__value">
                {eventAnalytics.totalAttendees}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- FRANCHISEE ANALYTICS --- */}
      <section className="dashboard-module">
        <h2 className="module-header">Franchisee Analytics</h2>
        <div className="analytics-grid">
          <div className="analytics-card">
            <div className="analytics-card__icon">🏪</div>
            <div className="analytics-card__content">
              <h3 className="analytics-card__title">Total Franchisees</h3>
              <p className="analytics-card__value">
                {franchiseeAnalytics.total}
              </p>
            </div>
          </div>
          <div className="analytics-card analytics-card--success">
            <div className="analytics-card__icon">✅</div>
            <div className="analytics-card__content">
              <h3 className="analytics-card__title">Active</h3>
              <p className="analytics-card__value">
                {franchiseeAnalytics.active}
              </p>
            </div>
          </div>
          <div className="analytics-card analytics-card--info">
            <div className="analytics-card__icon">♻️</div>
            <div className="analytics-card__content">
              <h3 className="analytics-card__title">Total Collected</h3>
              <p className="analytics-card__value">
                {franchiseeAnalytics.totalCollectedKg} kg
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- COMMITTEE MAP MODULE --- */}
      <section className="dashboard-module">
        <h2 className="module-header">
          Comprehensive Map [Reports, Events & Franchisees]
        </h2>

        {!committeeLocation ? (
          <p>Loading map...</p>
        ) : (
          <MapContainer
            center={[committeeLocation.lat, committeeLocation.lng]}
            zoom={14}
            style={{
              height: "500px",
              width: "100%",
              borderRadius: "12px",
              marginTop: "1rem",
            }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap"
            />

            {/* Committee Reports */}
            {committeeReports?.length > 0 &&
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
                    <div style={{ minWidth: "180px" }}>
                      <strong>Report ID: {r._id.slice(-6)}</strong>
                      <br />
                      <span>
                        <strong>Status:</strong>{" "}
                        <span className={`status-badge status--${r.status}`}>
                          {r.status}
                        </span>
                      </span>
                      <br />
                      <span>
                        <strong>Date:</strong>{" "}
                        {new Date(r.time).toLocaleDateString("en-IN")}
                      </span>
                      <br />
                      <span>
                        <strong>Remarks:</strong> {r.remarks || "N/A"}
                      </span>
                    </div>
                  </Popup>
                </Marker>
              ))}

            {/* Committee Events */}
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
                        <strong>Attendees:</strong>{" "}
                        {ev?.registrations?.length || 0}
                      </span>
                    </div>
                  </Popup>
                </Marker>
              ))}

            {/* All Franchisees */}
            {allFranchisees?.length > 0 &&
              allFranchisees.map((f) => (
                <Marker
                  key={f._id}
                  position={[
                    f.location.coordinates[1],
                    f.location.coordinates[0],
                  ]}
                  icon={createMarkerIcon("franchisee")}
                >
                  <Popup>
                    <div style={{ minWidth: "180px" }}>
                      <strong>{f.centerName}</strong>
                      <br />
                      <span>
                        <strong>Owner:</strong> {f.owner?.fname} {f.owner?.lname}
                      </span>
                      <br />
                      <span>
                        <strong>Phone:</strong> {f.phone}
                      </span>
                      <br />
                      <span>
                        <strong>Address:</strong> {f.address}
                      </span>
                      <br />
                      <span>
                        <strong>Pincode:</strong> {f.pincode}
                      </span>
                      <br />
                      <span>
                        <strong>Status:</strong>{" "}
                        {f.isActive ? "Active ✅" : "Inactive ❌"}
                      </span>
                      <br />
                      <span>
                        <strong>Total Collected:</strong> {f.totalCollectedKg} kg
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
        <h2 className="module-header">Committee Members</h2>
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