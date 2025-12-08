import React, { useState } from "react";
import "./FranchiseeDashboard.css";

// Import the sub-pages
import RequestManagement from "./components/RequestManagement";
import WasteTypes from "./components/WasteTypes";
import Logistics from "./components/Logistics";

function FranchiseeDashboard() {
  const [activeTab, setActiveTab] = useState("requests");

  const renderSection = () => {
    switch (activeTab) {
      case "requests":
        return <RequestManagement />;
      case "types":
        return <WasteTypes />;
      case "logistics":
        return <Logistics />;
      default:
        return <RequestManagement />;
    }
  };

  return (
    <div className="franchisee-dashboard-page">

      <div className="franchisee-dashboard-card">
        <h2 className="dashboard-title">Franchisee Dashboard</h2>

        {/* --- INNER NAVIGATION --- */}
        <nav className="dashboard-nav">
          <button
            className={`nav-btn ${activeTab === "requests" ? "active" : ""}`}
            onClick={() => setActiveTab("requests")}
          >
            Request Management
          </button>

          <button
            className={`nav-btn ${activeTab === "types" ? "active" : ""}`}
            onClick={() => setActiveTab("types")}
          >
            Waste Types
          </button>

          <button
            className={`nav-btn ${activeTab === "logistics" ? "active" : ""}`}
            onClick={() => setActiveTab("logistics")}
          >
            Logistics Overview
          </button>
        </nav>

        {/* --- CONTENT SECTION --- */}
        <div className="dashboard-content">
          {renderSection()}
        </div>
      </div>
    </div>
  );
}

export default FranchiseeDashboard;
