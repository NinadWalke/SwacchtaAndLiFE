import React, { useEffect, useState } from "react";
import "./Recycle.css";
import api from "../../../utils/axiosConfig";

function Recycle() {
  const [wasteTypes, setWasteTypes] = useState([]);
  const [franchisees, setFranchisees] = useState([]);
  const [selectedWasteType, setSelectedWasteType] = useState(null);

  const [formData, setFormData] = useState({
    wasteTypeId: "",
    franchiseeId: "",
    itemName: "",
    itemDescription: "",
    weightKg: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [vendorEvents, setVendorEvents] = useState([]);

  // Fetch waste types + franchisees
  useEffect(() => {
    const fetchData = async () => {
      try {
        const typesRes = await api.get("/recycle/types");
        setWasteTypes(typesRes.data);

        navigator.geolocation.getCurrentPosition(async (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;

          const franRes = await api.get(
            `/recycle/franchisees/near-me?lat=${lat}&lng=${lng}&radiusKm=25`
          );

          setFranchisees(franRes.data.franchisees);
          // Fetch nearby vendor events (within 2 km)
          const eventsRes = await api.get(
            `/waste-submission/vendor/near-me?lat=${lat}&lng=${lng}&radiusKm=2`
          );
          setVendorEvents(eventsRes.data.events || []);
        });
      } catch (err) {
        console.error("Failed to fetch recycle data", err);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleWasteTypeSelect = (type) => {
    setSelectedWasteType(type);
    setFormData({ ...formData, wasteTypeId: type._id });

    // Smooth scroll to form
    document.getElementById("submit-form")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await api.post("/recycle/create", formData);

      if (res.status === 201) {
        setMessage({
          type: "success",
          text: "Recycle request submitted! Franchisee will review it.",
        });

        setFormData({
          wasteTypeId: "",
          franchiseeId: "",
          itemName: "",
          itemDescription: "",
          weightKg: "",
        });
        setSelectedWasteType(null);
      }
    } catch (err) {
      setMessage({
        type: "error",
        text: err?.response?.data?.message || "Something went wrong",
      });
    }

    setLoading(false);
  };

  // Waste type icons mapping
  const wasteIcons = {
    "Plastic Waste": "♻️",
    "E-Waste": "📱",
    "Glass Waste": "🍾",
    "Metal Waste": "🔧",
    "Paper & Cardboard": "📦",
    "Battery Waste": "🔋",
  };

  return (
    <div className="recycle-page">
      {/* Hero Section */}
      <section className="recycle-hero">
        <div className="hero-content">
          <h1 className="hero-title">Recycle & Earn Money</h1>
          <p className="hero-subtitle">
            Turn your waste into cash! Submit recyclable items to nearby
            franchisees and earn money for contributing to a cleaner
            environment.
          </p>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">{wasteTypes.length}</span>
              <span className="stat-label">Waste Types</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{franchisees.length}</span>
              <span className="stat-label">Nearby Centers</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">₹</span>
              <span className="stat-label">Earn Cash</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <h2 className="section-title">How It Works</h2>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3>Choose Waste Type</h3>
            <p>Select from our list of recyclable materials</p>
          </div>
          <div className="step-card">
            <div className="step-number">2</div>
            <h3>Find Franchisee</h3>
            <p>Pick a nearby collection center</p>
          </div>
          <div className="step-card">
            <div className="step-number">3</div>
            <h3>Submit Request</h3>
            <p>Fill in the details and submit</p>
          </div>
          <div className="step-card">
            <div className="step-number">4</div>
            <h3>Get Paid</h3>
            <p>Receive payment after approval</p>
          </div>
        </div>
      </section>

      {/* Waste Types Section */}
      <section className="waste-types-section">
        <h2 className="section-title">What Can You Recycle?</h2>
        <p className="section-subtitle">
          Click on a waste type to start your submission
        </p>

        <div className="waste-types-grid">
          {wasteTypes.map((type) => (
            <div
              key={type._id}
              className={`waste-type-card ${
                selectedWasteType?._id === type._id ? "selected" : ""
              }`}
              onClick={() => handleWasteTypeSelect(type)}
            >
              <div className="waste-icon">{wasteIcons[type.name] || "♻️"}</div>
              <h3 className="waste-name">{type.name}</h3>
              <p className="waste-description">{type.description}</p>
              <div className="waste-price">
                <span className="price-label">Earn</span>
                <span className="price-value">₹{type.pricePerKg}/kg</span>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* Vendor Events Near You */}
      <section className="vendor-events-section">
        <h2 className="section-title">Vendor Collection Events Near You</h2>
        <p className="section-subtitle">
          {vendorEvents.length > 0
            ? `${vendorEvents.length} collection events within 2 km radius`
            : "No collection events happening near you right now."}
        </p>

        {vendorEvents.length > 0 ? (
          <div className="vendor-events-grid">
            {vendorEvents.map((ev) => (
              <div key={ev._id} className="vendor-event-card">
                <h3 className="vendor-event-title">{ev.title}</h3>

                <div className="vendor-event-details">
                  <div className="detail-row">
                    <span className="detail-icon">📍</span>
                    <span>
                      {" "}
                      <a
                        href={`https://www.google.com/maps?q=${ev.location.coordinates[1]},${ev.location.coordinates[0]}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                      {ev.location.address || "Nearby Area"}
                      </a>
                    </span>
                  </div>

                  <div className="detail-row">
                    <span className="detail-icon">🗓️</span>
                    <span>{new Date(ev.date).toLocaleString()}</span>
                  </div>

                  <div className="detail-row">
                    <span className="detail-icon">♻️</span>
                    <span>Collecting: {ev.wasteTypes.join(", ")}</span>
                  </div>

                  <div className="detail-row">
                    <span className="detail-icon">🚛</span>
                    <span>Vendor: {ev.vendorName}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>❌ No vendor collection events nearby.</p>
          </div>
        )}
      </section>

      {/* Nearby Franchisees */}
      <section className="franchisees-section">
        <h2 className="section-title">Collection Centers Near You</h2>
        <p className="section-subtitle">
          {franchisees.length > 0
            ? `${franchisees.length} centers within 25km radius`
            : "Finding nearby centers..."}
        </p>

        {franchisees.length > 0 ? (
          <div className="franchisees-grid">
            {franchisees.map((f) => (
              <div key={f._id} className="franchisee-card">
                <div className="franchisee-header">
                  <h3 className="franchisee-name">{f.centerName}</h3>
                  <span className="franchisee-badge">Active</span>
                </div>
                <div className="franchisee-details">
                  <div className="detail-row">
                    <span className="detail-icon">📍</span>
                    <span>{f.address || f.pincode}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-icon">📮</span>
                    <span>Pincode: {f.pincode}</span>
                  </div>
                  {f.contactNumber && (
                    <div className="detail-row">
                      <span className="detail-icon">📞</span>
                      <span>{f.contactNumber}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>🔍 Searching for collection centers near you...</p>
            <small>Make sure location access is enabled</small>
          </div>
        )}
      </section>

      {/* Submit Form */}
      <section className="submit-form-section" id="submit-form">
        <div className="recycle-card">
          <h2 className="recycle-title">Submit Your Recycle Request</h2>
          <p className="recycle-subtitle">
            Fill in the details below to submit your recyclable items
          </p>

          <form className="recycle-form" onSubmit={handleSubmit}>
            {/* Waste Type */}
            <div className="form__group">
              <label className="form__label">Waste Type *</label>
              <select
                className="form__input"
                name="wasteTypeId"
                value={formData.wasteTypeId}
                onChange={handleChange}
                required
              >
                <option value="">Select waste type</option>
                {wasteTypes.map((type) => (
                  <option key={type._id} value={type._id}>
                    {type.name} — ₹{type.pricePerKg}/kg
                  </option>
                ))}
              </select>
            </div>

            {/* Franchisee */}
            <div className="form__group">
              <label className="form__label">Choose Collection Center *</label>
              <select
                className="form__input"
                name="franchiseeId"
                value={formData.franchiseeId}
                onChange={handleChange}
                required
              >
                <option value="">Select franchisee</option>
                {franchisees.map((f) => (
                  <option key={f._id} value={f._id}>
                    {f.centerName} — {f.pincode}
                  </option>
                ))}
              </select>
            </div>

            {/* Item Name */}
            <div className="form__group">
              <label className="form__label">Item Name *</label>
              <input
                type="text"
                name="itemName"
                className="form__input"
                placeholder="Example: PET Bottles, Old Newspapers"
                value={formData.itemName}
                onChange={handleChange}
                required
              />
            </div>

            {/* Item Description */}
            <div className="form__group">
              <label className="form__label">Description (optional)</label>
              <textarea
                name="itemDescription"
                className="form__textarea"
                placeholder="Provide additional details about the items..."
                value={formData.itemDescription}
                onChange={handleChange}
              />
            </div>

            {/* Weight */}
            <div className="form__group">
              <label className="form__label">Estimated Weight (kg)</label>
              <input
                type="number"
                name="weightKg"
                className="form__input"
                placeholder="1.5"
                step="0.1"
                min="0.1"
                value={formData.weightKg}
                onChange={handleChange}
              />
              {formData.weightKg && formData.wasteTypeId && (
                <div className="estimated-earning">
                  <span>Estimated Earning: </span>
                  <strong>
                    ₹
                    {(
                      parseFloat(formData.weightKg) *
                      (wasteTypes.find((t) => t._id === formData.wasteTypeId)
                        ?.pricePerKg || 0)
                    ).toFixed(2)}
                  </strong>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              className="btn btn--primary"
              type="submit"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Request"}
            </button>
          </form>

          {/* Notification */}
          {message && (
            <div className={`form__message form__message--${message.type}`}>
              {message.text}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Recycle;
