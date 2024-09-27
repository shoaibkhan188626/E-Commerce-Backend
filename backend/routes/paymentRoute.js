const express = require("express");
const {
  processPayment,
  sendStripeApiKey,
} = require("../controllers/paymentController"); // Importing payment-related controller functions
const router = express.Router(); // Create an Express router instance
const { isAuthenticatedUser } = require("../middleware/auth"); // Importing authentication middleware

// Route to process a payment
router.route("/payment/process")
  .post(isAuthenticatedUser, processPayment); // Requires user to be authenticated

// Route to get the Stripe API key
router.route("/stripeapikey")
  .get(isAuthenticatedUser, sendStripeApiKey); // Requires user to be authenticated

module.exports = router; // Export the router to use in other parts of the application
