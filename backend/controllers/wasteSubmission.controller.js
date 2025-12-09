const WasteSubmission = require("../schemas/WasteSubmission");
const Franchisee = require("../schemas/Franchisee");
const User = require("../schemas/User");
const VendorEvent = require("../schemas/VendorEvent");
const VendorSettlement = require("../schemas/VendorSettlement");

const geocodeAddress = require("../utils/mapboxConfig");

module.exports.createSubmission = async (req, res) => {
  const submission = await WasteSubmission.create(req.body);

  return res.status(201).json({
    message: "Waste submission created successfully",
    submission,
  });
};

// Vendor controllers
exports.getNearbyVendorEvents = async (req, res) => {
  try {
    const { lat, lng, radiusKm } = req.query;

    const events = await VendorEvent.find({
      location: {
        $geoWithin: {
          $centerSphere: [[lng, lat], (radiusKm * 100) / 6378.1],
        },
      },
    });

    res.json({ events });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching vendor events" });
  }
};

exports.createVendorEvent = async (req, res) => {
  try {
    const { vendorEmail, title, description, wasteTypes, date, address } =
      req.body;
    console.log(req.body);

    if (!vendorEmail || !title || !wasteTypes || !date || !address) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // 1️⃣ Find vendor by email
    const vendor = await User.findOne({ email: vendorEmail });

    if (!vendor) {
      return res
        .status(404)
        .json({ message: "Vendor not found with this email" });
    }

    const vendorId = vendor._id;
    const vendorName = `${vendor.fname} ${vendor.lname}`;

    // 2️⃣ Geocode the address → get lat/lng
    const loc = await geocodeAddress(address);

    if (!loc || !loc.longitude || !loc.latitude) {
      return res.status(400).json({ message: "Could not geocode address" });
    }

    // 3️⃣ Get the franchisee of current owner
    const franchisee = await Franchisee.findOne({ owner: req.user._id });

    if (!franchisee) {
      return res.status(404).json({ message: "Franchisee profile not found" });
    }

    // 4️⃣ Create event
    const newEvent = await VendorEvent.create({
      vendorId,
      vendorName,
      title,
      description,
      wasteTypes,
      franchiseeId: franchisee._id,
      location: {
        type: "Point",
        coordinates: [loc.longitude, loc.latitude],
        address,
        areaName: loc.place_name || "",
      },
      date: new Date(date),
    });

    res.status(201).json({
      message: "Vendor event created successfully",
      event: newEvent,
    });
  } catch (error) {
    console.error("Error creating vendor event:", error);
    res.status(500).json({ message: "Server error creating vendor event" });
  }
};

exports.getAllVendorEvents = async (req, res) => {
  try {
    // 1. Find the franchisee owned by this logged-in user
    const franchisee = await Franchisee.findOne({ owner: req.user._id });

    if (!franchisee) {
      return res
        .status(404)
        .json({ message: "Franchisee not found for this user" });
    }

    // 2. Fetch all vendor events linked to this franchisee
    const events = await VendorEvent.find({ franchiseeId: franchisee._id })
      .sort({ date: -1 }) // newest first
      .lean(); // faster response

    // 3. Return the events
    res.json({ events });
  } catch (err) {
    console.error("Error fetching vendor events:", err);
    res.status(500).json({ message: "Server error fetching vendor events" });
  }
};

exports.createSettlement = async (req, res) => {
  try {
    const { eventId, totalWeightKg, amountPaidToVendor, notes } = req.body;

    if (!eventId || !totalWeightKg || !amountPaidToVendor) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // 1️⃣ Get event to extract vendorId
    const event = await VendorEvent.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Vendor event not found" });
    }

    const vendorId = event.vendorId;

    // 2️⃣ Get franchisee of logged-in user
    const franchisee = await Franchisee.findOne({ owner: req.user._id });
    if (!franchisee) {
      return res.status(404).json({ message: "Franchisee not found" });
    }

    const franchiseeId = franchisee._id;

    // 3️⃣ Create settlement entry
    const record = await VendorSettlement.create({
      vendorId,
      franchiseeId,
      eventId,
      totalWeightKg,
      amountPaidToVendor,
      notes,
    });

    // 4️⃣ Delete the vendor event now that settlement is done
    await VendorEvent.findByIdAndDelete(eventId);

    // OR — if you prefer marking it completed:
    // await VendorEvent.findByIdAndUpdate(eventId, { status: 'completed' });

    res.status(201).json({
      message: "Settlement recorded & event closed",
      record,
    });
  } catch (err) {
    console.error("Error creating vendor settlement:", err);
    res.status(500).json({ message: "Server error creating settlement" });
  }
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
    franchisee: franchisee._id,
  });

  if (!submission) {
    return res.status(404).json({ message: "Submission not found" });
  }

  if (!["approved", "collected"].includes(submission.status)) {
    return res.status(400).json({
      message: "Only collected requests can be verified",
    });
  }

  submission.status = "verified";
  await submission.save();

  return res.json({
    message: "Submission verified successfully",
    submission,
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
    franchisee: franchisee._id,
  });

  if (!submission) {
    return res.status(404).json({ message: "Submission not found" });
  }

  if (submission.status !== "verified") {
    return res.status(400).json({
      message: "Only verified requests can be marked paid",
    });
  }

  submission.status = "paid";
  await submission.save();

  return res.json({
    message: "Vendor marked as paid",
    submission,
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
    return res
      .status(404)
      .json({ message: "Submission not found or unauthorized" });

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
