const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const multer = require('multer');
const { storage } = require("../utils/cloudconfig");
const uploadImgCloudinary = multer({ storage });

// Controllers
const reportsController = require("../controllers/reports.controller");

// Upload middleware
const uploadFields = uploadImgCloudinary.fields([
  { name: "image", maxCount: 1 },
  { name: "image2", maxCount: 1 },
]);

// -- /reports --
// Get all reports
router.get("/", wrapAsync(reportsController.getAllReports));

// Get reports created by logged-in user
router.get("/my-reports", wrapAsync(reportsController.getMyReports));

// Create a new report (with images)
router.post("/", uploadFields, wrapAsync(reportsController.createReport));

// Get report by ID
router.get("/:id", wrapAsync(reportsController.getReportById));

// Toggle report status
router.post("/:id", wrapAsync(reportsController.updateReportStatus));

// Allot report to a car
router.post("/:id/assign-report", wrapAsync(reportsController.allotReportToCar));

// Mark the report as resolved by the OSP
router.post("/:id/mark-resolved", wrapAsync(reportsController.markReportResolved));

// Delete a report
router.delete("/:id", wrapAsync(reportsController.deleteReport));

module.exports = router;
