const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const multer = require('multer');
const { storage } = require("../utils/cloudconfig");
const uploadImgCloudinary = multer({ storage });

// Controllers
const {
  getAllReports,
  getMyReports,
  createReport,
  getReportById,
  updateReportStatus,
  deleteReport,
} = require("../controllers/reports.controller");

// Upload middleware
const uploadFields = uploadImgCloudinary.fields([
  { name: "image", maxCount: 1 },
  { name: "image2", maxCount: 1 },
]);

// Get all reports
router.get("/", wrapAsync(getAllReports));

// Get reports created by logged-in user
router.get("/my-reports", wrapAsync(getMyReports));

// Create a new report (with images)
router.post("/", uploadFields, wrapAsync(createReport));

// Get report by ID
router.get("/:id", wrapAsync(getReportById));

// Toggle report status
router.post("/:id", wrapAsync(updateReportStatus));

// Delete a report
router.delete("/:id", wrapAsync(deleteReport));

module.exports = router;
