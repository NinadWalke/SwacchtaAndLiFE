const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");

const {
  getUserProfile,
  updateUserProfile,
} = require("../controllers/profile.controller");

// Get user profile
router.get("/:id", wrapAsync(getUserProfile));

// Update user profile
router.put("/:id", wrapAsync(updateUserProfile));

module.exports = router;
