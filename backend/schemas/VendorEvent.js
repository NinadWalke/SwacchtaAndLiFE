const mongoose = require("mongoose");

const VendorEventSchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor", 
      required: true,
    },

    vendorName: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    wasteTypes: {
      type: [String], // e.g. ["plastic", "paper"]
      required: true,
    },

    // location field REQUIRED for geospatial queries
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: true,
      },
      address: String, // optional
      areaName: String, // optional display name
    },

    date: {
      type: Date,
      required: true, // When vendor comes to collect waste
    },

    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed", "cancelled"],
      default: "upcoming",
    },
    franchiseeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Franchisee",
    },
  },
  { timestamps: true }
);

// Geospatial index for "near me" queries
VendorEventSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("VendorEvent", VendorEventSchema);
