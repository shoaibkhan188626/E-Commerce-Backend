const ErrorHandler = require("../utils/errorhandler.js");

// Middleware for handling errors
module.exports = (err, req, res, next) => {
  // Set default status code and message for the error
  err.statusCode = err.statusCode || 500; // Default to 500 if no status code is set
  err.message = err.message || "Internal Server Error"; // Default error message

  // Handle Mongoose CastError (e.g., invalid ObjectId)
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid ${err.path}`; // Construct custom error message
    err = new ErrorHandler(message, 400); // Set the error with a 400 status code
  }

  // Handle Mongoose duplicate key error (e.g., duplicate email)
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} entered`; // Extract the field that caused the error
    err = new ErrorHandler(message, 400); // Set the error with a 400 status code
  }

  // Handle JSON Web Token (JWT) errors
  if (err.code === "jsonWebTokenError") {
    const message = `JSON Web Token is invalid. Try again`; // Custom message for invalid JWT
    err = new ErrorHandler(message, 400); // Set the error with a 400 status code
  }

  // Handle JWT expiration errors
  if (err.code === "TokenExpiredError") {
    const message = `JSON Web Token has expired. Try again`; // Custom message for expired JWT
    err = new ErrorHandler(message, 400); // Set the error with a 400 status code
  }

  // Send the error response
  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    // .stack will show the exact location of the error in development but should be removed in production
  });
};
