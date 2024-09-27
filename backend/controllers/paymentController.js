const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); // Initialize Stripe

// Process payment using Stripe
exports.processPayment = catchAsyncErrors(async (req, res, next) => {
  const { amount } = req.body; // Destructure the amount from request body

  // Create a payment intent with the specified amount and currency
  const myPayment = await stripe.paymentIntents.create({
    amount, // Charge amount in smallest currency unit (e.g., paise for INR)
    currency: "inr", // Fixed currency for payment
    metadata: { company: "Ecommerce" }, // Additional metadata
  });

  // Send back the client secret to complete the payment
  res.status(200).json({
    success: true,
    clientSecret: myPayment.client_secret, // Client secret to finalize payment on client-side
  });
});

// Send the Stripe API key to the client
exports.sendStripeApiKey = catchAsyncErrors(async (req, res, next) => {
  res.status(200).json({
    stripeApiKey: process.env.STRIPE_API_KEY, // Send the public API key
  });
});
