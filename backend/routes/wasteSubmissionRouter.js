const express = require("express");
const router = express.Router();
const wasteSubmissionController = require("../controllers/wasteSubmission.controller");
const wrapAsync = require("../utils/wrapAsync");

// READ ALL
router.get("/", wrapAsync(wasteSubmissionController.getAllSubmissions));

// READ ONE
router.get("/:id", wrapAsync(wasteSubmissionController.getSubmissionById));

// DELETE
router.delete("/:id", wrapAsync(wasteSubmissionController.deleteSubmission));

module.exports = router;
