const WasteSubmission = require("../schemas/WasteSubmission");

// ----------------------------------------
// CREATE Waste Submission
// ----------------------------------------
module.exports.createSubmission = async (req, res) => {
  const submission = await WasteSubmission.create(req.body);

  return res.status(201).json({
    message: "Waste submission created successfully",
    submission,
  });
};

// ----------------------------------------
// READ All Submissions
// ----------------------------------------
module.exports.getAllSubmissions = async (req, res) => {
  const submissions = await WasteSubmission.find()
    .populate("user", "fname lname email")
    .populate("wasteType", "name pricePerKg")
    .populate("franchisee", "centerName")
    .populate("vendor", "fname lname email")
    .sort({ createdAt: -1 });

  return res.status(200).json(submissions);
};

// ----------------------------------------
// READ Submission by ID
// ----------------------------------------
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

// ----------------------------------------
// UPDATE Submission
// ----------------------------------------
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

// ----------------------------------------
// DELETE Submission
// ----------------------------------------
module.exports.deleteSubmission = async (req, res) => {
  const deleted = await WasteSubmission.findByIdAndDelete(req.params.id);

  if (!deleted) {
    return res.status(404).json({ message: "Submission not found" });
  }

  return res.json({
    message: "Waste submission deleted successfully",
  });
};
