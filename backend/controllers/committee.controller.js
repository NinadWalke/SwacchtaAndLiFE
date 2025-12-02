const Committee = require("../schemas/Committee");
const User = require("../schemas/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const JWT_SECRET = process.env.JWT_SECRET;

// Register a new committee
exports.registerCommittee = async (req, res) => {
  // update this with a ton of fields.
  const { committeeName, leaderEmail, password, confirmPassword } = req.body;

  if (!committeeName || !leaderEmail || !password || !confirmPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  const existingCommittee = await Committee.findOne({ leaderEmail });
  if (existingCommittee) {
    return res.status(400).json({
      message: "Committee leader already registered",
    });
  }

  // Create committee
  const committee = new Committee({
    committeeName,
    leaderEmail,
    password,
  });

  // Attach logged-in user as the first committee member
  const dbUser = await User.findById(req.user._id);
  if (!dbUser) {
    return res.status(401).json({ message: "Committee Leader undefined" });
  }

  committee.members.push(dbUser._id);
  dbUser.committee = committee._id;

  await committee.save();
  await dbUser.save();

  // JWT token for committee
  const token = jwt.sign(
    {
      id: committee._id,
      leaderEmail: committee.leaderEmail,
      committeeName: committee.committeeName,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  // twilio integration here too
  return res.status(201).json({
    message: "Committee registered successfully. We'll get back to you soon!",
    committee: {
      id: committee._id,
      committeeName: committee.committeeName,
      leaderEmail: committee.leaderEmail,
    },
    token,
  });
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
  const committee = await Committee.findById(req.user.committeeId);
  return res.json({ committee });
};
