const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const multer = require("multer");
const { storage } = require("../utils/cloudconfig");
const uploadImgCloudinary = multer({ storage });
const upload = multer({ storage: multer.memoryStorage() });

// Controllers
const reportsController = require("../controllers/reports.controller");

// -- /reports --
// Get all reports
router.get("/", wrapAsync(reportsController.getAllReports));

// Create a new report (with images)
router.post(
  "/",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "image2", maxCount: 1 },
  ]),
  wrapAsync(reportsController.createReport)
);

// Get reports created by logged-in user
router.get("/my-reports", wrapAsync(reportsController.getMyReports));

// Get all reports assigned to the logged-in OSP
router.get("/assigned", wrapAsync(reportsController.getReportsAssignedToOsp));

// Get report by ID
router.get("/:id", wrapAsync(reportsController.getReportById));

// Toggle report status
router.post("/:id", wrapAsync(reportsController.updateReportStatus));

// Assign a report to an OSP (official action)
router.post("/:id/assign", wrapAsync(reportsController.assignReportToOsp));

// OSP marks report resolved
router.post("/:id/resolve", wrapAsync(reportsController.ospResolveReport));

module.exports = router;
