const catchAsyncErrors = require("./catchAsyncErrors");
const ErrorHandler = require("../utils/errorhandler");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// Middleware to check if the user is authenticated
exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies; // Destructure token from cookies

  // If token is not found, return an authentication error
  if (!token) {
    return next(new ErrorHandler("Please Login to access this resource", 401)); // Added 401 status code for unauthorized access
  }

  // Verify token and decode data
  const { id } = jwt.verify(token, process.env.JWT_SECRET);

  // Attach user information to the request object
  req.user = await User.findById(id);

  // If user is not found (which should be unlikely if the token is valid)
  if (!req.user) {
    return next(new ErrorHandler("User not found", 404));
  }

  next(); // Proceed to the next middleware
});

// Middleware to authorize user roles
exports.authorizeRoles = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    // If user's role is not authorized, return forbidden error
    return next(
      new ErrorHandler(`Role: ${req.user.role} is not allowed to access this resource`, 403)
    );
  }

  next(); // Proceed if authorized
};
