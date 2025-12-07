import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Event.css";
import api from "../../../utils/axiosConfig";
import { useAuth } from "../../../components/AuthContext";

function Event() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const getEvents = async () => {
      try {
        const res = await api.get("/events");
        const allEvents = res.data;
        allEvents.sort(
          (e1, e2) => new Date(e1.eventDateTime) - new Date(e2.eventDateTime)
        );
        setEvents(allEvents);
        console.log("Fetched events:", allEvents);
      } catch (e) {
        console.error("Error fetching events:", e);
        alert("Failed to load events.");
      } finally {
        setLoading(false);
      }
    };
    getEvents();
  }, []);

  const handleSignUp = async (id, e) => {
    // stop propagation if event passed (button click)
    if (e && e.stopPropagation) e.stopPropagation();

    try {
      const res = await api.post(`/events/${id}`);
      const updatedEvent = res.data.event || res.data;
      setEvents((prevEvents) =>
        prevEvents.map((ev) => (ev._id === updatedEvent._id ? updatedEvent : ev))
      );
    } catch (err) {
      console.error("Sign up error:", err);
      alert("Failed to register. Please try again.");
    }
  };

  const handleUnregister = async (id, e) => {
    if (e && e.stopPropagation) e.stopPropagation();

    try {
      const res = await api.post(`/events/${id}/unregister`);
      const updatedEvent = res.data.event || res.data;
      setEvents((prevEvents) =>
        prevEvents.map((ev) => (ev._id === updatedEvent._id ? updatedEvent : ev))
      );
    } catch (err) {
      console.error("Unregister error:", err);
      alert("Failed to unregister. Please try again.");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const time = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    return { day, month, time };
  };

  return (
    <main className="events-page">
      <header className="events-page__header">
        <h1 className="events-page__title">Events</h1>
        <p className="events-page__subtitle">
          Join fellow citizens in making our community cleaner and greener. Find
          a local event and sign up today!
        </p>
      </header>

      <div className="events-page__container">
        {loading ? (
          <div className="loading-state">Loading events...</div>
        ) : events.length > 0 ? (
          <div className="events-grid">
            {events.map((event) => {
              const { day, month, time } = formatDate(event.eventDateTime);
              const isRegistered =
                user && event?.registrations && event?.registrations.includes(user._id);

              return (
                <div
                  key={event._id}
                  className="event-card"
                  onClick={() => navigate(`/events/${event._id}`)}
                >
                  <div className="event-card__image-container">
                    <div className="event-card__date">
                      <span className="date__day">{day}</span>
                      <span className="date__month">{month}</span>
                    </div>
                  </div>

                  <div className="event-card__content">
                    <h2 className="event-card__title">{event.eventName}</h2>
                    <div className="event-card__meta">
                      <span className="meta__item">
                        📍{" "}
                        {event?.eventLocationData?.coordinates?.length === 2 ? (
                          <Link
                            href={`https://www.google.com/maps?q=${event.eventLocationData.coordinates[1]},${event.eventLocationData.coordinates[0]}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()} // prevent card navigation
                            style={{}}
                          >
                            {event.eventLocation}
                          </Link>
                        ) : (
                          event.eventLocation || "Location not available"
                        )}
                      </span>

                      <span className="meta__item">
                        👤 Hosted by: {event.eventHostedBy}
                      </span>
                      <span className="meta__item">🕒 {time}</span>
                    </div>
                    <p className="event-card__description">
                      {event.eventDescription}
                    </p>
                  </div>

                  <div className="event-card__footer">
                    <span className="footer__attendees text-center me-3">
                      {event?.registrations.length} Registered
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            There are no upcoming events at the moment. Please check back later!
          </div>
        )}
      </div>
    </main>
  );
}

export default Event;
