const User = require("../schemas/User");
const WasteSubmission = require("../schemas/WasteSubmission");
const WasteType = require("../schemas/WasteType");
const Franchisee = require("../schemas/Franchisee");
const { sendEmail } = require("../utils/emails"); // adjust path if needed

// GET /recycle/franchisees
module.exports.getAllFranchisees = async (req, res) => {
  try {
    const franchisees = await Franchisee.find()
      .populate("owner", "fname lname email phone") // show basic owner info
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: franchisees.length,
      franchisees,
    });
  } catch (err) {
    console.error("Error fetching franchisees:", err);
    return res.status(500).json({
      message: "Server error while fetching franchisees",
      error: err.message,
    });
  }
};

module.exports.getNearbyFranchisees = async (req, res) => {
  try {
    const { lat, lng, radiusKm = 25 } = req.query;

    if (!lat || !lng) {
      return res
        .status(400)
        .json({ message: "Latitude and longitude are required" });
    }

    const radiusInRadians = radiusKm / 6371; // Earth radius km → radians

    const franchisees = await Franchisee.find({
      location: {
        $geoWithin: {
          $centerSphere: [[parseFloat(lng), parseFloat(lat)], radiusInRadians],
        },
      },
    }).populate("owner", "fname lname email phone");

    return res.status(200).json({
      count: franchisees.length,
      radiusKm: Number(radiusKm),
      franchisees,
    });
  } catch (err) {
    console.error("Nearby franchisees error:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

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
      images,
    } = req.body;

    if (!wasteTypeId || !franchiseeId) {
      return res.status(400).json({
        message: "wasteTypeId and franchiseeId are required",
      });
    }

    const wasteType = await WasteType.findById(wasteTypeId);
    if (!wasteType) {
      return res.status(404).json({ message: "Invalid waste type" });
    }

    const franchisee = await Franchisee.findById(franchiseeId);
    if (!franchisee || !franchisee.isActive) {
      return res
        .status(404)
        .json({ message: "Franchisee not found or inactive" });
    }

    const estimatedAmount =
      weightKg && wasteType.pricePerKg ? weightKg * wasteType.pricePerKg : 0;

    const submission = await WasteSubmission.create({
      user: userId,
      wasteType: wasteTypeId,
      franchisee: franchiseeId,
      weightKg: weightKg || null,
      estimatedAmount,
      itemName: itemName || "",
      itemDescription: itemDescription || "",
      images: images || [],
      status: "pending",
    });

    return res.status(201).json({
      message: "Recycle request created and sent to franchisee",
      submission,
    });
  } catch (err) {
    console.error("Error creating recycle request:", err);
    return res.status(500).json({
      message: "Server error",
      error: err.message,
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
module.exports.createWasteType = async (req, res) => {
  const { name, description, pricePerKg } = req.body;

  const type = await WasteType.create({
    name,
    description,
    pricePerKg,
  });

  return res.status(201).json({
    message: "Waste type created successfully.",
    type,
  });
};
module.exports.updateWasteType = async (req, res) => {
  const { id } = req.params;

  const updated = await WasteType.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  return res.json({
    message: "Waste type updated.",
    type: updated,
  });
};
module.exports.deleteWasteType = async (req, res) => {
  const { id } = req.params;
  await WasteType.findByIdAndDelete(id);

  return res.json({ message: "Waste type deleted successfully." });
};
module.exports.getFranchiseeWasteTypes = async (req, res) => {
  const franchisee = await Franchisee.findOne({ owner: req.user._id }).populate(
    "acceptedWasteTypes"
  );

  if (!franchisee)
    return res.status(404).json({ message: "Franchisee not found." });

  return res.json({
    types: franchisee.acceptedWasteTypes,
  });
};
module.exports.updateFranchiseeWasteTypes = async (req, res) => {
  const { types } = req.body;

  const franchisee = await Franchisee.findOneAndUpdate(
    { owner: req.user._id },
    { acceptedWasteTypes: types },
    { new: true }
  );

  return res.json({
    message: "Waste types updated for franchisee.",
    types: franchisee.acceptedWasteTypes,
  });
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
      return res
        .status(403)
        .json({ message: "No franchisee assigned to this account" });
    }

    const submissions = await WasteSubmission.find({
      franchisee: franchisee._id,
    }).populate('vendor')
      .populate("user", "fname lname email phone")
      .populate("wasteType", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json(submissions);
  } catch (err) {
    console.error("Error fetching franchisee submissions:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.assignVendor = async (req, res) => {
  const { vendorId } = req.body; // vendorId = email

  if (!vendorId) {
    return res.status(400).json({ message: "Vendor email is required." });
  }

  // Find vendor by email
  const vendor = await User.findOne({ email: vendorId });
  if (!vendor) {
    return res
      .status(404)
      .json({ message: "Vendor with this email not found." });
  }

  // Find waste submission
  const submission = await WasteSubmission.findById(req.params.id);
  if (!submission) {
    return res.status(404).json({ message: "Submission not found." });
  }

  // Heavy waste check
  if (submission.weightKg < 10) {
    return res
      .status(400)
      .json({ message: "Vendor pickup allowed only for heavy waste." });
  }

  // Assign vendor internally using ObjectId
  submission.vendor = vendor._id;
  submission.pickupMethod = "vendor";
  submission.finalAmount = submission.estimatedAmount - 200; // e.g. user gets reduced amount
  submission.status = "vendor-assigned";

  await submission.save();

  return res.json({
    message: "Vendor assigned successfully!",
    submission,
  });
};

// PATCH /recycle/franchisee/requests/:id/approve
module.exports.approveSubmission = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const submissionId = req.params.id;

    // Find franchisee owned by this user
    const franchisee = await Franchisee.findOne({ owner: userId });
    if (!franchisee) {
      return res
        .status(403)
        .json({ message: "This account is not linked to any franchisee" });
    }

    // Find submission belonging to this franchisee
    let submission = await WasteSubmission.findOne({
      _id: submissionId,
      franchisee: franchisee._id,
    })
      .populate("user", "fname lname email phone")
      .populate("wasteType", "name")
      .populate("franchisee", "centerName address pincode");

    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    if (submission.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Only pending submissions can be approved" });
    }

    // Update status
    submission.status = "approved";
    await submission.save();

    // Email to user (matching committee style)
    const user = submission.user;
    const fran = submission.franchisee;

    const emailHTML = `
      <h2>Recycle Request Approved</h2>
      <p>Hi <strong>${user.fname || "User"}</strong>,</p>
      <p>Your recycle request for <b>${
        submission.wasteType.name
      }</b> has been <b>APPROVED</b> by the franchisee:</p>

      <br/>
      <p><strong>${fran.centerName}</strong></p>
      <p>${fran.address}, ${fran.pincode}</p>
      <br/>

      <p>Please visit this franchisee store to complete the waste submission process offline.</p>

      <p>Our team will assist you with weighing, pricing, and final confirmation.</p>

      <br/>
      <p>Regards,<br/>GreenSathi Team</p>
    `;

    try {
      if (user.email) {
        await sendEmail(
          user.email,
          "Your Recycle Request Has Been Approved",
          emailHTML
        );
      }
    } catch (emailErr) {
      console.error("Error sending approval email:", emailErr);
      // Do NOT break the flow
    }

    return res.status(200).json({
      message: "Submission approved and email sent to user",
      submission,
    });
  } catch (err) {
    console.error("Error approving submission:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
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
     const reason = req.body?.reason || "Rejected by franchisee";

    const franchisee = await Franchisee.findOne({ owner: userId });
    if (!franchisee) {
      return res
        .status(403)
        .json({ message: "No franchisee assigned to this account" });
    }

    let submission = await WasteSubmission.findOne({
      _id: submissionId,
      franchisee: franchisee._id,
    })
      .populate("user", "fname lname email")
      .populate("franchisee", "centerName");

    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    if (submission.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Only pending requests can be rejected" });
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
        <p>Your recycle request at <b>${
          submission.franchisee.centerName
        }</b> has been <b>REJECTED</b>.</p>
        ${reason ? `<p><b>Reason:</b> ${reason}</p>` : ""}
        <p>You may submit a new request with valid details.</p>
        <p>Regards,<br/>GreenSathi Team</p>
      `;
      try {
        await sendEmail(
          user.email,
          "Your Recycle Request was Rejected",
          emailHTML
        );
      } catch (emailErr) {
        console.error("Error sending rejection email:", emailErr);
      }
    }

    return res.status(200).json({
      message: "Submission rejected",
      submission,
    });
  } catch (err) {
    console.error("Error rejecting submission:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
