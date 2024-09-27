const ErrorHandler = require("../utils/errorhandler.js");

// Middleware for handling errors
module.exports = (err, req, res, next) => {
  // Set default status code and message for the error
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // Mongoose CastError: invalid ObjectId
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  // Mongoose Duplicate Key Error: e.g., duplicate email
  if (err.code === 11000) {
    const message = `Duplicate field value entered: ${Object.keys(err.keyValue)}`;
    err = new ErrorHandler(message, 400);
  }

  // JSON Web Token Error: invalid JWT
  if (err.name === "JsonWebTokenError") {
    const message = "Invalid token. Please try again.";
    err = new ErrorHandler(message, 400);
  }

  // JSON Web Token Expired Error: expired JWT
  if (err.name === "TokenExpiredError") {
    const message = "Token has expired. Please log in again.";
    err = new ErrorHandler(message, 400);
  }

  // Send the error response
  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    // Optionally include stack trace in development mode
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};
