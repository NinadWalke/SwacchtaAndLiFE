const Event = require("../schemas/Event");
const EventRegistration = require("../schemas/EventRegistration");
const geocodeAddress = require("../utils/mapboxConfig");

const { sendEmail } = require("../utils/emails");
const { sendSMS } = require("../utils/twilio");

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
    const { eventType } = req.body;

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

  const currEvent = await Event.findById(id).populate("registrations");
  if (!currEvent) {
    return res.status(404).json({ message: "Event not found!" });
  }

  return res.status(200).json(currEvent);
};

// Register the logged-in user for an event
exports.registerForEvent = async (req, res) => {
  try {
    const { id: eventId } = req.params;
    const userId = req.user._id;

    const { participants, experience, notes } = req.body;

    // 1. Find event
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // 2. Check if user already registered
    const existing = await EventRegistration.findOne({
      event: eventId,
      user: userId,
    });
    if (existing) {
      return res
        .status(400)
        .json({ message: "You are already registered for this event." });
    }

    // 3. Create a new registration entry
    const registration = await EventRegistration.create({
      event: eventId,
      user: userId,
      participants: participants ? Number(participants) : 1,
      experience: experience || "",
      notes: notes || "",
    });

    // 4. Add registration ID to event.registrations
    event.registrations.push(registration._id);
    await event.save();

    // 5. Email & SMS Notification
    const userName = req.user.name;
    const userEmail = req.user.email;
    const userPhone = req.user.phone;

    const emailHTML = `
      <h2>Event Registration Confirmed</h2>
      <p>Hi <strong>${userName}</strong>,</p>
      <p>You have successfully registered for the event:</p>

      <p><strong>${event.eventName}</strong></p>
      <p><strong>Location:</strong> ${event.eventLocation}</p>
      <p><strong>Date & Time:</strong> ${event.eventDateTime}</p>

      <h3>Your Registration Details</h3>
      <p><strong>Participants:</strong> ${participants || 1}</p>
      <p><strong>Experience:</strong> ${experience || "N/A"}</p>
      <p><strong>Notes:</strong> ${notes || "None"}</p>

      <br/>
      <p>Thank you for contributing towards a cleaner community!</p>
      <p>– Aspirely Team</p>
    `;

    await sendEmail(
      userEmail,
      `You're Registered for ${event.eventName}!`,
      emailHTML
    );

    // -- Disabled SMS For now --
    // await sendSMS(
    //   userPhone,
    //   `You're registered for "${event.eventName}" at ${event.eventLocation}. Date: ${new Date(event.eventDateTime).toLocaleString()}.`
    // );

    // 6. Return populated event
    const populatedEvent = await Event.findById(eventId).populate({
      path: "registrations",
      populate: { path: "user", select: "_id name email phone" },
    });

    return res.status(201).json({
      message: "Registered successfully",
      registration,
      event: populatedEvent,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Placeholder for future event updates
exports.updateEvent = async (req, res) => {
  return res.json({ message: "Event update endpoint not implemented yet" });
};

// Mark event completed
exports.markEventCompleted = async (req, res) => {
  const { id } = req.params;
  const eventToMark = await Event.findById(id);
  eventToMark.eventActive = true;
  res.json({ message: "Event marked completed!", event: eventToMark });
};

exports.unregisterFromEvent = async (req, res) => {
  try {
    const { id: eventId } = req.params;
    const userId = req.user._id;

    // 1. Ensure event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // 2. Find registration
    const registration = await EventRegistration.findOne({
      event: eventId,
      user: userId,
    });

    if (!registration) {
      return res
        .status(400)
        .json({ message: "You are not registered for this event." });
    }

    // 3. Delete the registration document
    await EventRegistration.findByIdAndDelete(registration._id);

    // 4. Remove from event.registrations[]
    event.registrations = event.registrations.filter(
      (regId) => regId.toString() !== registration._id.toString()
    );

    await event.save();

    // 5. Email + SMS Notification on Unregister
    const userName = req.user.name;
    const userEmail = req.user.email;
    const userPhone = req.user.phone;

    const emailHTML = `
      <h2>Event Unregistration Successful</h2>
      <p>Hi <strong>${userName}</strong>,</p>
      <p>You have been successfully unregistered from:</p>

      <p><strong>${event.eventName}</strong></p>
      <p><strong>Location:</strong> ${event.eventLocation}</p>

      <br/>
      <p>If this was a mistake, you can always register again anytime.</p>
      <p>– Aspirely Team</p>
    `;

    await sendEmail(
      userEmail,
      `You Have Unregistered from ${event.eventName}`,
      emailHTML
    );
    // -- Disabled SMS For now --
    // await sendSMS(
    //   userPhone,
    //   `You have been unregistered from "${event.eventName}". If this wasn't you, please re-register.`
    // );

    // 6. Return populated event
    const populatedEvent = await Event.findById(eventId).populate({
      path: "registrations",
      populate: { path: "user", select: "_id name email phone" },
    });

    return res.json({
      message: "Unregistered successfully",
      event: populatedEvent,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
