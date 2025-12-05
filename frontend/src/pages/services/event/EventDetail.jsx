import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./EventDetail.css";
import api from "../../../utils/axiosConfig";
import { useAuth } from "../../../components/AuthContext";
import EventSignUpForm from "./EventSignUpForm";

function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [showSignUp, setShowSignUp] = useState(false);
  const [isUserSignedUp, setIsUserSignedUp] = useState(false);
  const { user } = useAuth();
  // loading states
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const checkUserSignedUp = (eventObj) => {
    return eventObj.registrations?.some(
      (reg) => reg.user === user?._id || reg.user?._id === user?._id
    );
  };
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get(`/events/${id}`);
        const isUserSignedUpCheck = checkUserSignedUp(res.data);
        setIsUserSignedUp(isUserSignedUpCheck);
        setEvent(res.data);
      } catch (err) {
        console.error(err);
        alert("Unable to load event. Please try again.");
        navigate("/events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, navigate]);

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

  const handleSignUp = async (formData) => {
    try {
      setSubmitting(true);

      // POST /events/:id
      const res = await api.post(`/events/${id}`, formData);

      const isUserSignedUpCheck = checkUserSignedUp(res.data.event);
      setIsUserSignedUp(isUserSignedUpCheck);

      // Backend returns: { message, registration, event }
      const updatedEvent = res.data.event || res.data;

      setEvent(updatedEvent);
      setShowSignUp(false);
    } catch (err) {
      console.error("Sign-up failed:", err);

      const msg =
        err.response?.data?.message || "Failed to register. Please try again.";

      alert(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUnregister = async () => {
    try {
      setSubmitting(true);

      const res = await api.post(`/events/${id}/unregister`);
      const isUserSignedUpCheck = checkUserSignedUp(res.data.event);
      setIsUserSignedUp(isUserSignedUpCheck);
      const updatedEvent = res.data.event || res.data;

      setEvent(updatedEvent);
    } catch (err) {
      console.error("Unregister failed:", err);
      const msg =
        err.response?.data?.message ||
        "Failed to unregister. Please try again.";

      alert(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="event-details-page">
        <div className="event-details__loading">Loading event...</div>
      </main>
    );
  }

  if (!event) return null;

  const { day, month, time } = formatDate(event.eventDateTime);

  return (
    <main className="event-details-page">
      <section className="event-details__hero">
        <div className="event-details__hero-image" />
        <div className="event-details__date-badge">
          <span className="date__day">{day}</span>
          <span className="date__month">{month}</span>
        </div>
      </section>

      <section className="event-details__body">
        <div className="event-details__header">
          <h1 className="event-details__title">{event.eventName}</h1>
          <p className="event-details__tagline">
            Join fellow citizens to make our community cleaner and greener.
          </p>
        </div>

        <div className="event-details__layout">
          {/* LEFT COLUMN */}
          <div className="event-details__info">
            <div className="event-details__meta">
              <div className="meta-row">
                <span className="meta-icon">📍</span>
                <span className="meta-text">
                  {event?.eventLocationData?.coordinates?.length === 2 ? (
                    <a
                      href={`https://www.google.com/maps?q=${event.eventLocationData.coordinates[1]},${event.eventLocationData.coordinates[0]}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {event.eventLocation}
                    </a>
                  ) : (
                    event.eventLocation || "Location not available"
                  )}
                </span>
              </div>

              <div className="meta-row">
                <span className="meta-icon">👤</span>
                <span className="meta-text">
                  Hosted by: {event.eventHostedBy}
                </span>
              </div>

              <div className="meta-row">
                <span className="meta-icon">🕒</span>
                <span className="meta-text">{time}</span>
              </div>
            </div>

            <div className="event-details__description">
              <h2>About this event</h2>
              <p>{event.eventDescription}</p>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <aside className="event-details__sidebar">
            <div className="event-details__card">
              <p className="event-details__stat">
                <strong>{event.registrations.length}</strong>
                Registered volunteers
              </p>

              <p className="event-details__small">
                Bring your energy and enthusiasm. Gloves and basic safety gear
                may be provided by organizers.
              </p>

              {isUserSignedUp ? (
                <button
                  className="btn btn--secondary full-width"
                  onClick={handleUnregister}
                  disabled={submitting}
                >
                  {submitting ? "Unregistering..." : "Unregister"}
                </button>
              ) : (
                <button
                  className="btn btn--primary full-width"
                  onClick={() => setShowSignUp(true)}
                  disabled={submitting}
                >
                  {submitting ? "Registering..." : "Sign Up"}
                </button>
              )}

              <button
                className="event-details__back"
                onClick={() => navigate(-1)}
              >
                ← Back to events
              </button>
            </div>
          </aside>
        </div>
      </section>

      {showSignUp && (
        <EventSignUpForm
          event={event}
          onClose={() => setShowSignUp(false)}
          onSubmit={handleSignUp}
        />
      )}
    </main>
  );
}

export default EventDetail;
