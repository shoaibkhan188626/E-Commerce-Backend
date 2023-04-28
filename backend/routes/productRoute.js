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

//get all products...
router.route("/products").get(getAllProducts);

//get all products for admin
router
  .route("/admin/products")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAdminProducts);

//create new product...
router
  .route("/admin/product/new")
  .post(isAuthenticatedUser, authorizeRoles("admin"), createProduct);

//update product...
router
  .route("/admin/product/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);

//get product details
router.route("/product/:id").get(getProductDetails);

//product review...
router.route("/review").put(isAuthenticatedUser, createProductReview);

router
  .route("/review")
  .get(getProductReviews)
  .delete(isAuthenticatedUser, deleteReview);

module.exports = router;
