const User = require('../schemas/User');
const WasteType = require('../schemas/WasteType');
const WasteSubmission = require('../schemas/WasteSubmission');
const Franchisee = require('../schemas/Franchisee');
const { sendEmail } = require('../utils/emails'); // adjust path if needed

// POST /recycle/create
// body: { wasteTypeId, franchiseeId, weightKg?, itemName?, itemDescription?, images? }
module.exports.createRecycleRequest = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const {
      wasteTypeId,
      franchiseeId,
      weightKg,
      itemName,
      itemDescription,
      images
    } = req.body;

    if (!wasteTypeId || !franchiseeId) {
      return res.status(400).json({
        message: "wasteTypeId and franchiseeId are required"
      });
    }

    const wasteType = await WasteType.findById(wasteTypeId);
    if (!wasteType) {
      return res.status(404).json({ message: "Invalid waste type" });
    }

    const franchisee = await Franchisee.findById(franchiseeId);
    if (!franchisee || !franchisee.isActive) {
      return res.status(404).json({ message: "Franchisee not found or inactive" });
    }

    const estimatedAmount =
      weightKg && wasteType.pricePerKg
        ? weightKg * wasteType.pricePerKg
        : 0;

    const submission = await WasteSubmission.create({
      user: userId,
      wasteType: wasteTypeId,
      franchisee: franchiseeId,
      weightKg: weightKg || null,
      estimatedAmount,
      itemName: itemName || "",
      itemDescription: itemDescription || "",
      images: images || [],
      status: "pending"
    });

    return res.status(201).json({
      message: "Recycle request created and sent to franchisee",
      submission
    });

  } catch (err) {
    console.error("Error creating recycle request:", err);
    return res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};

// GET /recycle/my-requests
module.exports.getMySubmissions = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const submissions = await WasteSubmission.find({ user: userId })
      .populate("wasteType", "name pricePerKg")
      .populate("franchisee", "centerName address pincode")
      .sort({ createdAt: -1 });

    return res.status(200).json(submissions);
  } catch (err) {
    console.error("Error fetching user submissions:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// GET /recycle/types
module.exports.getWasteTypes = async (req, res) => {
  try {
    const types = await WasteType.find().sort({ name: 1 });
    return res.status(200).json(types);
  } catch (err) {
    console.error("Error fetching waste types:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// GET /recycle/franchisee/requests
// Franchisee admin is logged in as User with role 'osp' (or similar)
module.exports.getFranchiseeRequests = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Find the franchisee owned by this user
    const franchisee = await Franchisee.findOne({ owner: userId });
    if (!franchisee) {
      return res.status(403).json({ message: "No franchisee assigned to this account" });
    }

    const submissions = await WasteSubmission.find({
      franchisee: franchisee._id
    })
      .populate("user", "fname lname email phone")
      .populate("wasteType", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json(submissions);
  } catch (err) {
    console.error("Error fetching franchisee submissions:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// PATCH /recycle/franchisee/requests/:id/approve
module.exports.approveSubmission = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const submissionId = req.params.id;

    const franchisee = await Franchisee.findOne({ owner: userId });
    if (!franchisee) {
      return res.status(403).json({ message: "No franchisee assigned to this account" });
    }

    let submission = await WasteSubmission.findOne({
      _id: submissionId,
      franchisee: franchisee._id
    })
      .populate("user", "fname lname email")
      .populate("franchisee", "centerName address pincode");

    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    if (submission.status !== "pending") {
      return res.status(400).json({ message: "Only pending requests can be approved" });
    }

    submission.status = "approved";
    await submission.save();

    // Send email to user with franchisee visit details
    const user = submission.user;
    const fran = submission.franchisee;

    const emailHTML = `
      <h2>Recycle Request Approved</h2>
      <p>Hi <strong>${user.fname || ""}</strong>,</p>
      <p>Your recycle request has been <b>APPROVED</b> by <strong>${fran.centerName}</strong>.</p>
      <p>Please visit the franchisee store with your segregated waste:</p>
      <p><b>Address:</b> ${fran.address}, ${fran.pincode}</p>
      <br/>
      <p>Show this message at the store for faster processing.</p>
      <p>Regards,<br/>GreenSathi Team</p>
    `;

    try {
      if (user.email) {
        await sendEmail(user.email, "Your Recycle Request is Approved", emailHTML);
      }
    } catch (emailErr) {
      console.error("Error sending approval email:", emailErr);
      // We won't fail the main request due to email error
    }

    return res.status(200).json({
      message: "Submission approved and user notified via email",
      submission
    });
  } catch (err) {
    console.error("Error approving submission:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


// PATCH /recycle/franchisee/requests/:id/reject
// body: { reason? }
module.exports.rejectSubmission = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const submissionId = req.params.id;
    const { reason } = req.body;

    const franchisee = await Franchisee.findOne({ owner: userId });
    if (!franchisee) {
      return res.status(403).json({ message: "No franchisee assigned to this account" });
    }

    let submission = await WasteSubmission.findOne({
      _id: submissionId,
      franchisee: franchisee._id
    })
      .populate("user", "fname lname email")
      .populate("franchisee", "centerName");

    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    if (submission.status !== "pending") {
      return res.status(400).json({ message: "Only pending requests can be rejected" });
    }

    submission.status = "rejected";
    submission.rejectionReason = reason || "";
    await submission.save();

    // Optional: email user about rejection
    const user = submission.user;
    if (user && user.email) {
      const emailHTML = `
        <h2>Recycle Request Rejected</h2>
        <p>Hi <strong>${user.fname || ""}</strong>,</p>
        <p>Your recycle request at <b>${submission.franchisee.centerName}</b> has been <b>REJECTED</b>.</p>
        ${reason ? `<p><b>Reason:</b> ${reason}</p>` : ""}
        <p>You may submit a new request with valid details.</p>
        <p>Regards,<br/>GreenSathi Team</p>
      `;
      try {
        await sendEmail(user.email, "Your Recycle Request was Rejected", emailHTML);
      } catch (emailErr) {
        console.error("Error sending rejection email:", emailErr);
      }
    }

    return res.status(200).json({
      message: "Submission rejected",
      submission
    });
  } catch (err) {
    console.error("Error rejecting submission:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
