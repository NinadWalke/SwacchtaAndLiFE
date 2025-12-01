import React, { useEffect, useState } from "react";
import api from "../../../utils/axiosConfig";
import "./CommitteeDashboard.css"; // Import the new stylesheet

export default function CommitteeDashboard() {
  const [currCommittee, setCurrCommittee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCommitteeData = async () => {
      try {
        const res = await api.get("/committees/committee");
        // NOTE: For the members table to work, your backend must .populate('members')
        // on this API endpoint to send the full user objects, not just their IDs.
        setCurrCommittee(res.data.committee);
      } catch (e) {
        console.error("Failed to fetch committee data:", e);
      } finally {
        setLoading(false);
      }
    };
    getCommitteeData();
  }, []);

  if (loading) {
    return <div className="loading-state">Loading Dashboard...</div>;
  }

  if (!currCommittee) {
    return <div className="empty-state">Could not load committee data.</div>;
  }

  const dateFormed = new Date(currCommittee.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

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
          <p className="stat-card__value">{currCommittee.members?.length || 0}</p>
        </div>
        <div className="stat-card">
          <h2 className="stat-card__title">Date Formed</h2>
          <p className="stat-card__value" style={{fontSize: '1.8rem'}}>{dateFormed}</p>
        </div>
        <div className="stat-card">
          <h2 className="stat-card__title">Active Tasks</h2>
          <p className="stat-card__value">0</p> 
          {/* Placeholder for future functionality */}
        </div>
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
                    <td>{member.fname} {member.lname}</td>
                    <td>{member.email}</td>
                    <td>{member.role}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" style={{textAlign: 'center', padding: '2rem'}}>No members found for this committee.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

       {/* --- ASSIGNED TASKS/REPORTS MODULE (Placeholder for future development) --- */}
       <section className="dashboard-module">
        <h2 className="module-header">Assigned Tasks</h2>
        <div className="empty-state" style={{minHeight: 'auto', padding: '2rem'}}>
          Task assignment functionality is coming soon.
        </div>
      </section>
    </main>
  );
}