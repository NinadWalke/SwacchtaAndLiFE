const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const committeeSchema = new mongoose.Schema(
  {
    committeeName: {
      type: String,
      required: [true, "Committee name is required"],
      unique: true,
      trim: true,
    },
    leaderEmail: {
      type: String,
      required: [true, "Leader email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false, 
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
      }
    ],    
  },
  { timestamps: true }
);

committeeSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

committeeSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

committeeSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const Committee = new mongoose.model("Committee", committeeSchema);

module.exports = Committee;
