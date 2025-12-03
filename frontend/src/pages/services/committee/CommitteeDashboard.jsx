import React, { useEffect, useState } from "react";
import api from "../../../utils/axiosConfig";
import "./CommitteeDashboard.css";

export default function CommitteeDashboard() {
  const [currCommittee, setCurrCommittee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [newMember, setNewMember] = useState({
    fname: "",
    lname: "",
    email: "",
    role: "member",
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

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!newMember.fname || !newMember.lname || !newMember.email) {
      alert("Please fill in all fields");
      return;
    }
    try {
      const res = await api.post("/committees/add-member", newMember);
      setCurrCommittee(res.data.committee);
      setNewMember({ fname: "", lname: "", email: "", role: "member" });
      setShowAddMemberModal(false);
      alert("Member added successfully!");
    } catch (e) {
      console.error("Error adding member:", e);
      alert(e.response?.data?.message || "Failed to add member");
    }
  };

  const handleMemberInputChange = (e) => {
    setNewMember({
      ...newMember,
      [e.target.name]: e.target.value,
    });
  };

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
        </div>
      </section>

      {/* --- MEMBERS LIST MODULE --- */}
      <section className="dashboard-module">
        <div className="module-header-wrapper">
          <h2 className="module-header">Members List</h2>
          <button
            className="btn btn--primary btn-add-member"
            onClick={() => setShowAddMemberModal(true)}
          >
            + Add Member
          </button>
        </div>

        {/* Add Member Modal */}
        {showAddMemberModal && (
          <div className="modal-overlay" onClick={() => setShowAddMemberModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Add New Member</h2>
                <button
                  className="modal-close"
                  onClick={() => setShowAddMemberModal(false)}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddMember} className="member-form">
                <div className="form__group">
                  <label className="form__label">First Name</label>
                  <input
                    className="form__input"
                    name="fname"
                    type="text"
                    placeholder="First name"
                    onChange={handleMemberInputChange}
                    value={newMember.fname}
                    required
                  />
                </div>

                <div className="form__group">
                  <label className="form__label">Last Name</label>
                  <input
                    className="form__input"
                    name="lname"
                    type="text"
                    placeholder="Last name"
                    onChange={handleMemberInputChange}
                    value={newMember.lname}
                    required
                  />
                </div>

                <div className="form__group">
                  <label className="form__label">Email Address</label>
                  <input
                    className="form__input"
                    name="email"
                    type="email"
                    placeholder="member@example.com"
                    onChange={handleMemberInputChange}
                    value={newMember.email}
                    required
                  />
                </div>

                <div className="form__group">
                  <label className="form__label">Role</label>
                  <select
                    className="form__input"
                    name="role"
                    onChange={handleMemberInputChange}
                    value={newMember.role}
                  >
                    <option value="member">Member</option>
                    <option value="leader">Leader</option>
                  </select>
                </div>

                <div className="form__actions">
                  <button type="submit" className="btn btn--primary">
                    Add Member
                  </button>
                  <button
                    type="button"
                    className="btn btn--secondary"
                    onClick={() => setShowAddMemberModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

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

      {/* --- ASSIGNED TASKS/REPORTS MODULE --- */}
      <section className="dashboard-module">
        <h2 className="module-header">Assigned Tasks</h2>
        <div className="empty-state" style={{minHeight: 'auto', padding: '2rem'}}>
          Task assignment functionality is coming soon.
        </div>
      </section>
    </main>
  );
}