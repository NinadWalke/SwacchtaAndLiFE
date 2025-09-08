const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  reportImg: {
    type: String, 
    required: true,
  },
  reportYoloImg: {
    type: String,
  },
  location: {
    type: String, 
    required: true,
  },
  time: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["pending", "alloted", "resolved"],
    default: "pending",
  },
  reportOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: true,
  },
}, { timestamps: true });

const Report = mongoose.model("Report", reportSchema);

module.exports = Report;
