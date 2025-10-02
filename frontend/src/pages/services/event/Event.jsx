import React, { useEffect, useState } from "react";
import "./Event.css";
import api from "../../../utils/axiosConfig";
import { useAuth } from "../../../components/AuthContext";

function Event() {
  const [events, setEvents] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const getEvents = async () => {
      try {
        const res = await api.get("/events");
        setEvents(res.data);
      } catch (e) {
        alert(e.message);
      }
    };
    getEvents();
  }, []);

  const handleSignUp = async (id) => {
    try {
      const res = await api.post(`/events/${id}`);
      const updatedEvent = res.data.event;
      setEvents((prevEvents) =>
        prevEvents.map((e) => (e._id === updatedEvent._id ? updatedEvent : e))
      );
    } catch (e) {
      console.log("Error: " + e.message);
    }
  };
  const handleUnregister = async (id) => {
    try {
      const res = await api.post(`/events/${id}/unregister`);
      const updatedEvent = res.data.event;
      setEvents((prevEvents) =>
        prevEvents.map((e) => (e._id === updatedEvent._id ? updatedEvent : e))
      );
    } catch (e) {
      console.log("Error: " + e.message);
    }
  };

  return (
    <div className="event-container">
      <h1 className="event-title">Upcoming Events</h1>
      <div className="event-list">
        {events.map((event) => (
          <div key={event._id} className="event-card">
            <h2>{event.eventName}</h2>
            <h6>
              <strong>Hosted by: </strong>
              {event.eventHostedBy}
            </h6>
            <p>{event.eventDescription}</p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(event.eventDateTime).toLocaleString()}
            </p>
            <p>
              <strong>Location:</strong> {event.eventLocation}
            </p>
            <p>
              <strong>Registered Users: </strong> {event.registeredUsers.length}
            </p>
            <div className="text-center">
              {event.registeredUsers.includes(user._id) ? (
                <button
                  className="event-signup-btn"
                  onClick={() => handleUnregister(event._id)}
                >
                  Unregister
                </button>
              ) : (
                <button
                  className="event-signup-btn"
                  onClick={() => handleSignUp(event._id)}
                >
                  Sign Up
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Event;
