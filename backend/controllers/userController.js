const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary");

// Register a User
// Handles user registration, including uploading avatar to Cloudinary
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  // Upload avatar image to Cloudinary
  const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
    folder: "avatars",
    width: 150,
    crop: "scale",
  });

  const { name, email, password } = req.body;

  // Create a new user with provided details and avatar
  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
  });

  // Send authentication token in response
  sendToken(user, 201, res);
});

// Login User
// Handles user login by validating email and password, and sends token if credentials are correct
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if both email and password are provided
  if (!email || !password) {
    return next(new ErrorHandler("Please Enter Email & Password", 400));
  }

  // Find user by email and select the password field
  const user = await User.findOne({ email }).select("+password");

  // Check if user exists and password matches
  if (!user || !(await user.comparePassword(password))) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  // Send authentication token in response
  sendToken(user, 200, res);
});

// Logout User
// Handles user logout by clearing the authentication token cookie
exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});

// Forgot Password
// Sends a password reset token to the user's email if the email is registered
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  // Find user by email
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Generate and save a reset password token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${process.env.FRONTEND_URL||"http://localhost:3000"}/password/reset/${resetToken}`;

  const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

  try {
    // Send reset password email
    await sendEmail({
      email: user.email,
      subject: `Ecommerce Password Recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    // Clear reset token and expiry if email sending fails
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});

// Reset Password
// Resets the user's password using a valid reset token
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  // Create a hash of the reset token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  // Find user with valid reset token and expiry
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler("Reset Password Token is invalid or has been expired", 400)
    );
  }

  // Check if the new password and confirmation match
  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not match", 400));
  }

  // Update user password and clear reset token and expiry
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  // Send authentication token in response
  sendToken(user, 200, res);
});

// Get User Detail
// Retrieves the details of the currently logged-in user
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  // Find user by ID
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

// Update User Password
// Allows the user to change their password
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  // Find user and select password field
  const user = await User.findById(req.user.id).select("+password");

  // Check if the old password matches
  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old password is incorrect", 400));
  }

  // Check if new password and confirmation match
  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not match", 400));
  }

  // Update password and save
  user.password = req.body.newPassword;
  await user.save();

  // Send authentication token in response
  sendToken(user, 200, res);
});

// Update User Profile
// Allows users to update their profile information and avatar
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  // Check if a new avatar is provided
  if (req.body.avatar !== "") {
    const user = await User.findById(req.user.id);

    // Remove old avatar from Cloudinary
    const imageId = user.avatar.public_id;
    await cloudinary.v2.uploader.destroy(imageId);

    // Upload new avatar to Cloudinary
    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });

    newUserData.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }

  // Update user profile with new data
  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

// Get all users (admin)
// Retrieves a list of all users for admin purposes
exports.getAllUser = catchAsyncErrors(async (req, res, next) => {
  // Find all users
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
});

// Get single user (admin)
// Retrieves details of a specific user by ID for admin purposes
exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
  // Find user by ID
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorHandler(`User does not exist with Id: ${req.params.id}`));
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// Update User Role -- Admin
// Allows admin to update the role of a user
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  // Update user with new role
  await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

// Delete User -- Admin
// Allows admin to delete a user and remove their avatar from Cloudinary
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  // Find user by ID
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 400));
  }

  // Remove user's avatar from Cloudinary
  const imageId = user.avatar.public_id;
  await cloudinary.v2.uploader.destroy(imageId);

  // Delete user
  await user.remove();

  res.status(200).json({
    success: true,
    message: "User Deleted Successfully",
  });
});
