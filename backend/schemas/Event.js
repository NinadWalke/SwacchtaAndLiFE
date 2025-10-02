const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  eventName: {
    type: String,
    required: true 
  },
  eventHostedBy: {
    type: String,
    required: true 
  },
  eventDescription: {
    type: String,
    required: true 
  },
  eventDateTime: {
    type: Date,
    default: Date.now,
    required: true
  },
  eventLocation: {
    type: String,
    required: true
  }
}, { timestamps: true });

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
