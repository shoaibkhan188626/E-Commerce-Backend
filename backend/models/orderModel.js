const mongoose = require("mongoose");

// Define the schema for an order
const orderSchema = new mongoose.Schema({
  // Shipping information for the order
  shippingInfo: {
    address: {
      type: String,
      required: true, // Address is required
    },
    city: {
      type: String,
      required: true, // City is required
    },
    state: {
      type: String,
      required: true, // State is required
    },
    country: {
      type: String,
      required: true, // Country is required
    },
    pinCode: {
      type: Number,
      required: true, // PIN Code is required
    },
    phoneNo: {
      type: Number,
      required: true, // Phone Number is required
    },
  },
  // Items included in the order
  orderItems: [
    {
      name: {
        type: String,
        required: true, // Item name is required
      },
      price: {
        type: Number,
        required: true, // Item price is required
      },
      quantity: {
        type: Number,
        required: true, // Quantity of the item is required
      },
      image: {
        type: String,
        required: true, // URL or path to item image is required
      },
      product: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
        required: true, // Reference to the Product model, which is required
      },
    },
  ],
  // User who placed the order
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true, // Reference to the User model, which is required
  },
  // Payment information for the order
  paymentInfo: {
    id: {
      type: String,
      required: true, // Payment ID is required
    },
    status: {
      type: String,
      required: true, // Payment status is required
    },
  },
  // Date and time when the payment was made
  paidAt: {
    type: Date,
    required: true, // Date when payment was made is required
  },
  // Price details for the order
  itemsPrice: {
    type: Number,
    required: true,
    default: 0, // Default to 0 if not specified
  },
  taxPrice: {
    type: Number,
    required: true,
    default: 0, // Default to 0 if not specified
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0, // Default to 0 if not specified
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0, // Default to 0 if not specified
  },
  // Current status of the order
  orderStatus: {
    type: String,
    required: true,
    default: "Processing", // Default status is "Processing"
  },
  // Date and time when the order was delivered
  deliveredAt: Date, // Optional field for when the order was delivered
  // Date and time when the order was created
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set to current date and time
  },
});

// Export the Order model based on the schema
module.exports = mongoose.model("Order", orderSchema);
