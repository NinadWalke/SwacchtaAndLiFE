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
      min: 0.1
    },
    estimatedAmount: {
      type: Number,
      required: true,
    },
    franchisee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Franchisee",
      default: null // assigned later
    },
    status: {
      type: String,
      enum: ["pending", "approved", "collected", "verified", "paid", "rejected"],
      default: "pending",
    },
    images: [
      {
        type: String, // Cloudinary URLs
      }
    ],
    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WasteSubmission", wasteSubmissionSchema);
