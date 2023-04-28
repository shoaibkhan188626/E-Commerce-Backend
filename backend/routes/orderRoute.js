const express = require("express");
const {
  newOrder,
  getsingleOrder,
  myOrders,
  getAllOrders,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController.js");
const router = express.Router();
const {
  isAuthenticatedUser,
  authorizeRoles,
} = require("../middleware/auth.js");

//route for creating a single order
router.route("/order/new").post(isAuthenticatedUser, newOrder);

//admin's route to see all of the orders placed by users
router.route("/order/:id").get(isAuthenticatedUser, getsingleOrder);

//user's route to see his order/s
router.route("/orders/me").get(isAuthenticatedUser, myOrders);

//get all orders -- admin
router
  .route("/admin/orders")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllOrders);

//update or delete orders -- admin
router
  .route("/admin/order/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateOrder)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteOrder);

module.exports = router;
