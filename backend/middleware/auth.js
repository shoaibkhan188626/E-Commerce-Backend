const catchAsyncErrors = require("./catchAsyncErrors");
const ErrorHandler = require("../utils/errorhandler");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// Middleware to check if the user is authenticated
exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  // Retrieve token from cookies
  const { token } = req.cookies;
  
  // Check if token is present
  if (!token) {
    return next(new ErrorHandler("Please Login to access this resource"));
  }

  // Verify token using JWT secret
  const decodedData = jwt.verify(token, process.env.JWT_SECRET);

  // Find user by ID from the token
  req.user = await User.findById(decodedData.id);
  
  // Proceed to the next middleware or route handler
  next();
});

// Middleware to authorize user roles
// Allows access only to users with specified roles
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // Check if the user's role is included in the allowed roles
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role: ${req.user.role} is not allowed to access this resource`,
          403
        )
      );
    }

    // Proceed to the next middleware or route handler
    next();
  };
};
