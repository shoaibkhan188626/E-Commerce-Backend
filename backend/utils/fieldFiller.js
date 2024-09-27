const mongoose = require('mongoose')
const validTypes = [String, Number, Date, Boolean, mongoose.Schema.Types.ObjectId];

const field = (type, options = {}) => {
  // Check if the provided type is a valid Mongoose type
  if (!validTypes.includes(type)) {
    throw new Error("Invalid type provided for Mongoose field.");
  }

  // Return the field definition object
  return {
    type,
    required: options.required !== undefined ? options.required : true, // Default to true if not specified
    unique: options.unique || false, // Add unique option, defaulting to false
    default: options.default !== undefined ? options.default : null, // Default to null if not specified
    ...options, // Spread any additional options provided
  };
};

module.exports = { field };
