const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    eventName: {
      type: String,
      required: true,
    },
    eventHostedBy: {
      type: String,
      required: true,
    },
    eventDescription: {
      type: String,
      required: true,
    },
    registrations: [
      { type: mongoose.Schema.Types.ObjectId, ref: "EventRegistration" },
    ],
    eventDateTime: {
      type: Date,
      default: Date.now,
      required: true,
    },
    eventLocation: {
      type: String,
      required: true,
    },
    eventLocationData: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
      address: {
        type: String,
      },
      eventActive: {
        type: Boolean,
        default: true,
        required: true,
      },
    },
  },
  { timestamps: true }
);

// enables search queries for distance related metrics easing up van dispatch, heatmaps, nearby events, etc.
eventSchema.index({ eventLocationData: "2dsphere" });

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
