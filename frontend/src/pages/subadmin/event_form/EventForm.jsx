import React, { useState } from "react";
import "./EventForm.css";
import api from "../../../utils/axiosConfig";

function EventForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    eventName: "",
    eventHostedBy: "",
    eventDescription: "",
    eventDateTime: "",
    eventLocation: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/events", formData);
      alert(res.data.message);
    } catch (e) {
      alert(e.message);
    } finally {
      window.location.reload();
    }
  };

  return (
    <div className="event-form-container">
      <form className="event-form" onSubmit={handleSubmit}>
        <h2 className="event-form-title">Create Event</h2>

        <label htmlFor="eventName">Event Name</label>
        <input
          type="text"
          id="eventName"
          name="eventName"
          placeholder="Enter event name"
          value={formData.eventName}
          onChange={handleChange}
          required
        />

        <label htmlFor="eventHostedBy">Hosted By</label>
        <input
          type="text"
          id="eventHostedBy"
          name="eventHostedBy"
          placeholder="Who is hosting?"
          value={formData.eventHostedBy}
          onChange={handleChange}
          required
        />

        <label htmlFor="eventDescription">Description</label>
        <textarea
          id="eventDescription"
          name="eventDescription"
          placeholder="Describe your event..."
          rows="4"
          value={formData.eventDescription}
          onChange={handleChange}
          required
        />
        <label htmlFor="eventDateTime">Date & Time</label>
        <input
          type="datetime-local"
          id="eventDateTime"
          name="eventDateTime"
          value={formData.eventDateTime}
          onChange={handleChange}
          required
        />
        <label htmlFor="eventLocation">Location</label>
        <input
          type="text"
          id="eventLocation"
          name="eventLocation"
          placeholder="Where will it happen?"
          value={formData.eventLocation}
          onChange={handleChange}
          required
        />

        <button type="submit" className="event-form-btn">
          Create Event
        </button>
      </form>
    </div>
  );
}

export default EventForm;
