const express = require("express");
const router = express.Router();
const wasteSubmissionController = require("../controllers/wasteSubmission.controller");
const wrapAsync = require("../utils/wrapAsync");

// READ ALL
router.get("/", wrapAsync(wasteSubmissionController.getAllSubmissions));

router.get("/assigned", wrapAsync(wasteSubmissionController.getVendorAssignments));

router.patch(
  "/requests/:id/verify",
  wrapAsync(wasteSubmissionController.verifySubmission)
);

router.patch(
  "/requests/:id/pay",
  wrapAsync(wasteSubmissionController.payVendor)
);


// READ ONE
router.get("/:id", wrapAsync(wasteSubmissionController.getSubmissionById));

// DELETE
router.delete("/:id", wrapAsync(wasteSubmissionController.deleteSubmission));

router.patch("/requests/:id/collected", wrapAsync(wasteSubmissionController.markCollected));

module.exports = router;
