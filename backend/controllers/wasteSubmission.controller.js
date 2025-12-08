const WasteSubmission = require("../schemas/WasteSubmission");
const Franchisee = require("../schemas/Franchisee");

module.exports.createSubmission = async (req, res) => {
  const submission = await WasteSubmission.create(req.body);

  return res.status(201).json({
    message: "Waste submission created successfully",
    submission,
  });
};

module.exports.getVendorAssignments = async (req, res) => {
  const vendorId = req.user?._id;

  if (!vendorId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Fetch submissions assigned to this vendor
  const submissions = await WasteSubmission.find({
    vendor: vendorId,
    status: { $in: ["vendor-assigned", "collected"] }, 
  })
    .populate("user", "fname lname email phone")
    .populate("wasteType", "name pricePerKg")
    .populate("franchisee", "centerName address pincode")
    .populate("vendor", "fname lname email")
    .sort({ createdAt: -1 });

  return res.status(200).json(submissions);
};

module.exports.verifySubmission = async (req, res) => {
  const userId = req.user?._id;

  const franchisee = await Franchisee.findOne({ owner: userId });
  if (!franchisee) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  const submission = await WasteSubmission.findOne({
    _id: req.params.id,
    franchisee: franchisee._id
  });

  if (!submission) {
    return res.status(404).json({ message: "Submission not found" });
  }

  if (submission.status !== "collected") {
    return res.status(400).json({
      message: "Only collected requests can be verified"
    });
  }

  submission.status = "verified";
  await submission.save();

  return res.json({
    message: "Submission verified successfully",
    submission
  });
};

module.exports.payVendor = async (req, res) => {
  const userId = req.user?._id;

  const franchisee = await Franchisee.findOne({ owner: userId });
  if (!franchisee) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  const submission = await WasteSubmission.findOne({
    _id: req.params.id,
    franchisee: franchisee._id
  });

  if (!submission) {
    return res.status(404).json({ message: "Submission not found" });
  }

  if (submission.status !== "verified") {
    return res.status(400).json({
      message: "Only verified requests can be marked paid"
    });
  }

  submission.status = "paid";
  await submission.save();

  return res.json({
    message: "Vendor marked as paid",
    submission
  });
};


module.exports.getAllSubmissions = async (req, res) => {
  const submissions = await WasteSubmission.find()
    .populate("user", "fname lname email")
    .populate("wasteType", "name pricePerKg")
    .populate("franchisee", "centerName")
    .populate("vendor", "fname lname email")
    .sort({ createdAt: -1 });

  return res.status(200).json(submissions);
};

module.exports.getSubmissionById = async (req, res) => {
  const submission = await WasteSubmission.findById(req.params.id)
    .populate("user", "fname lname email")
    .populate("wasteType", "name pricePerKg")
    .populate("franchisee", "centerName")
    .populate("vendor", "fname lname email");

  if (!submission) {
    return res.status(404).json({ message: "Submission not found" });
  }

  return res.status(200).json(submission);
};

module.exports.updateSubmission = async (req, res) => {
  const updated = await WasteSubmission.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  if (!updated) {
    return res.status(404).json({ message: "Submission not found" });
  }

  return res.json({
    message: "Waste submission updated successfully",
    submission: updated,
  });
};

module.exports.deleteSubmission = async (req, res) => {
  const deleted = await WasteSubmission.findByIdAndDelete(req.params.id);

  if (!deleted) {
    return res.status(404).json({ message: "Submission not found" });
  }

  return res.json({
    message: "Waste submission deleted successfully",
  });
};

module.exports.markCollected = async (req, res) => {
  const vendorId = req.user?._id;

  const submission = await WasteSubmission.findOne({
    _id: req.params.id,
    vendor: vendorId,
  });

  if (!submission)
    return res.status(404).json({ message: "Submission not found or unauthorized" });

  if (submission.status !== "vendor-assigned")
    return res.status(400).json({
      message: "Submission must be vendor-assigned before marking collected",
    });

  submission.status = "collected";
  await submission.save();

  return res.json({
    message: "Marked as collected",
    submission,
  });
};

