const User = require("../schemas/User");

// GET /osp/active
exports.getActiveOsps = async (req, res) => {
  try {
    const osps = await User.find({
      role: "osp",
      isOnDuty: true,
    }).select("fname lname phone email isOnDuty");

    return res.status(200).json({
      message: "Active OSP personnel fetched successfully",
      osps,
    });
  } catch (err) {
    console.error("Error fetching active OSPs:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// POST /osp/toggle-duty
exports.toggleDuty = async (req, res) => {
  try {
    const userId = req.user._id; // must come from auth middleware

    const user = await User.findById(userId);

    if (!user || user.role !== "osp") {
      return res.status(403).json({
        message: "Only OSP personnel can toggle duty status",
      });
    }

    user.isOnDuty = !user.isOnDuty;
    await user.save();

    return res.status(200).json({
      message: `Duty status changed to ${
        user.isOnDuty ? "On Duty" : "Off Duty"
      }`,
      isOnDuty: user.isOnDuty,
    });
  } catch (err) {
    console.error("Error toggling OSP duty status:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
