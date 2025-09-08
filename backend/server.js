if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
// --- Imports ---
const express = require("express");
const mongoose = require("mongoose");
const crypto = require("crypto");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const MongoStore = require("connect-mongo");
const nodemailer = require("nodemailer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// --- Utils ---
const ExpressError = require("./utils/ExpressError.js");
const wrapAsync = require("./utils/wrapAsync.js");
const { cloudinaryConfig } = require("./utils/cloudconfig.js");
const { extractPublicId } = require("./utils/cloudinaryHelpers.js");

// --- Models ---
const User = require("./schemas/User.js");
const Report = require("./schemas/Report.js");

// --- Server settings ---
// Express setup
const port = process.env.PORT;
const app = express();

// MongoDB setup
const dbURI =
  process.env.NODE_ENV === "production"
    ? process.env.CLOUD_DB_URI
    : process.env.DB_URI;

main()
  .then(() => {
    console.log("Connection to MongoDB successful!");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB. Error: " + err.message);
  });

async function main() {
  await mongoose.connect(dbURI);
}

// Store code
const store = MongoStore.create({
  mongoUrl: dbURI,
  crypto: {
    secret: process.env.SESSION_SECRET,
  },
  touchAfter: 24 * 3600, // Interval (in seconds) between session updates    (Update information after 23 hours)
});
store.on("error", (err) => {
  console.log("ERROR in MONGO SESSION STORE", err);
});

// Session Setup
// Session Code
const sessionOptions = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  // Cookie options below
  cookie: {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Current time * No of days * no of hours in one day * no of minutes in an hour * no of seconds in a min * no of milliseconds in a second
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true, // For security purposes => Cross scripting attacks are prevented at this step
  },
  store: store,
};

//Server setup
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.PROD_LINK_REACT
        : process.env.DEV_LINK_REACT,
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());
// Google strategy here
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// --- Routes ---
// 1. Authentication, Login and Sign Up
app.get("/auth/check", async (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json({ authenticated: true, user: req.user });
  } else {
    res.status(201).json({ authenticated: false, user: null });
  }
});
app.post("/auth/send-otp", async (req, res) => {
  const {
    fname,
    lname,
    email,
    username,
    password,
    gender,
    dob,
    phone,
    aadhar,
  } = req.body;

  // Basic email validation
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: "Invalid email address provided." });
  }

  try {
    let existingUser = await User.findOne({ email });

    // Case 1: Already registered user and verified
    if (existingUser && existingUser.isOtpVerified) {
      let customMessage = "Email is already registered. Please log in.";
      if (
        existingUser.username?.toLowerCase() === username.trim().toLowerCase()
      ) {
        customMessage = "Username already exists.";
      }
      return res.status(400).json({ message: customMessage });
    }

    // Case 2: Exists but not verified → delete stale record
    if (existingUser && !existingUser.isOtpVerified) {
      await User.deleteOne({ _id: existingUser._id });
      existingUser = null; // Force recreation
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create or update temp user
    let tempUser = existingUser || new User({ email });

    tempUser.fname = fname;
    tempUser.lname = lname;
    tempUser.username = username.trim().toLowerCase(); // normalize
    tempUser.password = password; // Passport-local-mongoose will hash on save
    tempUser.dob = dob;
    tempUser.gender = gender;
    tempUser.phone = phone;
    tempUser.aadhar = aadhar;
    tempUser.role = "user";
    tempUser.otp = otpHash;
    tempUser.otpExpires = expires;

    await tempUser.save();

    // Send OTP email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.OTP_MAIL,
        pass: process.env.OTP_PASS,
      },
    });

    await transporter.sendMail({
      to: email,
      subject: "Swachhata | Your OTP Code",
      text: `Your OTP is: ${otp}`,
    });

    return res.status(200).json({ message: "OTP sent to email" });
  } catch (err) {
    console.error("Send OTP error:", err);
    return res.status(500).json({ message: "Server error while sending OTP" });
  }
});
app.post("/auth/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user)
      return res
        .status(404)
        .json({ status: "fail", message: "User not found" });
    const enteredOtpHash = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    if (user.otp !== enteredOtpHash || user.otpExpires < Date.now()) {
      return res
        .status(400)
        .json({ status: "fail", message: "Invalid or expired OTP" });
    }
    user.isOtpVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    return res.json({
      status: "success",
      message: "OTP verified successfully",
    });
  } catch (err) {
    console.error("OTP verification error:", err);
    return res.status(500).json({ status: "fail", message: "Server error" });
  }
});
app.post("/auth/sign-up", async (req, res) => {
  try {
    const {
      fname,
      lname,
      email,
      username,
      password,
      gender,
      dob,
      phone,
      aadhar,
    } = req.body;

    const role = "user";

    // Find the user by email (must exist after OTP verification)
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res
        .status(404)
        .json({ message: "Email not found. Please verify OTP first." });
    }

    if (!existingUser.isOtpVerified) {
      return res
        .status(403)
        .json({ message: "OTP not verified. Please verify before signup." });
    }

    // Set all user details
    existingUser.fname = fname;
    existingUser.lname = lname;
    existingUser.username = username.trim().toLowerCase();
    existingUser.gender = gender;
    existingUser.dob = dob;
    existingUser.phone = phone;
    existingUser.aadhar = aadhar;
    existingUser.role = role;

    // Hash the password using Passport-local-mongoose
    await existingUser.setPassword(password);

    // Clear OTP fields
    existingUser.otp = undefined;
    existingUser.otpExpires = undefined;

    await existingUser.save();

    return res.status(201).json({ message: "User successfully registered!" });
  } catch (err) {
    console.error("Registration error:", err);
    return res
      .status(400)
      .json({ message: "Error registering user. Try again!" });
  }
});
app.post("/auth/login", async (req, res, next) => {
  if (req.body.username) {
    req.body.username = req.body.username.trim().toLowerCase();
  }
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    req.logIn(user, (err) => {
      if (err) return next(err);
      res.status(200).json({ message: "Login successful!", user });
    });
  })(req, res, next);
});
app.post("/auth/logout", async (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ successMsg: "Error logging out!" });
    }
    return res.json({ successMsg: "Logged out successfully!" });
  });
});

