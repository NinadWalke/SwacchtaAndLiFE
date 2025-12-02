const Event = require("../schemas/Event");
const geocodeAddress = require("../utils/mapboxConfig");

// Get all events
exports.getAllEvents = async (req, res) => {
  const events = await Event.find({});
  return res.json(events);
};

// Create a new event
exports.createEvent = async (req, res) => {
  try {
    const {
      eventName,
      eventHostedBy,
      eventDescription,
      eventDateTime,
      eventLocation,
    } = req.body;    
    const {eventType, } = req.body;


    // Geocode the address
    const loc = await geocodeAddress(eventLocation);

    // Create event
    const newEvent = new Event({
      eventName,
      eventHostedBy,
      eventDescription,
      eventDateTime,
      eventLocation,
      eventLocationData: {
        type: "Point",
        coordinates: [loc.longitude, loc.latitude],
        address: loc.placeName,
      },
    });

    await newEvent.save();

    return res.status(201).json({
      message: "Event created successfully!",
      event: newEvent,
    });
  } catch (e) {
    return res.status(500).json({
      message: "Unable to create event. Please try again later.",
    });
  }
};

// Get single event by ID
exports.getEventById = async (req, res) => {
  const { id } = req.params;

  const currEvent = await Event.findById(id);
  if (!currEvent) {
    return res.status(404).json({ message: "Event not found!" });
  }

  return res.status(200).json(currEvent);
};

// Register the logged-in user for an event
exports.registerForEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Add user if not already registered
    if (!event.registeredUsers.includes(userId)) {
      event.registeredUsers.push(userId);
      await event.save();
    }

    return res.json({ message: "Registered successfully", event });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Placeholder for future event updates
exports.updateEvent = async (req, res) => {
  return res.json({ message: "Event update endpoint not implemented yet" });
};

// Unregister user from event
exports.unregisterFromEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const index = event.registeredUsers.indexOf(userId);

    // Remove user from list if present
    if (index > -1) {
      event.registeredUsers.splice(index, 1);
      await event.save();
    }

    return res.json({ message: "Unregistered successfully", event });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
