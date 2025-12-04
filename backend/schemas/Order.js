const mongoose = require("mongoose");

// Schema for individual items inside an order
const orderItemSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,  
    required: true
  },
  description: String,
  img: String,
  category: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  }
});

// Main Order Schema
const orderSchema = new mongoose.Schema(
  {
    items: {
      type: [orderItemSchema],
      required: true,
      default: []
    },

    orderedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },

    totalAmount: {
      type: Number,
      required: true
    },

    orderStatus: {
      type: String,
      enum: ["pending", "created", "paid", "processing", "shipped", "delivered", "cancelled"],
      default: "pending"
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "failed", "paid"],
      default: "pending"
    },

    paymentMethod: {
      type: String,
      enum: ["razorpay", "cod"],
      default: "razorpay"
    },
    shippingAddress: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true 
  }
);

module.exports = mongoose.model("Order", orderSchema);
