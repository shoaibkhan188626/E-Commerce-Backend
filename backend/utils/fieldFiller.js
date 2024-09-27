const field = (type, options = {}) => {
  return {
    type,
    required: options.required !== undefined ? options.required : true,
    ...options,
  };
};

module.exports = { field };
