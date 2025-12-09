const express = require("express");
const router = express.Router();
const wasteSubmissionController = require("../controllers/wasteSubmission.controller");
const wrapAsync = require("../utils/wrapAsync");

// READ ALL
router.get("/", wrapAsync(wasteSubmissionController.getAllSubmissions));

// Vendor routes
router.get('/vendor/near-me', wrapAsync(wasteSubmissionController.getNearbyVendorEvents));
router.post('/vendor/events', wasteSubmissionController.createVendorEvent);
router.get('/vendor/events/all', wrapAsync(wasteSubmissionController.getAllVendorEvents));
router.post('/vendor/settlement', wrapAsync(wasteSubmissionController.createSettlement));

router.get("/assigned", wrapAsync(wasteSubmissionController.getVendorAssignments));

router.patch(
  "/requests/:id/verify",
  wrapAsync(wasteSubmissionController.verifySubmission)
);

router.patch(
  "/requests/:id/pay",
  wrapAsync(wasteSubmissionController.payVendor)
);

router.patch("/requests/:id/collected", wrapAsync(wasteSubmissionController.markCollected));


// READ ONE
router.get("/:id", wrapAsync(wasteSubmissionController.getSubmissionById));

// DELETE
router.delete("/:id", wrapAsync(wasteSubmissionController.deleteSubmission));

module.exports = router;
