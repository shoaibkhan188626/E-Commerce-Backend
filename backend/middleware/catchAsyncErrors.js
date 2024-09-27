module.exports = (theFunc) => (req, res, next) => {
  // Wrap the given function (theFunc) in a promise
  // This ensures that any errors are caught and passed to the error-handling middleware
  Promise.resolve(theFunc(req, res, next)).catch(next);
};
