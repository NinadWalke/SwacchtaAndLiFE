const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");

const { verifyToken } = require("../utils/middlewares.js");

// Controllers
const {
  registerCommittee,
  loginCommittee,
  getCommitteeProfile,
} = require("../controllers/committee.controller");

// Register a new committee
router.post("/register", wrapAsync(registerCommittee));

// Committee login
router.post("/login", wrapAsync(loginCommittee));

// Get committee details (protected)
router.get("/committee", verifyToken, wrapAsync(getCommitteeProfile));

module.exports = router;
