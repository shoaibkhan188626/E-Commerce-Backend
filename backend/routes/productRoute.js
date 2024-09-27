const express = require("express");
const rateLimit = require("express-rate-limit");

const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getAdminProducts,
  createProductReview,
  deleteReview,
  getProductReviews,
  getProductsDetails,
  aggregateProductStats,
  aggregateProductsByCategory,
  aggregateProductsWithPagination,
} = require("../controllers/productController.js");

const {
  isAuthenticatedUser,
  authorizeRoles,
} = require("../middleware/auth.js");

const router = express.Router();

// Apply rate limiter to limit requests
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});

// Route to get all products with limiter and cache middleware
router.route("/products").get(limiter, getAllProducts);

// Admin routes for product management
router
  .route("/admin/products")
  .get(
    limiter,
    isAuthenticatedUser,
    authorizeRoles("admin"),
    getAdminProducts
  );

router
  .route("/admin/product/new")
  .post(
    limiter,
    isAuthenticatedUser,
    authorizeRoles("admin"),
    createProduct
  );

router
  .route("/admin/product/:id")
  .put(
    limiter,
    isAuthenticatedUser,
    authorizeRoles("admin"),
    updateProduct
  )
  .delete(
    limiter,
    isAuthenticatedUser,
    authorizeRoles("admin"),
    deleteProduct
  );

// Route to get details of a specific product by ID
router.route("/product/:id").get(limiter, getProductsDetails);

// Routes to manage product reviews
router
  .route("/review")
  .put(
    limiter,
    isAuthenticatedUser,
    createProductReview
  )
  .get(limiter, getProductReviews)
  .delete(
    limiter,
    isAuthenticatedUser,
    deleteReview
  );

// Routes for aggregation stats and category-wise aggregation
router.route("/admin/stats").get(limiter, aggregateProductStats);
router
  .route("/admin/category-stats")
  .get(limiter, aggregateProductsByCategory);

router
  .route("/admin/products-aggregate")
  .get(limiter, aggregateProductsWithPagination);

module.exports = router;
