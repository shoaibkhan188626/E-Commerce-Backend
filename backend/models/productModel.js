const mongoose = require("mongoose");
const { field } = require("../utils/fieldFiller"); // Importing the field function

// Define the schema for a product
const productSchema = new mongoose.Schema({
  // Product name with an index for faster search queries
  name: field(String, {
    required: [true, "Please enter product name"],
    trim: true,
    index: true, // Indexing this field
  }),
  // Product description
  description: field(String, {
    required: [true, "Please enter product description"],
  }),
  // Product price with an index to allow sorting or filtering on price
  price: field(Number, {
    required: [true, "Please enter product price"],
    maxLength: [8, "Product price must be within 8 characters"],
    index: true, // Indexing for better performance when querying by price
  }),
  // Product ratings
  ratings: field(Number, {
    default: 0,
  }),
  // Product images (array of objects)
  images: [
    {
      public_id: field(String, { required: true }),
      url: field(String, { required: true }),
    },
  ],
  // Product category with an index to allow faster category searches
  category: field(String, {
    required: [true, "Please enter product category"],
    index: true, // Indexing this field
  }),
  // Stock quantity
  stock: field(Number, {
    required: [true, "Please enter product stock"],
    maxLength: [4, "Product stock must be within 4 characters"],
    default: 1,
  }),
  // Number of reviews
  numOfReviews: field(Number, {
    default: 0,
  }),
  // Reviews for the product (array of objects)
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
      name: field(String, { required: true }),
      rating: field(Number, { required: true }),
      comment: field(String, { required: true }),
    },
  ],
  // User who added the product
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  // Date and time when the product was created
  createdAt: field(Date, {
    default: Date.now,
  }),
});

// Indexing fields at schema level
productSchema.index({ price: 1, stock: -1 }); // Compound index for sorting by price and stock

// Export the Product model based on the schema
module.exports = mongoose.model("Product", productSchema);
