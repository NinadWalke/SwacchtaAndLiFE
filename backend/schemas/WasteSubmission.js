const mongoose = require("mongoose");

const wasteSubmissionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    wasteType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WasteType",
      required: true,
    },
    weightKg: {
      type: Number,
      required: true,
      min: 0.1,
    },
    estimatedAmount: {
      type: Number,
      required: true,
    },
    franchisee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Franchisee",
      default: null, // assigned later
    },
    status: {
      type: String,
      enum: [
        "pending",
        "approved",
        "vendor-assigned",
        "collected",
        "verified",
        "paid",
        "rejected",
      ],
      default: "pending",
    },
    images: [
      {
        type: String, // Cloudinary URLs
      },
    ],
    notes: {
      type: String,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      default: null,
    },

    pickupMethod: {
      type: String,
      enum: ["self", "vendor"],
      default: "self",
    },

    finalAmount: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WasteSubmission", wasteSubmissionSchema);
