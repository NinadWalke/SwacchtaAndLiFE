import React, { useEffect, useState } from "react";
import "./RequestManagement.css";
import api from "../../../utils/axiosConfig";

function RequestManagement() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [message, setMessage] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [vendorEmail, setVendorEmail] = useState("");
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);

  const fetchRequests = async () => {
    try {
      const res = await api.get("/recycle/franchisee/requests");
      setRequests(res.data || []);
    } catch (err) {
      console.error("Failed to load requests:", err);
      setMessage({ type: "error", text: "Failed to load requests." });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleApprove = async (id) => {
    setActionLoading(id);
    try {
      await api.patch(`/recycle/franchisee/requests/${id}/approve`);
      setMessage({ type: "success", text: "Request approved successfully!" });
      fetchRequests();
    } catch (err) {
      setMessage({
        type: "error",
        text: err?.response?.data?.message || "Failed to approve request.",
      });
    }
    setActionLoading(null);
  };

  const handleReject = async (id) => {
    if (!window.confirm("Are you sure you want to reject this request?"))
      return;

    setActionLoading(id);
    try {
      await api.patch(`/recycle/franchisee/requests/${id}/reject`);
      setMessage({ type: "success", text: "Request rejected." });
      fetchRequests();
    } catch (err) {
      setMessage({
        type: "error",
        text: err?.response?.data?.message || "Failed to reject request.",
      });
    }
    setActionLoading(null);
  };

  const handleAssignVendor = async () => {
    if (!vendorEmail.trim()) {
      setMessage({ type: "error", text: "Please enter a vendor email." });
      return;
    }

    setActionLoading(selectedRequestId);
    try {
      await api.patch(
        `/recycle/franchisee/requests/${selectedRequestId}/assign-vendor`,
        {
          vendorId: vendorEmail,
        }
      );
      setMessage({ type: "success", text: "Vendor assigned successfully!" });
      setShowVendorModal(false);
      setVendorEmail("");
      setSelectedRequestId(null);
      fetchRequests();
    } catch (err) {
      setMessage({
        type: "error",
        text: err?.response?.data?.message || "Failed to assign vendor.",
      });
    }
    setActionLoading(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this submission?"))
      return;

    setActionLoading(id);
    try {
      await api.delete(`/waste-submission/${id}`);
      setMessage({ type: "success", text: "Submission deleted successfully." });
      fetchRequests();
    } catch (err) {
      setMessage({
        type: "error",
        text: err?.response?.data?.message || "Failed to delete submission.",
      });
    }
    setActionLoading(null);
  };

  const openVendorModal = (requestId) => {
    setSelectedRequestId(requestId);
    setShowVendorModal(true);
  };

  const closeVendorModal = () => {
    setShowVendorModal(false);
    setVendorEmail("");
    setSelectedRequestId(null);
  };

  const handleVerify = async (id) => {
    setActionLoading(id);
    try {
      await api.patch(`/waste-submission/requests/${id}/verify`);
      setMessage({ type: "success", text: "Submission verified!" });
      fetchRequests();
    } catch (err) {
      setMessage({
        type: "error",
        text: err?.response?.data?.message || "Verification failed.",
      });
    }
    setActionLoading(null);
  };

  const handlePay = async (id) => {
    setActionLoading(id);
    try {
      await api.patch(`/waste-submission/requests/${id}/pay`);
      setMessage({ type: "success", text: "Payment marked successful!" });
      fetchRequests();
    } catch (err) {
      setMessage({
        type: "error",
        text: err?.response?.data?.message || "Payment update failed.",
      });
    }
    setActionLoading(null);
  };

  const statusConfig = {
    pending: { label: "Pending", icon: "⏳", color: "pending" },
    approved: { label: "Approved", icon: "✅", color: "approved" },
    "vendor-assigned": {
      label: "Vendor Assigned",
      icon: "🚚",
      color: "vendor-assigned",
    },
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
    "Battery Waste": "🔋",
  };

  const getStatusCounts = () => {
    const counts = { all: requests.length };
    requests.forEach((req) => {
      counts[req.status] = (counts[req.status] || 0) + 1;
    });
    return counts;
  };

  const statusCounts = getStatusCounts();

  const filteredRequests = requests
    .filter((req) => filter === "all" || req.status === filter)
    .filter((req) => {
      if (!searchTerm) return true;
      const search = searchTerm.toLowerCase();
      return (
        req.user?.fname?.toLowerCase().includes(search) ||
        req.user?.lname?.toLowerCase().includes(search) ||
        req.wasteType?.name?.toLowerCase().includes(search) ||
        req.itemName?.toLowerCase().includes(search)
      );
    });

  return (
    <div className="request-management-page">
      <div className="management-hero">
        <div className="hero-content-management">
          <h1 className="management-title">Request Management</h1>
          <p className="management-subtitle">
            Review and manage recycling submissions from users
          </p>
        </div>
      </div>

      <div className="management-stats">
        <div className="stat-card-management">
          <div className="stat-icon-management">📊</div>
          <div className="stat-info-management">
            <span className="stat-number-management">{requests.length}</span>
            <span className="stat-label-management">Total Requests</span>
          </div>
        </div>
        <div className="stat-card-management">
          <div className="stat-icon-management">⏳</div>
          <div className="stat-info-management">
            <span className="stat-number-management">
              {statusCounts.pending || 0}
            </span>
            <span className="stat-label-management">Pending Review</span>
          </div>
        </div>
        <div className="stat-card-management">
          <div className="stat-icon-management">✅</div>
          <div className="stat-info-management">
            <span className="stat-number-management">
              {statusCounts.approved || 0}
            </span>
            <span className="stat-label-management">Approved</span>
          </div>
        </div>
        <div className="stat-card-management">
          <div className="stat-icon-management">💰</div>
          <div className="stat-info-management">
            <span className="stat-number-management">
              {statusCounts.paid || 0}
            </span>
            <span className="stat-label-management">Completed</span>
          </div>
        </div>
      </div>

      {message && (
        <div className={`alert-message alert-${message.type}`}>
          <span className="alert-icon">
            {message.type === "success" ? "✅" : "⚠️"}
          </span>
          <span>{message.text}</span>
          <button className="alert-close" onClick={() => setMessage(null)}>
            ×
          </button>
        </div>
      )}

      <div className="controls-section">
        <div className="search-container">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by user name, waste type, or item..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-search" onClick={() => setSearchTerm("")}>
              ×
            </button>
          )}
        </div>

        <div className="filter-tabs-management">
          <button
            className={`filter-tab-management ${
              filter === "all" ? "active" : ""
            }`}
            onClick={() => setFilter("all")}
          >
            All Requests
            <span className="tab-badge">{statusCounts.all || 0}</span>
          </button>
          <button
            className={`filter-tab-management ${
              filter === "pending" ? "active" : ""
            }`}
            onClick={() => setFilter("pending")}
          >
            Pending
            {statusCounts.pending > 0 && (
              <span className="tab-badge">{statusCounts.pending}</span>
            )}
          </button>
          <button
            className={`filter-tab-management ${
              filter === "approved" ? "active" : ""
            }`}
            onClick={() => setFilter("approved")}
          >
            Approved
            {statusCounts.approved > 0 && (
              <span className="tab-badge">{statusCounts.approved}</span>
            )}
          </button>
          <button
            className={`filter-tab-management ${
              filter === "rejected" ? "active" : ""
            }`}
            onClick={() => setFilter("rejected")}
          >
            Rejected
            {statusCounts.rejected > 0 && (
              <span className="tab-badge">{statusCounts.rejected}</span>
            )}
          </button>
        </div>
      </div>

      <div className="requests-content">
        {loading ? (
          <div className="loading-state-management">
            <div className="spinner-management"></div>
            <p>Loading requests...</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="empty-state-management">
            <div className="empty-icon-management">
              {searchTerm ? "🔍" : "📋"}
            </div>
            <h3>{searchTerm ? "No matching requests" : "No requests yet"}</h3>
            <p>
              {searchTerm
                ? "Try adjusting your search terms"
                : "Requests will appear here once users submit them"}
            </p>
          </div>
        ) : (
          <div className="requests-grid-management">
            {filteredRequests.map((req) => {
              const statusInfo = statusConfig[req.status] || {
                label: req.status,
                icon: "📋",
                color: "default",
              };
              const wasteIcon = wasteTypeIcons[req.wasteType?.name] || "♻️";

              return (
                <div key={req._id} className="request-card-management">
                  <div className="card-header-management">
                    <div className="user-info-section">
                      <div className="user-avatar">
                        {req.user?.fname?.charAt(0) || "U"}
                      </div>
                      <div className="user-details">
                        <h3 className="user-name">
                          {req.user?.fname || "Unknown"} {req.user?.lname || ""}
                        </h3>
                        <p className="user-email">{req.user?.email || "N/A"}</p>
                      </div>
                    </div>
                    <span
                      className={`status-badge-management status-${statusInfo.color}`}
                    >
                      <span className="status-icon-badge">
                        {statusInfo.icon}
                      </span>
                      {statusInfo.label}
                    </span>
                  </div>

                  <div className="waste-info-section">
                    <div className="waste-type-info">
                      <span className="waste-icon-card">{wasteIcon}</span>
                      <div>
                        <h4 className="waste-type-name">
                          {req.wasteType?.name || "Unknown"}
                        </h4>
                        <p className="item-name-management">{req.itemName}</p>
                      </div>
                    </div>
                    {req.weightKg >= 10 && (
                      <span className="heavy-badge">🏋️ Heavy Load</span>
                    )}
                  </div>

                  {req.itemDescription && (
                    <div className="description-section">
                      <p>{req.itemDescription}</p>
                    </div>
                  )}

                  <div className="details-grid-management">
                    <div className="detail-box">
                      <span className="detail-icon-box">⚖️</span>
                      <div>
                        <span className="detail-label-box">Weight</span>
                        <span className="detail-value-box">
                          {req.weightKg || 0} kg
                        </span>
                      </div>
                    </div>
                    <div className="detail-box">
                      <span className="detail-icon-box">💵</span>
                      <div>
                        <span className="detail-label-box">Est. Amount</span>
                        <span className="detail-value-box amount">
                          ₹{req.estimatedAmount || 0}
                        </span>
                      </div>
                    </div>
                    <div className="detail-box full-width">
                      <span className="detail-icon-box">📅</span>
                      <div>
                        <span className="detail-label-box">Submitted</span>
                        <span className="detail-value-box">
                          {new Date(req.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {req.vendor && (
                    <div className="vendor-assigned-info">
                      <span className="vendor-icon-info">👤</span>
                      <span>
                        Vendor: {req.vendor.fname || "Unknown"}{" "}
                        {req.vendor.lname || ""}
                      </span>
                    </div>
                  )}

                  <div className="actions-section">
                    {req.status === "pending" ? (
                      <>
                        <button
                          className="btn-action-modern approve"
                          disabled={actionLoading === req._id}
                          onClick={() => handleApprove(req._id)}
                        >
                          {actionLoading === req._id ? (
                            <span className="btn-spinner"></span>
                          ) : (
                            <>
                              <span>✓</span>
                              Approve
                            </>
                          )}
                        </button>

                        <button
                          className="btn-action-modern reject"
                          disabled={actionLoading === req._id}
                          onClick={() => handleReject(req._id)}
                        >
                          {actionLoading === req._id ? (
                            <span className="btn-spinner"></span>
                          ) : (
                            <>
                              <span>✕</span>
                              Reject
                            </>
                          )}
                        </button>

                        {req.weightKg >= 10 && (
                          <button
                            className="btn-action-modern vendor"
                            disabled={actionLoading === req._id}
                            onClick={() => openVendorModal(req._id)}
                          >
                            <span>🚚</span>
                            Assign Vendor
                          </button>
                        )}
                      </>
                    ) 
                    : (
                      <div className="status-display">
                        <span className="status-icon-display">
                          {statusInfo.icon}
                        </span>
                        <span>Status: {statusInfo.label}</span>
                      </div>
                    )}
                    <button
                      className="btn-action-modern delete"
                      disabled={actionLoading === req._id}
                      onClick={() => handleDelete(req._id)}
                    >
                      {actionLoading === req._id ? (
                        <span className="btn-spinner"></span>
                      ) : (
                        <>
                          <span>🗑️</span>
                          Delete
                        </>
                      )}
                    </button>
                    {(req.status === "collected" || req.status === "approved") && (
                      <button
                        className="btn-action-modern verify"
                        disabled={actionLoading === req._id}
                        onClick={() => handleVerify(req._id)}
                      >
                        {actionLoading === req._id ? "Verifying..." : "Verify Collection"}
                      </button>
                    )}

                    {req.status === "verified" && (
                      <button
                        className="btn-action-modern pay"
                        disabled={actionLoading === req._id}
                        onClick={() => handlePay(req._id)}
                      >
                        {actionLoading === req._id ? "Paying..." : "Mark Paid"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showVendorModal && (
        <div className="modal-overlay" onClick={closeVendorModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Assign Vendor</h3>
              <button className="modal-close" onClick={closeVendorModal}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <p className="modal-description">
                Enter the vendor's email address to assign them to this request.
              </p>
              <div className="form-group-modal">
                <label>Vendor Email</label>
                <input
                  type="email"
                  className="modal-input"
                  placeholder="vendor@example.com"
                  value={vendorEmail}
                  onChange={(e) => setVendorEmail(e.target.value)}
                  autoFocus
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-modal-cancel" onClick={closeVendorModal}>
                Cancel
              </button>
              <button
                className="btn-modal-confirm"
                onClick={handleAssignVendor}
                disabled={!vendorEmail.trim() || actionLoading}
              >
                {actionLoading ? "Assigning..." : "Assign Vendor"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RequestManagement;