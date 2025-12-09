const Committee = require("../schemas/Committee");
const User = require("../schemas/User");
const Event = require("../schemas/Event");
const Report = require("../schemas/Report");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const geocodeAddress = require("../utils/mapboxConfig");

const { sendEmail } = require("../utils/emails");
const { sendSMS } = require("../utils/twilio");

const JWT_SECRET = process.env.JWT_SECRET;

exports.getAllCommittees = async (req, res) => {
  const allCommittees = await Committee.find();
  res.json(allCommittees);
};

exports.approveCommitteee = async (req, res) => {
  const { cid } = req.params;
  const committeeToBeApproved = await Committee.findById(cid);
  committeeToBeApproved.isCommitteeVerified = true;
  committeeToBeApproved.save();
  res.json({ approvedCommittee: committeeToBeApproved });
};

exports.rejectCommittee = async (req, res) => {
  const { cid } = req.params;
  const committeeToBeRejected = await Committee.findById(cid);
  committeeToBeRejected.isCommitteeVerified = false;
  committeeToBeRejected.save();
  res.json({ approvedCommittee: committeeToBeRejected });
};

exports.registerCommittee = async (req, res) => {
  try {
    const {
      committeeName,
      description,
      localityType,
      approxHouseholds,

      leaderName,
      leaderEmail,
      leaderPhone,
      alternatePhone,

      line1,
      line2,
      area,
      city,
      district,
      state,
      pincode,
      landmark,

      password,
      confirmPassword,
    } = req.body;

    if (
      !committeeName ||
      !leaderEmail ||
      !password ||
      !confirmPassword ||
      !leaderName
    ) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const existingCommittee = await Committee.findOne({ leaderEmail });
    if (existingCommittee) {
      return res.status(400).json({
        message: "A committee with this leader email already exists",
      });
    }
    const loc = await geocodeAddress(
      `${line1}, ${area}, ${city}, ${state}, ${pincode}`
    );
    const committee = new Committee({
      committeeName,
      description,
      localityType,
      approxHouseholds,

      leaderName,
      leaderEmail,
      leaderPhone,
      alternatePhone,

      address: {
        line1,
        line2,
        area,
        city,
        district,
        state,
        pincode,
        landmark,
      },
      committeeLocation: {
        type: "Point",
        coordinates: [loc.longitude, loc.latitude],
        address: loc.placeName,
      },
      password,
      committeeStatus: "PENDING",
      isKycVerified: false,
      isCommitteeVerified: false,
    });

    const dbUser = await User.findById(req.user._id);
    if (!dbUser) {
      return res.status(401).json({ message: "User not found" });
    }

    committee.members.push(dbUser._id);
    dbUser.committee = committee._id;

    await committee.save();
    await dbUser.save();

    const emailHTML = `
      <h2>Committee Registration Received</h2>
      <p>Hi <strong>${leaderName}</strong>,</p>
      <p>Thank you for registering <strong>${committeeName}</strong> as a Green Committee.</p>
      <p>Your application is currently <b>PENDING</b> and will be reviewed shortly.</p>
      <br/>
      <p><strong>Committee ID:</strong> ${committee._id}</p>
      <p>Use this ID to check your committee status.</p>
      <br/>
      <p>We will contact you soon regarding verification and approval.</p>
      <p>Regards,<br/>Aspirely Team</p>
    `;

    await sendEmail(leaderEmail, "Committee Registration Received", emailHTML);

    // await sendSMS(
    //   leaderPhone,
    //   `Your committee "${committeeName}" has been put on hold for registration.\nCommittee ID: ${committee._id}\nWe'll contact you soon for verification.`
    // );

    return res.status(201).json({
      message: "Committee registered successfully. We'll get back to you soon!",
      committee: {
        id: committee._id,
        committeeName,
        leaderEmail,
        leaderName,
        committeeStatus: committee.committeeStatus,
      },
    });
  } catch (err) {
    console.error("Committee Registration Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
// Login an existing committee
exports.loginCommittee = async (req, res) => {
  const { leaderEmail, password } = req.body;

  if (!leaderEmail || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  // Committee lookup
  const committee = await Committee.findOne({ leaderEmail }).select(
    "+password"
  );
  if (!committee) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  // Compare passwords
  const isMatch = await bcrypt.compare(password, committee.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  // Generate token
  const token = jwt.sign(
    {
      id: committee._id,
      leaderEmail: committee.leaderEmail,
      committeeName: committee.committeeName,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  return res.status(200).json({
    message: "Login successful",
    committee: {
      id: committee._id,
      committeeName: committee.committeeName,
      leaderEmail: committee.leaderEmail,
    },
    token,
  });
};

// Get committee details (protected route)
exports.getCommitteeProfile = async (req, res) => {
  const committee = await Committee.findById(req.user.committeeId).populate("members");
  return res.json({ committee });
};

exports.getCommitteeStatus = async (req, res) => {
  const { id } = req.params;
  const committeeToBeChecked = await Committee.findById(id);
  const { isKycVerified, isCommitteeVerified, committeeStatus, committeeName } =
    committeeToBeChecked;
  return res.json({
    isKycVerified,
    isCommitteeVerified,
    committeeStatus,
    committeeName,
  });
};

exports.getCommitteeData = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Fetch committee
    const committee = await Committee.findById(id);
    if (!committee) {
      return res.status(404).json({ message: "Committee not found" });
    }

    const { coordinates } = committee.committeeLocation;

    // SAFETY CHECK
    if (!coordinates || coordinates.length !== 2) {
      return res
        .status(400)
        .json({ message: "Committee does not have a valid location saved." });
    }

    const lng = coordinates[0];
    const lat = coordinates[1];

    // 2. Query reports NEAR the committee center (radius = 1500m)
    const reports = await Report.find({
      location: {
        $geoWithin: {
          $centerSphere: [[lng, lat], 1.5 / 6371],
          // 1.5km radius — adjust as needed
        },
      },
    });

    // 3. Query events near the committee center (same radius)
    const events = await Event.find({
      "eventLocationData.coordinates": {
        $geoWithin: {
          $centerSphere: [[lng, lat], 1.5 / 6371],
        },
      },
    });

    return res.json({
      committeeLocation: committee.committeeLocation,
      reports,
      events,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

exports.getCommitteeUsers = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Fetch committee
    const committee = await Committee.findById(id).populate("members");
    if (!committee) {
      return res.status(404).json({ message: "Committee not found" });
    }

    // 2. Fetch all users belonging to the committee
    const memberIds = committee.members.map((m) => m._id);

    // 3. Populate their reports
    const users = await User.find({ _id: { $in: memberIds } })
      .populate("reports") // so we can count them
      .select("fname lname email points reports"); // data needed for leaderboard

    // 4. Sort by number of reports (descending)
    const sorted = users.sort(
      (a, b) => (b.reports?.length || 0) - (a.reports?.length || 0)
    );

    // 5. Send back clean leaderboard structure
    return res.json({
      committeeName: committee.committeeName,
      users: sorted,
    });
  } catch (err) {
    console.error("getCommitteeUsers ERROR:", err);
    return res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};
