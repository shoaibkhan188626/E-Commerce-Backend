const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); // Initialize Stripe with the secret key from environment variables

// Process payment using Stripe
exports.processPayment = catchAsyncErrors(async (req, res, next) => {
  // Create a payment intent with the specified amount and currency
  const myPayment = await stripe.paymentIntents.create({
    amount: req.body.amount, // Amount to be charged in the smallest currency unit (e.g., paise for INR)
    currency: "inr", // Currency for the payment
    metadata: {
      company: "Ecommerce", // Metadata to attach to the payment intent
    },
  });

  // Respond with success status and the client secret for the payment
  res.status(200).json({
    success: true,
    client_secret: myPayment.client_secret, // Client secret used to complete the payment on the client side
  });
});

// Send the Stripe API key to the client
exports.sendStripeApiKey = catchAsyncErrors(async (req, res, next) => {
  // Respond with the Stripe API key from environment variables
  res.status(200).json({
    stripeApiKey: process.env.STRIPE_API_KEY, // Public API key for Stripe (used on the client side)
  });
});
