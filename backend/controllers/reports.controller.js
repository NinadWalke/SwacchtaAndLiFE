const Report = require("../schemas/Report");
const User = require("../schemas/User");

const { sendSMS } = require("../utils/twilio");
const cloudinary = require("cloudinary").v2;
const { extractPublicId } = require("../utils/cloudinaryHelpers.js");

// Fetch all reports with populated user data
exports.getAllReports = async (req, res) => {
  const reports = await Report.find().populate(
    "reportOwner",
    "-password -otp -otpExpires"
  );

  return res.status(200).json({ reports });
};

// Fetch reports created by the logged-in user
exports.getMyReports = async (req, res) => {
  const user = await User.findById(req.user._id).populate("reports");
  const userReports = user.reports;
  return res.json(userReports);
};

// Create a new report with location + images
exports.createReport = async (req, res) => {
  // Image uploads required
  if (!req.files || !req.files["image"] || !req.files["image2"]) {
    return res.status(400).json({ message: "Both images must be uploaded." });
  }

  const imageUrl1 = req.files["image"][0].path;
  const imageUrl2 = req.files["image2"][0].path;

  const { latitude, longitude, remarks } = req.body;

  if (!latitude || !longitude) {
    return res.status(400).json({ message: "Location coordinates required" });
  }

  // Create new report
  const newReport = new Report({
    reportImg: imageUrl1,
    reportYoloImg: imageUrl2,
    remarks,
    status: "pending",
    reportOwner: req.user._id,
    location: {
      type: "Point",
      coordinates: [Number(longitude), Number(latitude)], // GeoJSON format
    },
  });

  const user = req.user;

  // Add report to user records
  user.reports.push(newReport);
  user.points += 15; // Scoring system

  await user.save();
  await newReport.save();

  if (user.phone) {
    const smsBody = `Your report has been submitted successfully!\nReport ID: ${newReport._id}\nStatus: Pending review.`;

    try {
      await sendSMS(user.phone, smsBody);
    } catch (smsErr) {
      console.error("SMS error:", smsErr);
    }
  }

  return res.status(201).json({
    message: "Report created successfully!",
    report: newReport,
  });
};

// Get report by ID
exports.getReportById = async (req, res) => {
  const { id } = req.params;

  const report = await Report.findById(id).populate(
    "reportOwner",
    "-password -otp -otpExpires"
  );

  if (!report) {
    return res.status(404).json({ message: "Report not found" });
  }

  return res.status(200).json({ report });
};

// Toggle report status (pending → allotted → resolved → pending)
exports.updateReportStatus = async (req, res) => {
  const { id } = req.params;

  const report = await Report.findById(id);

  if (!report) {
    return res.status(404).json({ message: "Report not found" });
  }

  // pending → allotted
  if (report.status === "pending") {
    report.status = "allotted";
    await report.save();

    return res.status(200).json({
      message: "Status updated",
      status: report.status,
    });
  }

  // allotted → resolved
  if (report.status === "allotted") {
    report.status = "resolved";
    await report.save();

    return res.status(200).json({
      message: "Status updated",
      status: report.status,
    });
  }

  // resolved → DELETE FROM CLOUD + DELETE FROM DB
  if (report.status === "resolved") {
    // delete main image
    if (report.reportImg) {
      const publicId = extractPublicId(report.reportImg);
      await cloudinary.uploader.destroy(publicId);
    }

    // delete YOLO image
    if (report.reportYoloImg) {
      const publicId = extractPublicId(report.reportYoloImg);
      await cloudinary.uploader.destroy(publicId);
    }

    // delete the document
    await Report.findByIdAndDelete(id);

    const newReports = await Report.find();

    return res.status(200).json({
      message: "Report deleted (was resolved)",
      status: "deleted",
      newReports: newReports
    });
  }
};

exports.getAllCars = async (req, res) => {
  // collect cars from db
  // res.json()
};

exports.allotReportToCar = async (req, res) => {
  const { id, cid } = req.params;
  // collect car from database
  // allot report to car
  // change report status
  // car.save(), report.save()
  // twilio integrated here
};

exports.markReportResolved = async (req, res) => {
  const { id, cid } = req.params;
  // collect car from database
  // remove report from car
  // change report status
  // car.save(), report.save()
  // twilio integrated here
};
