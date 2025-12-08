const mongoose = require("mongoose");

const wasteTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    enum: [
      "Plastic Waste",
      "E-Waste",
      "Glass Waste",
      "Metal Waste",
      "Paper & Cardboard",
      "Battery Waste"
    ]
  },
  description: { type: String },
  pricePerKg: { type: Number, required: true } // amount user earns
}, { timestamps: true });

module.exports = mongoose.model("WasteType", wasteTypeSchema);
