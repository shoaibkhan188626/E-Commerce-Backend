const mongoose = require("mongoose");
const { field } = require("../utils/fieldFiller"); // Importing the field function for schema definition

// Define the schema for shipping information
const shippingInfoSchema = new mongoose.Schema({
  address: field(String), // Shipping address as a string
  city: field(String),    // City as a string
  state: field(String),   // State as a string
  country: field(String), // Country as a string
  pinCode: field(Number), // PIN code as a number
  phoneNo: field(Number, {
    required: true, // Phone number is required
    validate: {
      // Custom validation for phone number format (10 digits)
      validator: (v) => /^\d{10}$/.test(v),
      message: (props) => `${props.value} is not a valid phone number!`, // Error message for invalid phone number
    },
  }),
});

// Define the schema for an order
const orderSchema = new mongoose.Schema(
  {
    shippingInfo: shippingInfoSchema, // Embed shipping information schema
    orderItems: [
      {
        name: field(String), // Name of the item as a string
        price: field(Number), // Price of the item as a number
        quantity: field(Number), // Quantity of the item as a number
        image: field(String), // Image URL/path of the item as a string
        product: {
          type: mongoose.Schema.ObjectId, // Reference to the Product model
          ref: "Product",
          required: true, // Product reference is required
        },
      },
    ],
    user: {
      type: mongoose.Schema.ObjectId, // Reference to the User model
      ref: "User",
      required: true, // User reference is required
      index: true, // Create an index for faster queries
    },
    paymentInfo: {
      id: field(String), // Payment ID as a string
      status: field(String), // Payment status as a string
    },
    paidAt: field(Date), // Date when payment was made
    itemsPrice: field(Number, { default: 0 }), // Total price of items, defaults to 0
    taxPrice: field(Number, { default: 0 }), // Total tax price, defaults to 0
    shippingPrice: field(Number, { default: 0 }), // Shipping price, defaults to 0
    totalPrice: field(Number, { default: 0 }), // Total order price, defaults to 0
    orderStatus: {
      type: String, // Status of the order
      required: true, // Status is required
      enum: ["Process", "Shipped", "Delivered", "Cancelled"], // Allowed statuses
      default: "Processing", // Default status is "Processing"
      index: true, // Create an index for faster queries
    },
    deliveredAt: field(Date), // Date when the order was delivered
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Export the Order model based on the schema
module.exports = mongoose.model("Order", orderSchema);
