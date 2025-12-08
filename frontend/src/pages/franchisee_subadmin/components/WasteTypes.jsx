import React, { useEffect, useState } from "react";
import "./WasteTypes.css";
import api from "../../../utils/axiosConfig";

function WasteTypes() {
  const [allTypes, setAllTypes] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // New waste type form
  const [newType, setNewType] = useState({
    name: "",
    description: "",
    pricePerKg: "",
  });

  const [adding, setAdding] = useState(false);

  // Load both waste types + franchisee selections
  useEffect(() => {
    const fetchData = async () => {
      try {
        const typesRes = await api.get("/recycle/types");
        setAllTypes(typesRes.data);

        const selected = await api.get("/recycle/franchisee/waste-types");
        setSelectedTypes(selected.data.types.map((t) => t._id));
      } catch (err) {
        console.error("Failed to fetch type data:", err);
      }
    };

    fetchData();
  }, []);

  const handleToggle = (id) => {
    setSelectedTypes((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage(null);

    try {
      await api.post("/recycle/franchisee/waste-types", {
        types: selectedTypes,
      });

      setMessage({
        type: "success",
        text: "Waste types updated successfully!",
      });
    } catch (err) {
      setMessage({
        type: "error",
        text: "Unable to update waste types.",
      });
    }

    setLoading(false);
  };

  const handleAddType = async (e) => {
    e.preventDefault();
    setAdding(true);

    try {
      const res = await api.post("/recycle/types", newType);

      // Refresh list
      const updated = await api.get("/recycle/types");
      setAllTypes(updated.data);

      // Reset form
      setNewType({ name: "", description: "", pricePerKg: "" });

      setMessage({ type: "success", text: "New waste type added!" });
    } catch (err) {
      setMessage({
        type: "error",
        text: err?.response?.data?.message || "Error adding waste type.",
      });
    }

    setAdding(false);
  };

  return (
    <div className="waste-types-section">
      <h2 className="section-title">Manage Waste Types</h2>
      <p className="section-subtitle">
        Add new waste categories and configure which ones you accept.
      </p>

      {/* -------------------- ADD NEW WASTE TYPE FORM -------------------- */}
      <div className="add-type-card">
        <h3>Add New Waste Type</h3>

        <form onSubmit={handleAddType} className="add-type-form">
          <input
            type="text"
            placeholder="Waste Type Name"
            value={newType.name}
            onChange={(e) => setNewType({ ...newType, name: e.target.value })}
            required
            className="form__input"
          />

          <textarea
            placeholder="Description"
            value={newType.description}
            onChange={(e) =>
              setNewType({ ...newType, description: e.target.value })
            }
            className="form__textarea"
          />

          <input
            type="number"
            placeholder="Price Per Kg (₹)"
            value={newType.pricePerKg}
            onChange={(e) =>
              setNewType({ ...newType, pricePerKg: e.target.value })
            }
            className="form__input"
            required
          />

          <button className="btn btn--primary" disabled={adding}>
            {adding ? "Adding..." : "Add Waste Type"}
          </button>
        </form>
      </div>

      {/* Success / error message */}
      {message && (
        <div
          className={`form__message form__message--${message.type}`}
          style={{ marginTop: "1rem" }}
        >
          {message.text}
        </div>
      )}

      {/* -------------------- TYPE SELECTION CARD -------------------- */}
      <h3 className="selection-title">Waste Types You Accept</h3>

      <div className="waste-types-list">
        {allTypes.map((type) => (
          <label
            key={type._id}
            className={`waste-type-item ${
              selectedTypes.includes(type._id) ? "selected" : ""
            }`}
          >
            <input
              type="checkbox"
              checked={selectedTypes.includes(type._id)}
              onChange={() => handleToggle(type._id)}
            />

            <div className="waste-type-info">
              <span className="waste-type-name">{type.name}</span>
              <span className="waste-type-desc">
                {type.description || "No description provided"}
              </span>
            </div>

            <span className="waste-type-price">₹{type.pricePerKg}/kg</span>
          </label>
        ))}
      </div>

      <button
        className="btn btn--primary save-btn"
        disabled={loading}
        onClick={handleSave}
      >
        {loading ? "Saving..." : "Save Changes"}
      </button>

      {message && (
        <div
          className={`form__message form__message--${message.type}`}
          style={{ marginTop: "1rem" }}
        >
          {message.text}
        </div>
      )}
    </div>
  );
}

export default WasteTypes;
