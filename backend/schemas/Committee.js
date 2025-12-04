const mongoose = require("mongoose");
const bcrypt = require('bcrypt');


const committeeSchema = new mongoose.Schema(
  {
    // ---------------------------
    // Committee basic info
    // ---------------------------
    committeeName: {
      type: String,
      required: [true, "Committee name is required"],
      unique: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    localityType: {
      type: String,
      enum: ["Society", "Colony", "Village", "Apartment", "Commercial Area", "Other"],
      default: "Society",
    },

    approxHouseholds: {
      type: Number,
      default: 0,
    },

    // ---------------------------
    // Green Leader (primary contact)
    // ---------------------------
    leaderName: {
      type: String,
      required: [true, "Leader name is required"],
      trim: true,
    },

    leaderEmail: {
      type: String,
      required: [true, "Leader email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },

    leaderPhone: {
      type: String,
      required: [true, "Leader phone is required"],
      trim: true,
    },

    alternatePhone: {
      type: String,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },

    // ---------------------------
    // Address (filled by leader)
    // ---------------------------
    address: {
      line1: {
        type: String,
        required: [true, "Address line 1 is required"],
        trim: true,
      },
      line2: {
        type: String,
        trim: true,
      },
      area: {
        type: String,
        required: [true, "Area / locality is required"],
        trim: true,
      },
      city: {
        type: String,
        required: [true, "City is required"],
        trim: true,
      },
      district: {
        type: String,
        trim: true,
      },
      state: {
        type: String,
        required: [true, "State is required"],
        trim: true,
      },
      pincode: {
        type: String,
        required: [true, "Pincode is required"],
        trim: true,
      },
      landmark: {
        type: String,
        trim: true,
      },
    },
    committeeLocation: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [0, 0], // will be replaced after geocoding
        required: true,
      },
      address: {
        type: String,
        trim: true,
      },
      committeeActive: {
        type: Boolean,
        default: true,
        required: true,
      },
    },
    // ---------------------------
    // Members (after approval)
    // ---------------------------
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // ---------------------------
    // Status & KYC (handled by officials)
    // ---------------------------
    committeeStatus: {
      type: String,
      enum: ["PENDING", "UNDER_PROCESS", "APPROVED", "REJECTED"],
      default: "PENDING",
    },

    isKycVerified: {
      type: Boolean,
      default: false,
    },

    kycRemarks: {
      type: String,
      trim: true,
    },

    isCommitteeVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);


committeeSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

committeeSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

committeeSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const Committee = new mongoose.model("Committee", committeeSchema);

module.exports = Committee;
