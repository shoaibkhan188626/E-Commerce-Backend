const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// Define the schema for a user
const userSchema = new mongoose.Schema({
  // User's name
  name: {
    type: String,
    required: [true, "please enter your name"], // Name is required
    maxLength: [30, "name cannot exceed 30 characters"], // Name cannot be longer than 30 characters
    minLength: [4, "name should be more than 4 characters"], // Name must be at least 4 characters
  },
  // User's email address
  email: {
    type: String,
    required: [true, "please enter your email address"], // Email is required
    unique: true, // Email must be unique across users
    validate: [validator.isEmail, "please enter a valid email address"], // Validate the email format
  },
  // User's password
  password: {
    type: String,
    required: [true, "Please Enter Your Password"], // Password is required
    minLength: [8, "Password should be greater than 8 characters"], // Password must be at least 8 characters
    select: false, // Exclude password from query results by default
  },
  // User's avatar
  avatar: {
    public_id: {
      type: String,
      required: false, // Public ID for the avatar (optional)
    },
    url: {
      type: String,
      required: true, // URL for the avatar is required
    },
  },
  // User's status (e.g., Pending or Active)
  status: {
    type: String,
    enum: ["Pending", "Active"], // Status can only be either "Pending" or "Active"
    default: "Pending", // Default status is "Pending"
  },
  // User's confirmation code for account verification
  confirmationCode: {
    type: String,
    unique: true, // Confirmation code must be unique
  },
  // User's role (e.g., user, admin)
  role: {
    type: String,
    default: "user", // Default role is "user"
  },
  // Date when the user was created
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set to current date and time
  },
  // Password reset token and expiry date
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

// Pre-save middleware to hash password before saving
userSchema.pre("save", async function (next) {
  // Only hash the password if it has been modified or is new
  if (!this.isModified("password")) {
    next();
  }

  // Hash the password using bcrypt
  this.password = await bcrypt.hash(this.password, 10);
});

// Method to generate a JWT token
userSchema.methods.getJWTToken = function () {
  // Create and return a JWT token
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE, // Set expiration time from environment variable
  });
};

// Method to compare provided password with stored hashed password
userSchema.methods.comparePassword = async function (password) {
  // Compare the provided password with the hashed password
  return await bcrypt.compare(password, this.password);
};

// Method to generate a password reset token
userSchema.methods.getResetPasswordToken = function () {
  // Generate a random token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash the token and set it to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set the expiration time for the reset token
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes from now

  // Return the plain token
  return resetToken;
};

// Export the User model based on the schema
module.exports = mongoose.model("User", userSchema);
