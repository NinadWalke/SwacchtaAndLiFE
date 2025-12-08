const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    reportImg: {
      type: String,
      required: true,
    },
    reportYoloImg: {
      type: String,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    remarks: {
      type: String,
      default: "NA",
    },
    time: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["pending", "allotted", "resolved"],
      default: "pending",
    },
    reportOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

reportSchema.index({ location: "2dsphere" });

const Report = mongoose.model("Report", reportSchema);


module.exports = Report;
