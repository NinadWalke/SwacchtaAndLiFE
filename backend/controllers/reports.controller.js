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
  if(user.greenCoins) user.greenCoins += 15; // Scoring system

  await user.save();
  await newReport.save();

  // --- Disabled SMS as to not waste credits ---
  // if (user.phone) {
  //   const smsBody = `Your report has been submitted successfully!\nReport ID: ${newReport._id}\nStatus: Pending review.`;

  //   try {
  //     await sendSMS(user.phone, smsBody);
  //   } catch (smsErr) {
  //     console.error("SMS error:", smsErr);
  //   }
  // }

  return res.status(201).json({
    message: "Report created successfully!",
    report: newReport,
  });
};

// Fetch reports created by the logged-in user
exports.getMyReports = async (req, res) => {
  const user = await User.findById(req.user._id).populate("reports");
  const userReports = user.reports;
  return res.json(userReports);
};

// get all reports assigned to OSPs
exports.getReportsAssignedToOsp = async (req, res) => {
  try {
    const userId = req.user._id;

    const reports = await Report.find({
      assignedTo: userId,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Reports assigned to this OSP",
      reports,
    });
  } catch (err) {
    console.error("Error fetching OSP assigned reports:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
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

// Officials can ONLY close (delete) resolved reports
exports.updateReportStatus = async (req, res) => {
  const { id } = req.params;

  const report = await Report.findById(id);

  if (!report) {
    return res.status(404).json({ message: "Report not found" });
  }

  // Only delete resolved reports
  if (report.status !== "resolved") {
    return res.status(400).json({
      message: "This action is only allowed when the report is resolved",
      status: report.status,
    });
  }

  // --- DELETE FROM CLOUDINARY ---
  if (report.reportImg) {
    const publicId = extractPublicId(report.reportImg);
    await cloudinary.uploader.destroy(publicId);
  }

  if (report.reportYoloImg) {
    const publicId = extractPublicId(report.reportYoloImg);
    await cloudinary.uploader.destroy(publicId);
  }

  // --- DELETE FROM DATABASE ---
  await Report.findByIdAndDelete(id);
  const newReports = await Report.find();

  return res.status(200).json({
    message: "Report successfully closed and deleted",
    status: "deleted",
    newReports,
  });
};

// assign report to an active osp
exports.assignReportToOsp = async (req, res) => {
  try {
    const reportId = req.params.id;
    const { ospId } = req.body; // OSP ID passed from frontend

    const report = await Report.findById(reportId);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    if (report.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Only pending reports can be allotted" });
    }

    const osp = await User.findById(ospId);

    if (!osp || osp.role !== "osp") {
      return res.status(400).json({ message: "Invalid OSP selected" });
    }

    if (!osp.isOnDuty) {
      return res.status(400).json({ message: "OSP is not on duty" });
    }

    report.assignedTo = ospId;
    report.status = "allotted";

    await report.save();

    return res.status(200).json({
      message: "Report successfully allotted to OSP",
      report,
    });
  } catch (err) {
    console.error("Error assigning report to OSP:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// resolve the osp report
exports.ospResolveReport = async (req, res) => {
  try {
    const reportId = req.params.id;
    const userId = req.user._id;

    const report = await Report.findById(reportId);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    if (
      !report.assignedTo ||
      report.assignedTo.toString() !== userId.toString()
    ) {
      return res
        .status(403)
        .json({ message: "You are not assigned to this report" });
    }

    if (report.status !== "allotted") {
      return res
        .status(400)
        .json({ message: "Report must be in allotted state" });
    }

    report.status = "resolved";
    await report.save();

    return res.status(200).json({
      message: "Report marked resolved by OSP",
      report,
    });
  } catch (err) {
    console.error("Error resolving report:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
