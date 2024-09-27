const Product = require("../models/productModel.js");
const ErrorHandler = require("../utils/errorhandler.js");
const catchAsyncErrors = require("../middleware/catchAsyncErrors.js");
const ApiFeatures = require("../utils/apifeatures.js");
const cloudinary = require("cloudinary");

// Create a new product -- ADMIN
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
  let images = [];

  // Check if images are provided as a single string or array of strings
  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  const imagesLinks = [];

  // Upload each image to Cloudinary and store the result
  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "products", // Folder in Cloudinary where images will be stored
    });

    imagesLinks.push({
      public_id: result.public_id, // Public ID of the image
      url: result.secure_url, // URL of the image
    });
  }

  req.body.images = imagesLinks; // Update the images field in the request body
  req.body.user = req.user.id; // Add the user ID to the request body

  // Create the new product in the database
  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product, // Return the created product
  });
});

// Get all products for admin
exports.getAdminProducts = catchAsyncErrors(async (req, res, next) => {
  const products = await Product.find(); // Fetch all products from the database

  res.status(200).json({
    success: true,
    products, // Return all products
  });
});

// Get all products with pagination and filtering
exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {
  const resultPerPage = 10;
  const productsCount = await Product.countDocuments();

  const apiFeatures = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter();
  let products = await apiFeatures.query;
  let filteredProductsCount = products.length;
  apiFeatures.pagination(resultPerPage);
  products = await apiFeatures.query;

  res.status(200).json({
    success: true,
    products,
    productsCount,
    resultPerPage,
    filteredProductsCount,
  });
});




// Get details of a single product
exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id); // Fetch product by ID

  if (!product) {
    return next(new ErrorHandler("Product not found", 404)); // Handle case where product is not found
  }

  res.status(200).json({
    success: true,
    product, // Return product details
  });
});

// Update product details -- ADMIN
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id); // Fetch product by ID

  if (!product) {
    return next(new ErrorHandler("Product not found", 404)); // Handle case where product is not found
  }

  // Update product with new data
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true, // Return updated product
    runValidators: true, // Apply validation rules
    useFindAndModify: false, // Use native MongoDB methods
  });

  res.status(200).json({
    success: true,
    product, // Return updated product
  });
});

// Delete a product -- ADMIN
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id); // Fetch product by ID

  if (!product) {
    return next(new ErrorHandler("Product not found", 404)); // Handle case where product is not found
  }

  await product.remove(); // Delete product from database

  res.status(200).json({
    success: true,
    message: "Product deleted successfully", // Return success message
  });
});

// Create or update a product review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id, // ID of the user writing the review
    name: req.user.name, // Name of the user writing the review
    rating: Number(rating), // Rating given in the review
    comment, // Comment text
  };

  const product = await Product.findById(productId); // Fetch product by ID
  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  // Update existing review if it exists
  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    product.reviews.push(review); // Add new review
    product.numOfReviews = product.reviews.length; // Update number of reviews
  }

  let avg = 0;

  // Calculate average rating
  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  product.ratings = avg / product.reviews.length; // Update product rating

  await product.save({ validateBeforeSave: false }); // Save updated product

  res.status(200).json({
    success: true, // Return success status
  });
});

// Get all reviews for a product
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.id); // Fetch product by ID

  if (!product) {
    return next(new ErrorHandler("Product not found", 404)); // Handle case where product is not found
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews, // Return product reviews
  });
});

// Delete a review
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.productId); // Fetch product by ID

  if (!product) {
    return next(new ErrorHandler("Product not found", 404)); // Handle case where product is not found
  }

  // Filter out the review to be deleted
  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  let avg = 0;

  // Calculate average rating after deletion
  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  let ratings = 0;

  if (reviews.length === 0) {
    ratings = 0; // Set ratings to 0 if no reviews are left
  } else {
    ratings = avg / reviews.length; // Calculate new average rating
  }

  const numOfReviews = reviews.length; // Update number of reviews

  // Update product with new reviews, ratings, and number of reviews
  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true, // Return updated product
      runValidators: true, // Apply validation rules
      useFindAndModify: false, // Use native MongoDB methods
    }
  );

  res.status(200).json({
    success: true, // Return success status
  });
});
