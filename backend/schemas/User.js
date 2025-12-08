const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const cartItemSchema = new mongoose.Schema({
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
  description: {
    type: String
  },
  img: {
    type: String
  },
  category: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  }
});

const userSchema = new mongoose.Schema(
  {
    googleId: { type: String, unique: true, sparse: true },
    fname: {
      type: String,
      trim: true,
    },
    lname: {
      type: String,
      trim: true,
    },
    dob: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    address: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [
        /^[6-9]\d{9}$/,
        "Please enter a valid 10-digit Indian phone number",
      ],
    },
    aadhar: {
      type: String,
      required: true,
      unique: true,
      minlength: 12,
      maxlength: 12,
    },
    role: {
      type: String,
      enum: ["user", "admin", "official", "osp", "vendor"],
      default: "user",
    },
    profileImg: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    reports: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Report",
      },
    ],
    points: {
      type: Number,
      default: 0
    },
    otp: {
      type: String,
    },
    otpExpires: {
      type: Date,
    },
    isOtpVerified: {
      type: Boolean,
      default: false,
    },
    committee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Committee"
    },
    greencoins: {
      type: Number,
      required: true,
      default: 0
    },
    cart: {
      type: [cartItemSchema],
      default: []
    },
    isOnDuty: { type: Boolean, default: false }
  },
  { timestamps: true }
);

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

module.exports = User;
