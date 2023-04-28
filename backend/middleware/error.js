const ErrorHandler = require("../utils/errorhandler.js");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  //wrong id in mongo db
  if (err.name === "CastError") {
    const message = `resource not found. invalid ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  //mongoose duplicate key error...
  if (err.code === 11000) {
    const messgae = `Duplicate ${Object.keys(err.keyValue)} entered`;
    err = new ErrorHandler(messgae, 400);
  }

  //wrong jwt error
  if (err.code === "jsonWebTokenError") {
    const messgae = `json web token is invalid try again`;
    err = new ErrorHandler(messgae, 400);
  }

  //jwt expired error
  if (err.code === "TokenExpiredError") {
    const messgae = `json web token is expired try again`;
    err = new ErrorHandler(messgae, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    //.stack ill show exactly where is the problem down to it's location will remove it in the when final build is done.
  });
};
