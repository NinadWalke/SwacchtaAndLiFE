import React, { useEffect, useState } from "react";
import "./MyRecycleRequests.css";
import api from "../../utils/axiosConfig";

function MyRecycleRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await api.get("/recycle/my-requests");
        setRequests(res.data.requests || []);
      } catch (err) {
        console.error("Failed to fetch recycle requests:", err);
      }
      setLoading(false);
    };

    fetchRequests();
  }, []);

  return (
    <div className="my-requests-page">
      <div className="my-requests-card">
        <h2 className="my-requests-title">My Recycle Requests</h2>

        {loading && <p className="loading-text">Loading your submissions...</p>}

        {!loading && requests.length === 0 && (
          <p className="empty-state">You haven't submitted any recycle requests yet.</p>
        )}

        <div className="requests-list">
          {requests.map((req) => (
            <div key={req._id} className="request-item">
              
              <div className="request-header">
                <h3 className="request-waste-type">
                  {req.wasteType?.name || "Waste Item"}
                </h3>
                <span className={`status-badge status-${req.status}`}>
                  {req.status.toUpperCase()}
                </span>
              </div>

              <p className="request-field">
                <strong>Item:</strong> {req.itemName}
              </p>

              {req.itemDescription && (
                <p className="request-field">
                  <strong>Description:</strong> {req.itemDescription}
                </p>
              )}

              <p className="request-field">
                <strong>Weight:</strong> {req.weightKg || "Not specified"} kg
              </p>

              <p className="request-field">
                <strong>Franchisee:</strong> {req.franchisee?.centerName}
              </p>

              <p className="request-field">
                <strong>Submitted On:</strong>{" "}
                {new Date(req.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric"
                })}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MyRecycleRequests;
