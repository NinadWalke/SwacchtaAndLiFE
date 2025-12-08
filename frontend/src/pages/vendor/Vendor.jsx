import React, { useEffect, useState } from "react";
import "./Vendor.css";
import api from "../../utils/axiosConfig";

function Vendor() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  // Fetch assigned submissions for vendor
  const fetchAssigned = async () => {
    try {
      const res = await api.get("/waste-submission/assigned");
      setSubmissions(res.data || []);
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Failed to load assigned requests." });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAssigned();
  }, []);

  // Vendor marks job as collected
  const markCollected = async (id) => {
    if (!window.confirm("Confirm collection from user?")) return;

    setActionLoading(id);
    try {
      await api.patch(`/waste-submission/requests/${id}/collected`);
      setMessage({ type: "success", text: "Marked as collected!" });
      fetchAssigned();
    } catch (err) {
      setMessage({
        type: "error",
        text: err?.response?.data?.message || "Failed to update.",
      });
    }
    setActionLoading(null);
  };

  return (
    <div className="vendor-dashboard">
      <h1 className="vendor-title">Vendor Dashboard</h1>
      <p className="vendor-subtitle">View and manage waste pickups assigned to you.</p>

      {message && (
        <div className={`vendor-alert vendor-alert-${message.type}`}>
          {message.text}
          <button onClick={() => setMessage(null)} className="vendor-alert-close">×</button>
        </div>
      )}

      {loading ? (
        <p className="vendor-loading">Loading assigned submissions...</p>
      ) : submissions.length === 0 ? (
        <div className="vendor-empty">
          <p>No assigned pickups yet.</p>
        </div>
      ) : (
        <div className="vendor-grid">
          {submissions.map((req) => (
            <div key={req._id} className="vendor-card">
              <div className="vendor-card-header">
                <h3>
                  {req.wasteType?.name} – <span>{req.weightKg} kg</span>
                </h3>
                <span className={`vendor-status status-${req.status}`}>
                  {req.status}
                </span>
              </div>

              <div className="vendor-card-body">
                <p><strong>User:</strong> {req.user?.fname} {req.user?.lname}</p>
                <p><strong>Email:</strong> {req.user?.email}</p>
                <p><strong>Estimated Amount:</strong> ₹{req.estimatedAmount}</p>
                <p><strong>Pickup Method:</strong> {req.pickupMethod}</p>
                <p><strong>Assigned At:</strong> {new Date(req.createdAt).toLocaleString()}</p>
              </div>

              <div className="vendor-card-actions">
                {req.status === "vendor-assigned" ? (
                  <button
                    className="vendor-btn-collect"
                    disabled={actionLoading === req._id}
                    onClick={() => markCollected(req._id)}
                  >
                    {actionLoading === req._id ? "Updating..." : "Mark as Collected"}
                  </button>
                ) : (
                  <span className="vendor-collected-label">Already Collected</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Vendor;
