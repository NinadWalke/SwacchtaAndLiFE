const User = require("../schemas/User");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const passport = require("passport");

// Check if user is authenticated
exports.checkAuth = async (req, res) => {
  if (req.isAuthenticated()) {
    return res.status(200).json({ authenticated: true, user: req.user });
  }
  return res.status(201).json({ authenticated: false, user: null });
};

// Fetch all users
exports.getAllUsers = async (req, res) => {
  const users = await User.find();
  return res.json(users);
};

// Send OTP to user email
exports.sendOtp = async (req, res) => {
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

  let existingUser = await User.findOne({ email });

  // If already verified user exists
  if (existingUser && existingUser.isOtpVerified) {
    let customMessage = "Email is already registered. Please log in.";

    if (
      existingUser.username?.toLowerCase() ===
      username.trim().toLowerCase()
    ) {
      customMessage = "Username already exists.";
    }

    return res.status(400).json({ message: customMessage });
  }

  // Delete unverified stale user
  if (existingUser && !existingUser.isOtpVerified) {
    await User.deleteOne({ _id: existingUser._id });
    existingUser = null;
  }

  // Generate OTP and hash it
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
  const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 min

  // Create or update user object
  let tempUser = existingUser || new User({ email });

  tempUser.fname = fname;
  tempUser.lname = lname;
  tempUser.username = username.trim().toLowerCase();
  tempUser.password = password;
  tempUser.dob = dob;
  tempUser.gender = gender;
  tempUser.phone = phone;
  tempUser.aadhar = aadhar;
  tempUser.role = "user";
  tempUser.otp = otpHash;
  tempUser.otpExpires = expires;

  await tempUser.save();

  // Send OTP mail
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
};

// Verify OTP sent to user
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ status: "fail", message: "User not found" });
  }

  // Hash entered OTP
  const enteredOtpHash = crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");

  // Validate OTP
  if (user.otp !== enteredOtpHash || user.otpExpires < Date.now()) {
    return res
      .status(400)
      .json({ status: "fail", message: "Invalid or expired OTP" });
  }

  // Mark user as verified
  user.isOtpVerified = true;
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save();

  return res.json({
    status: "success",
    message: "OTP verified successfully",
  });
};

// Register new user
exports.signUp = async (req, res) => {
  const {
    fname,
    lname,
    email,
    username,
    password,
    gender,
    dob,
    address,
    phone,
    aadhar,
  } = req.body;

  const role = "user";
  console.log("login invoked!");
  
  // Check email existence
  const existingEmail = await User.findOne({
    email: email.trim().toLowerCase(),
  });
  if (existingEmail) {
    return res.status(409).json({ message: "Email already registered." });
  }

  // Check username existence
  const existingUsername = await User.findOne({
    username: username.trim().toLowerCase(),
  });
  if (existingUsername) {
    return res.status(409).json({ message: "Username already taken." });
  }

  // Create new user
  const newUser = new User({
    fname: fname.trim(),
    lname: lname.trim(),
    email: email.trim().toLowerCase(),
    username: username.trim().toLowerCase(),
    gender,
    dob,
    phone: phone.trim(),
    aadhar: aadhar.trim(),
    address,
    role,
  });

  // Hash password using passport-local-mongoose
  await newUser.setPassword(password);
  await newUser.save();

  return res.status(201).json({ message: "User successfully registered!" });
};

// Login user using passport local
exports.loginUser = (req, res, next) => {
  if (req.body.username) {
    req.body.username = req.body.username.trim().toLowerCase();
  }

  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    req.logIn(user, (err) => {
      if (err) return next(err);
      res.status(200).json({ message: "Login successful!", user });
    });
  })(req, res, next);
};

// Logout user
exports.logoutUser = async (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ successMsg: "Error logging out!" });
    }
    return res.json({ successMsg: "Logged out successfully!" });
  });
};
