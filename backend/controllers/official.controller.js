const Franchisee = require("../schemas/Franchisee");
const User = require("../schemas/User");
const geocodeAddress = require("../utils/mapboxConfig");

module.exports.createFranchisee = async (req, res) => {
  try {
    const { ownerEmail, centerName, phone, address, pincode } = req.body;

    // Validate required fields
    if (!ownerEmail || !centerName || !phone || !address || !pincode) {
      return res.status(400).json({
        message: "All fields (ownerEmail, centerName, phone, address, pincode) are required."
      });
    }

    // 1. Find owner by email
    const owner = await User.findOne({ email: ownerEmail });
    if (!owner) {
      return res.status(404).json({ message: "No user found with that email" });
    }

    // 2. Auto-set their role to osp if not already
    if (owner.role !== "osp") {
      owner.role = "osp";
      await owner.save();
    }

    // 3. Geocode address (Same logic you use for Events)
    const fullAddress = `${address}, ${pincode}`;
    const loc = await geocodeAddress(fullAddress);

    if (!loc || !loc.longitude || !loc.latitude) {
      return res.status(400).json({
        message: "Failed to geocode address. Please check address/pincode."
      });
    }

    // 4. Create franchisee document
    const franchisee = await Franchisee.create({
      owner: owner._id,
      centerName,
      phone,
      address,
      pincode,
      location: {
        type: "Point",
        coordinates: [loc.longitude, loc.latitude]
      },
      serviceablePincodes: [pincode]
    });

    return res.status(201).json({
      message: "Franchisee created successfully",
      franchisee
    });

  } catch (err) {
    console.error("Error creating franchisee:", err);
    return res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};
