import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./EventForm.css";
import api from "../../../utils/axiosConfig";

function EventForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    eventName: "",
    eventHostedBy: "",
    eventDescription: "",
    eventDateTime: "",
    eventLocation: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null); // For success/error messages

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    try {
      const res = await api.post("/events", formData);
      setMessage({ type: 'success', text: res.data.message });
      // Redirect after a short delay to allow the user to see the success message
      setTimeout(() => {
        navigate('/events'); // Navigate to the events page on success
      }, 2000);
    } catch (e) {
      setMessage({ type: 'error', text: e.response?.data?.message || 'An error occurred.' });
      setIsSubmitting(false);
    }
    // 'finally' block is removed to control submission state more precisely
  };

  // Set min attribute for date/time input to prevent past dates
  // Based on current time: Oct 12, 2025, 11:00 PM IST
  const minDateTime = "2025-10-12T23:00";

  return (
    <main className="event-form-page">
      <div className="event-form-card">
        <header className="event-form__header">
          <h1 className="event-form__title">Create a New Event</h1>
        </header>

        <form className="event-form" onSubmit={handleSubmit}>
          <div className="form__group">
            <label className="form__label" htmlFor="eventName">Event Name</label>
            <input className="form__input" type="text" id="eventName" name="eventName" placeholder="e.g., Thane Creek Flamingo Watch" value={formData.eventName} onChange={handleChange} required />
          </div>

          <div className="form__group">
            <label className="form__label" htmlFor="eventHostedBy">Hosted By</label>
            <input className="form__input" type="text" id="eventHostedBy" name="eventHostedBy" placeholder="e.g., Thane Municipal Corporation" value={formData.eventHostedBy} onChange={handleChange} required />
          </div>

          <div className="form__group">
            <label className="form__label" htmlFor="eventDescription">Description</label>
            <textarea className="form__textarea" id="eventDescription" name="eventDescription" placeholder="Describe the event's goals, activities, etc." value={formData.eventDescription} onChange={handleChange} required />
          </div>

          <div className="form__group">
            <label className="form__label" htmlFor="eventDateTime">Date & Time</label>
            <input className="form__input" type="datetime-local" id="eventDateTime" name="eventDateTime" value={formData.eventDateTime} onChange={handleChange} min={minDateTime} required />
          </div>

          <div className="form__group">
            <label className="form__label" htmlFor="eventLocation">Location</label>
            <input className="form__input" type="text" id="eventLocation" name="eventLocation" placeholder="e.g., Thane Creek Flamingo Sanctuary" value={formData.eventLocation} onChange={handleChange} required />
          </div>
          
          <button type="submit" className="btn btn--primary" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Event'}
          </button>
        </form>
        
        {message && (
          <div className={`form__message form__message--${message.type}`}>
            {message.text}
          </div>
        )}
      </div>
    </main>
  );
}

export default EventForm;