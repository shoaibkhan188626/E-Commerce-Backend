const express = require("express");
const {
  newOrder,
  getSingleOrder,
  myOrders,
  getAllOrders,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController.js"); // Importing order-related controller functions
const router = express.Router(); // Create an Express router instance
const {
  isAuthenticatedUser,
  authorizeRoles,
} = require("../middleware/auth.js"); // Importing authentication and authorization middleware

// Route to create a new order
router.route("/order/new").post(isAuthenticatedUser, newOrder); // Requires user to be authenticated

// Route to get details of a single order by ID
router.route("/order/:id").get(isAuthenticatedUser, getSingleOrder); // Requires user to be authenticated

// Route to get all orders placed by the authenticated user
router.route("/orders/me").get(isAuthenticatedUser, myOrders); // Requires user to be authenticated

// Route to get all orders -- accessible only to admin
router
  .route("/admin/orders")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllOrders); // Requires user to be authenticated and must be an admin

// Routes to update or delete a specific order by ID -- accessible only to admin
router
  .route("/admin/order/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateOrder) // Requires user to be authenticated and must be an admin
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteOrder); // Requires user to be authenticated and must be an admin

module.exports = router; // Export the router to use in other parts of the application