// 2. User Profile Routes
app.get("/profile/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select(
      "-password -otp -otpExpires" // omit sensitive fields
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (err) {
    console.error("Get profile error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});
app.put("/profile/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      fname,
      lname,
      dob,
      gender,
      address,
      phone,
      email,
      aadhar,
      profileImg,
    } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update editable fields
    if (fname) user.fname = fname;
    if (lname) user.lname = lname;
    if (dob) user.dob = dob;
    if (gender) user.gender = gender;
    if (address) user.address = address;
    if (phone) user.phone = phone;
    if (email) user.email = email;
    if (aadhar) user.aadhar = aadhar;
    if (profileImg) user.profileImg = profileImg;

    await user.save();

    return res
      .status(200)
      .json({ message: "Profile updated successfully", user });
  } catch (err) {
    console.error("Update profile error:", err);

    // Handle duplicate key errors (unique fields)
    if (err.code === 11000) {
      const duplicateField = Object.keys(err.keyPattern)[0];
      return res
        .status(400)
        .json({ message: `${duplicateField} already exists.` });
    }

    return res.status(500).json({ message: "Server error" });
  }
});

// 3. Reports Routes
app.get("/reports", async (req, res) => {
  try {
    const reports = await Report.find().populate(
      "reportOwner",
      "-password -otp -otpExpires"
    );
    return res.status(200).json({ reports });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error while fetching reports" });
  }
});
app.post("/reports", async (req, res) => {
    
});
app.get("/reports/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const report = await Report.findById(id).populate(
      "reportOwner",
      "-password -otp -otpExpires"
    );
    if (!report) return res.status(404).json({ message: "Report not found" });
    return res.status(200).json({ report });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});
app.post("/reports/:id", async (req, res) => {});
app.delete("/reports/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const report = await Report.findByIdAndDelete(id);
    if (!report) return res.status(404).json({ message: "Report not found" });
    return res.status(200).json({ message: "Report deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

app.get("/", async (req, res) => {
  console.log(`Backend active!`);
});

// -- Error handling routes --
app.use((req, res, next) => {
  next(new ExpressError(404, "API not found!"));
});

app.use((err, req, res, next) => {
  let { status = 500, message = "Something went wrong..." } = err;
  res.status(status).json({ message: message });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
