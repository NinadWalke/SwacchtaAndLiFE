const User = require("../schemas/User");

// Get user profile by ID
exports.getUserProfile = async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id).select(
    "-password -otp -otpExpires" // remove sensitive fields
  );

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.status(200).json({ user });
};

// Update user profile by ID
exports.updateUserProfile = async (req, res) => {
  const { id } = req.params;

  const {
    fname,
    lname,
    dob,
    gender,
    address,
    phone,
    email,
    aadhar,
    profileImg,
  } = req.body;

  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Apply updates if present
  if (fname) user.fname = fname;
  if (lname) user.lname = lname;
  if (dob) user.dob = dob;
  if (gender) user.gender = gender;
  if (address) user.address = address;
  if (phone) user.phone = phone;
  if (email) user.email = email;
  if (aadhar) user.aadhar = aadhar;
  if (profileImg) user.profileImg = profileImg;

  try {
    await user.save();
    return res.status(200).json({
      message: "Profile updated successfully",
      user,
    });
  } catch (err) {
    // Duplicate key handling (email, phone, etc.)
    if (err.code === 11000) {
      const duplicateField = Object.keys(err.keyPattern)[0];
      return res
        .status(400)
        .json({ message: `${duplicateField} already exists.` });
    }

    return res.status(500).json({ message: "Server error" });
  }
};
