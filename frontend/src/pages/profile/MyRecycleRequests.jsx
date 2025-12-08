import React, { useEffect, useState } from "react";
import "./MyRecycleRequests.css";
import api from "../../utils/axiosConfig";

function MyRecycleRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await api.get("/recycle/my-requests");
        setRequests(res.data || []);
      } catch (err) {
        console.error("Failed to fetch recycle requests:", err);
      }
      setLoading(false);
    };

    fetchRequests();
  }, []);

  const statusConfig = {
    pending: { label: "Pending Review", icon: "⏳", color: "pending" },
    approved: { label: "Approved", icon: "✅", color: "approved" },
    "vendor-assigned": { label: "Vendor Assigned", icon: "🚚", color: "vendor-assigned" },
    collected: { label: "Collected", icon: "📦", color: "collected" },
    verified: { label: "Verified", icon: "✔️", color: "verified" },
    paid: { label: "Paid", icon: "💰", color: "paid" },
    rejected: { label: "Rejected", icon: "❌", color: "rejected" },
  };

  const wasteTypeIcons = {
    "Plastic Waste": "♻️",
    "E-Waste": "📱",
    "Glass Waste": "🍾",
    "Metal Waste": "🔧",
    "Paper & Cardboard": "📦",
    "Battery Waste": "🔋"
  };

  const filteredRequests = filter === "all" 
    ? requests 
    : requests.filter(req => req.status === filter);

  const getStatusCounts = () => {
    const counts = { all: requests.length };
    requests.forEach(req => {
      counts[req.status] = (counts[req.status] || 0) + 1;
    });
    return counts;
  };

  const statusCounts = getStatusCounts();

  const getPickupMethodLabel = (method) => {
    return method === "vendor" ? "Vendor Pickup" : "Self Drop-off";
  };

  return (
    <div className="my-requests-page">
      {/* Hero Header */}
      <div className="requests-hero">
        <div className="hero-content-requests">
          <h1 className="requests-main-title">My Recycle Requests</h1>
          <p className="requests-subtitle">Track your recycling journey and earnings</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <span className="stat-number">{requests.length}</span>
            <span className="stat-label">Total Requests</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <span className="stat-number">
              ₹{requests.reduce((sum, req) => sum + (req.finalAmount || req.estimatedAmount || 0), 0).toFixed(2)}
            </span>
            <span className="stat-label">Total Earnings</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⚖️</div>
          <div className="stat-info">
            <span className="stat-number">
              {requests.reduce((sum, req) => sum + (req.weightKg || 0), 0).toFixed(1)} kg
            </span>
            <span className="stat-label">Total Recycled</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        <button
          className={`filter-tab ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          All
          <span className="tab-count">{statusCounts.all || 0}</span>
        </button>
        <button
          className={`filter-tab ${filter === "pending" ? "active" : ""}`}
          onClick={() => setFilter("pending")}
        >
          Pending
          {statusCounts.pending > 0 && <span className="tab-count">{statusCounts.pending}</span>}
        </button>
        <button
          className={`filter-tab ${filter === "approved" ? "active" : ""}`}
          onClick={() => setFilter("approved")}
        >
          Approved
          {statusCounts.approved > 0 && <span className="tab-count">{statusCounts.approved}</span>}
        </button>
        <button
          className={`filter-tab ${filter === "paid" ? "active" : ""}`}
          onClick={() => setFilter("paid")}
        >
          Paid
          {statusCounts.paid > 0 && <span className="tab-count">{statusCounts.paid}</span>}
        </button>
      </div>

      {/* Requests Container */}
      <div className="requests-container">
        {loading && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading your submissions...</p>
          </div>
        )}

        {!loading && requests.length === 0 && (
          <div className="empty-state-card">
            <div className="empty-icon">🌱</div>
            <h3>No Recycle Requests Yet</h3>
            <p>Start your recycling journey by submitting your first request!</p>
            <button className="btn-primary" onClick={() => window.location.href = '/recycle'}>
              Submit Request
            </button>
          </div>
        )}

        {!loading && filteredRequests.length === 0 && requests.length > 0 && (
          <div className="empty-state-card">
            <div className="empty-icon">🔍</div>
            <h3>No {filter} requests found</h3>
            <p>Try selecting a different filter</p>
          </div>
        )}

        <div className="requests-grid">
          {filteredRequests.map((req) => {
            const statusInfo = statusConfig[req.status] || { label: req.status, icon: "📋", color: "default" };
            const wasteIcon = wasteTypeIcons[req.wasteType?.name] || "♻️";

            return (
              <div key={req._id} className="request-card">
                {/* Card Header with Icon & Status */}
                <div className="card-header">
                  <div className="waste-type-header">
                    <span className="waste-icon-large">{wasteIcon}</span>
                    <div>
                      <h3 className="waste-type-title">{req.wasteType?.name || "Waste Item"}</h3>
                      <p className="item-name">{req.itemName}</p>
                    </div>
                  </div>
                  <span className={`status-badge-modern status-${statusInfo.color}`}>
                    <span className="status-icon">{statusInfo.icon}</span>
                    {statusInfo.label}
                  </span>
                </div>

                {/* Description */}
                {req.itemDescription && (
                  <div className="card-description">
                    <p>{req.itemDescription}</p>
                  </div>
                )}

                {/* Details Grid */}
                <div className="details-grid">
                  <div className="detail-item">
                    <span className="detail-icon">⚖️</span>
                    <div className="detail-content">
                      <span className="detail-label">Weight</span>
                      <span className="detail-value">{req.weightKg || "N/A"} kg</span>
                    </div>
                  </div>

                  <div className="detail-item">
                    <span className="detail-icon">💵</span>
                    <div className="detail-content">
                      <span className="detail-label">
                        {req.finalAmount ? "Final Amount" : "Estimated"}
                      </span>
                      <span className="detail-value amount">
                        ₹{req.finalAmount || req.estimatedAmount || 0}
                      </span>
                    </div>
                  </div>

                  <div className="detail-item">
                    <span className="detail-icon">🏢</span>
                    <div className="detail-content">
                      <span className="detail-label">Collection Center</span>
                      <span className="detail-value">{req.franchisee?.centerName || "Not assigned"}</span>
                    </div>
                  </div>

                  <div className="detail-item">
                    <span className="detail-icon">🚚</span>
                    <div className="detail-content">
                      <span className="detail-label">Pickup Method</span>
                      <span className="detail-value">{getPickupMethodLabel(req.pickupMethod)}</span>
                    </div>
                  </div>
                </div>

                {/* Vendor Info (if assigned) */}
                {req.vendor && (
                  <div className="vendor-info">
                    <span className="vendor-icon">👤</span>
                    <span>Vendor: {req.vendor.name || "Assigned"}</span>
                  </div>
                )}

                {/* Notes */}
                {req.notes && (
                  <div className="notes-section">
                    <strong>📝 Notes:</strong> {req.notes}
                  </div>
                )}

                {/* Footer with Date */}
                <div className="card-footer">
                  <div className="footer-date">
                    <span className="date-icon">📅</span>
                    <span>
                      Submitted {new Date(req.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                      })}
                    </span>
                  </div>
                  
                  {/* Progress Indicator */}
                  <div className="progress-indicator">
                    {req.status === "pending" && <span className="pulse-dot"></span>}
                    {req.status === "paid" && <span className="checkmark">✓</span>}
                  </div>
                </div>

                {/* Status Timeline (for non-pending/rejected) */}
                {!["pending", "rejected"].includes(req.status) && (
                  <div className="status-timeline">
                    <div className={`timeline-step ${["approved", "vendor-assigned", "collected", "verified", "paid"].includes(req.status) ? "completed" : ""}`}>
                      <div className="step-dot"></div>
                      <span>Approved</span>
                    </div>
                    <div className={`timeline-step ${["collected", "verified", "paid"].includes(req.status) ? "completed" : ""}`}>
                      <div className="step-dot"></div>
                      <span>Collected</span>
                    </div>
                    <div className={`timeline-step ${["verified", "paid"].includes(req.status) ? "completed" : ""}`}>
                      <div className="step-dot"></div>
                      <span>Verified</span>
                    </div>
                    <div className={`timeline-step ${req.status === "paid" ? "completed" : ""}`}>
                      <div className="step-dot"></div>
                      <span>Paid</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default MyRecycleRequests;