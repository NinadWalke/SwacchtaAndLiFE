import React, { useEffect, useState } from 'react';
import './Event.css';
import api from '../../../utils/axiosConfig';

function Event() {
  const [events, setEvents] = useState([]);
  // Temporary mock events
  const [tempEvents] = useState([
    {
      id: 1,
      title: "Beach Cleanup",
      description: "Join us to clean up the local beach.",
      date: "2025-10-10",
      time: "10:00 AM",
      location: "Santa Monica Beach",
    },
    {
      id: 2,
      title: "Park Cleanup",
      description: "Help us clean the city park.",
      date: "2025-10-12",
      time: "9:00 AM",
      location: "Central Park",
    },
  ]);

  useEffect(() => {
    const getEvents = async () => {
      const res = await api.get('/events');
      console.log(res.data);
    }
    getEvents();
  }, []);

  const handleSignUp = (id) => {
    alert(`You signed up for event ID: ${id}`);
    // You can replace this alert with your backend API call
  };

  return (
    <div className="event-container">
      <h1 className="event-title">Upcoming Events</h1>
      <div className="event-list">
        {tempEvents.map((event) => (
          <div key={event.id} className="event-card">
            <h2>{event.title}</h2>
            <p>{event.description}</p>
            <p>
              <strong>Date:</strong> {event.date} | <strong>Time:</strong> {event.time}
            </p>
            <p>
              <strong>Location:</strong> {event.location}
            </p>
            <button onClick={() => handleSignUp(event.id)}>Sign Up</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Event;
