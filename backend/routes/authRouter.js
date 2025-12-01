const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");

// Controllers
const {
  checkAuth,
  getAllUsers,
  sendOtp,
  verifyOtp,
  signUp,
  loginUser,
  logoutUser,
} = require("../controllers/auth.controller");

router.get("/check", wrapAsync(checkAuth));

router.get("/users", wrapAsync(getAllUsers));

router.post("/send-otp", wrapAsync(sendOtp));

router.post("/verify-otp", wrapAsync(verifyOtp));

router.post("/sign-up", wrapAsync(signUp));

router.post("/login", loginUser);

router.post("/logout", wrapAsync(logoutUser));

module.exports = router;
