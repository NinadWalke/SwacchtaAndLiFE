const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");

const { verifyToken } = require("../utils/middlewares.js");

// Controllers
const committeeController = require("../controllers/committee.controller");

// Collect all committees, sort them on the basis of scores in the frontend for the leaderboard
router.get("/", wrapAsync(committeeController.getAllCommittees));

// Approve a committee
router.post("/approve", wrapAsync(committeeController.approveCommitteee));

// Reject a committee
router.post("/reject", wrapAsync(committeeController.rejectCommittee));

// Register a new committee
router.post("/register", wrapAsync(committeeController.registerCommittee));

// Committee login
router.post("/login", wrapAsync(committeeController.loginCommittee));

// Get committee details (protected)
router.get("/committee", verifyToken, wrapAsync(committeeController.getCommitteeProfile));

// Check committee registration status
router.get("/:id/status", wrapAsync(committeeController.getCommitteeStatus));

// get committee data
router.get("/:id/data", verifyToken, wrapAsync(committeeController.getCommitteeData));

// get committee users
router.get("/:id/users", verifyToken, wrapAsync(committeeController.getCommitteeUsers));

module.exports = router;
