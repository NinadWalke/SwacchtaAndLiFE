import React, { useEffect, useState } from "react";
import "./RequestManagement.css";
import api from "../../../utils/axiosConfig";

function RequestManagement() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [message, setMessage] = useState(null);

  const fetchRequests = async () => {
    try {
      const res = await api.get("/recycle/franchisee/requests");
      console.log(res);
      setRequests(res.data || []);
    } catch (err) {
      console.error("Failed to load requests:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (id) => {
    setActionLoading(id);
    try {
      await api.patch(`/recycle/franchisee/requests/${id}/approve`);
      setMessage({ type: "success", text: "Request approved!" });
      fetchRequests();
    } catch (err) {
      setMessage({ type: "error", text: "Failed to approve request." });
    }
    setActionLoading(null);
  };

  const handleReject = async (id) => {
    setActionLoading(id);
    try {
      await api.patch(`/recycle/franchisee/requests/${id}/reject`);
      setMessage({ type: "error", text: "Request rejected." });
      fetchRequests();
    } catch (err) {
      setMessage({ type: "error", text: "Failed to reject request." });
    }
    setActionLoading(null);
  };

  return (
    <div className="requests-section">
      <h2 className="section-title">Request Management</h2>
      <p className="section-subtitle">Approve or reject recycling submissions.</p>

      {message && (
        <div className={`form__message form__message--${message.type}`}>
          {message.text}
        </div>
      )}

      {loading ? (
        <p>Loading requests...</p>
      ) : requests.length === 0 ? (
        <p>No recycle requests yet.</p>
      ) : (
        <table className="requests-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Waste Type</th>
              <th>Item</th>
              <th>Weight</th>
              <th>Status</th>
              <th>Submitted</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {requests.map((req) => (
              <tr key={req._id}>
                <td>{req.user?.fname || "N/A"}</td>
                <td>{req.wasteType?.name}</td>
                <td>{req.itemName}</td>
                <td>{req.weightKg || 0} kg</td>

                <td>
                  <span className={`status-tag status-${req.status.toLowerCase()}`}>
                    {req.status}
                  </span>
                </td>

                <td>{new Date(req.createdAt).toLocaleDateString()}</td>

                <td className="actions-cell">
                  {req.status === "pending" ? (
                    <>
                      <button
                        className="btn-action approve"
                        disabled={actionLoading === req._id}
                        onClick={() => handleApprove(req._id)}
                      >
                        Approve
                      </button>

                      <button
                        className="btn-action reject"
                        disabled={actionLoading === req._id}
                        onClick={() => handleReject(req._id)}
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <span className="status-static">{req.status}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default RequestManagement;
