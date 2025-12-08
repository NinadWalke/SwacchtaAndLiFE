const mongoose = require("mongoose");

const franchiseeSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    centerName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      match: /^[6-9]\d{9}$/,
    },
    address: {
      type: String,
      required: true,
    },
    pincode: {
      type: String,
      required: true,
    },
    serviceablePincodes: {
      type: [String],
      default: []
    },

    // GeoJSON location field (same structure as reports/events)
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point"
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true
      }
    },

    isActive: {
      type: Boolean,
      default: true
    },

    totalCollectedKg: {
      type: Number,
      default: 0
    },

    balance: {
      type: Number,
      default: 0
    },
    acceptedWasteTypes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "WasteType"
}]

  },
  { timestamps: true }
);

// Create a geospatial index for map queries
franchiseeSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Franchisee", franchiseeSchema);
