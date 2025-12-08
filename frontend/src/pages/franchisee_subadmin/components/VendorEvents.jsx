import React, { useState } from "react";
import api from "../../../utils/axiosConfig";
import "./VendorEvents.css";

function VendorEvents() {
  const [form, setForm] = useState({
    vendorEmail: "",
    title: "",
    description: "",
    wasteTypes: "",
    date: "",
    address: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      vendorEmail: form.vendorEmail,
      title: form.title,
      description: form.description,
      wasteTypes: form.wasteTypes.split(",").map((w) => w.trim()),
      date: form.date,
      address: form.address,
    };

    const res = await api.post("/waste-submission/vendor/events", payload);

    alert("Vendor Event Created Successfully!");

    setForm({
      vendorEmail: "",
      title: "",
      description: "",
      wasteTypes: "",
      date: "",
      address: "",
    });
  };

  return (
    <div className="vendor-events-container">
      <h2>Create Vendor Event</h2>

      <form className="vendor-event-form" onSubmit={handleSubmit}>
        
        <label>Vendor Email</label>
        <input
          type="email"
          name="vendorEmail"
          value={form.vendorEmail}
          onChange={handleChange}
          required
        />

        <label>Event Title</label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <label>Description (Optional)</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
        />

        <label>Waste Types (comma separated)</label>
        <input
          type="text"
          name="wasteTypes"
          placeholder="Plastic, Metal, E-Waste"
          value={form.wasteTypes}
          onChange={handleChange}
          required
        />

        <label>Event Date & Time</label>
        <input
          type="datetime-local"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
        />

        <label>Event Address</label>
        <input
          type="text"
          name="address"
          placeholder="Full address to geocode"
          value={form.address}
          onChange={handleChange}
          required
        />

        <button className="btn btn--primary" type="submit">
          Create Event
        </button>
      </form>
    </div>
  );
}

export default VendorEvents;
