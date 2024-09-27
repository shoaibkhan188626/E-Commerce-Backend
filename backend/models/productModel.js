const mongoose = require("mongoose");

// Define the schema for a product
const productSchema = mongoose.Schema({
  // Product name
  name: {
    type: String,
    required: [true, "please enter product name"], // Name is required
    trim: true, // Trim whitespace from the beginning and end of the name
  },
  // Product description
  description: {
    type: String,
    required: [true, "please Enter product Description"], // Description is required
  },
  // Product price
  price: {
    type: Number,
    required: [true, "please enter product price"], // Price is required
    maxLength: [8, "product price must be within 8 characters"], // Price should not exceed 8 characters
  },
  // Product ratings
  ratings: {
    type: Number,
    default: 0, // Default rating is 0
  },
  // Product images
  images: [
    {
      public_id: {
        type: String,
        required: true, // Image public ID is required
      },
      url: {
        type: String,
        required: true, // Image URL is required
      },
    },
  ],
  // Product category
  category: {
    type: String,
    required: [true, "please enter product category"], // Category is required
  },
  // Stock quantity
  stock: {
    type: Number,
    required: [true, "please enter product stock"], // Stock is required
    maxLength: [4, "product stock must be within 4 characters"], // Stock quantity should not exceed 4 characters
    default: 1, // Default stock is 1
  },
  // Number of reviews
  numOfReviews: {
    type: Number,
    default: 0, // Default number of reviews is 0
  },
  // Reviews for the product
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true, // Reference to the User model, which is required
      },
      name: {
        type: String,
        required: true, // Reviewer's name is required
      },
      rating: {
        type: Number,
        required: true, // Rating is required
      },
      comment: {
        type: String,
        required: true, // Comment is required
      },
    },
  ],
  // User who added the product
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true, // Reference to the User model, which is required
  },
  // Date and time when the product was created
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set to the current date and time
  },
});

// Export the Product model based on the schema
module.exports = mongoose.model("Product", productSchema);
