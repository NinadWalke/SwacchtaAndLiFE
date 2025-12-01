const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");

// Controllers
const {
  getAllEvents,
  createEvent,
  getEventById,
  registerForEvent,
  updateEvent,
  unregisterFromEvent,
} = require("../controllers/events.controller");

// Get all events
router.get("/", wrapAsync(getAllEvents));

// Create a new event
router.post("/", wrapAsync(createEvent));

// Get event by ID
router.get("/:id", wrapAsync(getEventById));

// Register user for event
router.post("/:id", wrapAsync(registerForEvent));

// Update event (currently empty in original code, but route preserved)
router.put("/:id", wrapAsync(updateEvent));

// Unregister user from event
router.post("/:id/unregister", wrapAsync(unregisterFromEvent));

module.exports = router;
