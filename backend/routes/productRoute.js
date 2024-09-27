const express = require("express");

const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
  getAdminProducts,
  createProductReview,
  deleteReview,
  getProductReviews,
} = require("../controllers/productController.js");

const {
  isAuthenticatedUser,
  authorizeRoles,
} = require("../middleware/auth.js");

const router = express.Router();

// Route to get all products
router.route("/products").get(getAllProducts);

// Route to get all products for admin only
router
  .route("/admin/products")
  .get(
    isAuthenticatedUser,          // Middleware to ensure user is authenticated
    authorizeRoles("admin"),       // Middleware to authorize only admin users
    getAdminProducts               // Controller function to handle the request
  );

// Route to create a new product
router
  .route("/admin/product/new")
  .post(
    isAuthenticatedUser,          // Middleware to ensure user is authenticated
    authorizeRoles("admin"),       // Middleware to authorize only admin users
    createProduct                 // Controller function to handle the request
  );

// Route to update or delete a product by ID
router
  .route("/admin/product/:id")
  .put(
    isAuthenticatedUser,          // Middleware to ensure user is authenticated
    authorizeRoles("admin"),       // Middleware to authorize only admin users
    updateProduct                 // Controller function to handle the request
  )
  .delete(
    isAuthenticatedUser,          // Middleware to ensure user is authenticated
    authorizeRoles("admin"),       // Middleware to authorize only admin users
    deleteProduct                 // Controller function to handle the request
  );

// Route to get details of a specific product by ID
router.route("/product/:id").get(getProductDetails);

// Route to create or manage product reviews
router
  .route("/review")
  .put(
    isAuthenticatedUser,          // Middleware to ensure user is authenticated
    createProductReview           // Controller function to handle the request
  )
  .get(getProductReviews)         // Controller function to get reviews for a product
  .delete(
    isAuthenticatedUser,          // Middleware to ensure user is authenticated
    deleteReview                  // Controller function to delete a review
  );

module.exports = router;
