const mongoose = require("mongoose");

const VendorSettlementSchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },

    franchiseeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Franchisee",
      required: true,
    },

    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VendorEvent",
      required: true, // which collection event was completed
    },

    totalWeightKg: {
      type: Number,
      required: true,
    },

    amountPaidToVendor: {
      type: Number,
      required: true,
    },

    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("VendorSettlement", VendorSettlementSchema);
