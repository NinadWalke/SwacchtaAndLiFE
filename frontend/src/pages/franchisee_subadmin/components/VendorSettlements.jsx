import React, { useState, useEffect } from "react";
import "./VendorSettlements.css";
import api from "../../../utils/axiosConfig";

function VendorSettlements() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    eventId: "",
    totalWeightKg: "",
    amountPaidToVendor: "",
    notes: "",
  });

  useEffect(() => {
    // get vendor events assigned to this franchisee
    const loadEvents = async () => {
      const res = await api.get("/waste-submission/vendor/events/all"); // or filter by franchisee
      setEvents(res.data.events);
    };
    loadEvents();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await api.post("/waste-submission/vendor/settlement", {
      eventId: form.eventId,
      totalWeightKg: form.totalWeightKg,
      amountPaidToVendor: form.amountPaidToVendor,
      notes: form.notes,
    });

    alert("Settlement recorded successfully!");
    setForm({
      eventId: "",
      vendorId: "",
      franchiseeId: form.franchiseeId,
      totalWeightKg: "",
      amountPaidToVendor: "",
      notes: "",
    });
    window.location.reload();
  };

  return (
    <div className="settlements-container">
      <h3>Record Vendor Settlement</h3>

      <form onSubmit={handleSubmit} className="settlement-form">
        <label>Vendor Event</label>
        <select name="eventId" onChange={handleChange} required>
          <option value="">Select event</option>
          {events.map((ev) => (
            <option key={ev._id} value={ev._id}>
              {ev.title} — {new Date(ev.date).toLocaleString()}
            </option>
          ))}
        </select>

        <label>Total Weight Collected (kg)</label>
        <input
          type="number"
          name="totalWeightKg"
          value={form.totalWeightKg}
          onChange={handleChange}
          required
        />

        <label>Amount Paid to Vendor (₹)</label>
        <input
          type="number"
          name="amountPaidToVendor"
          value={form.amountPaidToVendor}
          onChange={handleChange}
          required
        />

        <label>Notes (optional)</label>
        <textarea name="notes" value={form.notes} onChange={handleChange} />

        <button type="submit" className="btn btn--primary">
          Submit Settlement
        </button>
      </form>
    </div>
  );
}

export default VendorSettlements;
