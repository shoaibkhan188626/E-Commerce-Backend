const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { field } = require("../utils/fieldFiller"); // Importing the field function

// Define the schema for a user
const userSchema = new mongoose.Schema({
  // User's name
  name: field(String, {
    required: [true, "Please enter your name"],
    maxLength: [30, "Name cannot exceed 30 characters"],
    minLength: [4, "Name should be more than 4 characters"],
  }),

  // User's email address
  email: field(String, {
    required: [true, "Please enter your email address"],
    unique: true, // Indexing for unique email
    validate: [validator.isEmail, "Please enter a valid email address"], // Validate the email format
  }),

  // User's password
  password: field(String, {
    required: [true, "Please Enter Your Password"],
    minLength: [8, "Password should be greater than 8 characters"],
    select: false, // Exclude password from query results by default
  }),

  // User's avatar
  avatar: {
    public_id: field(String, { required: false }),
    url: field(String, { required: true }), // Avatar URL is required
  },

  // User's status (e.g., Pending or Active)
  status: field(String, {
    enum: ["Pending", "Active"],
    default: "Pending",
    index: true, // Indexing for quick status queries
  }),

  // User's confirmation code for account verification
  confirmationCode: field(String, {
    unique: true, // Must be unique
    index: true, // Indexing for confirmation codes
    required: false,
  }),

  // User's role (e.g., user, admin)
  role: field(String, {
    default: "user",
    index: true, // Indexing roles
  }),

  // Date when the user was created
  createdAt: field(Date, {
    default: Date.now, // Automatically set to the current date and time
  }),

  // Password reset token and expiry date
  resetPasswordToken: field(String, { index: true, required: false }),
  resetPasswordExpire: field(Date, { required: false }),
});

// Pre-save middleware to hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// Method to generate a JWT token
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Method to compare provided password with stored hashed password
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Method to generate a password reset token
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // Token valid for 15 minutes

  return resetToken;
};

// Export the User model based on the schema
module.exports = mongoose.model("User", userSchema);
