const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

// Create new Order
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  // Create a new order with the provided details
  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(), // Set the payment date
    user: req.user._id, // Associate the order with the logged-in user
  });

  // Respond with success status and the created order
  res.status(201).json({
    success: true,
    order,
  });
});

// Get a single order by ID
exports.getsingleOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  // If the order is not found, return an error
  if (!order) {
    return next(new ErrorHandler("Order not found with this id", 404));
  }

  // Respond with success status and the found order
  res.status(200).json({
    success: true,
    order,
  });
});

// Get all orders for the logged-in user
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
  // Find orders associated with the logged-in user
  const orders = await Order.find({ user: req.user._id });

  // Respond with success status and the user's orders
  res.status(200).json({
    success: true,
    orders,
  });
});

// Get all orders -- admin only
exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
  // Find all orders in the database
  const orders = await Order.find();

  // Calculate the total amount of all orders
  let totalAmount = 0;
  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  // Respond with success status, total amount, and all orders
  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});

// Update order status -- admin only
exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  // If the order is not found, return an error
  if (!order) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }

  // If the order is already delivered, return an error
  if (order.orderStatus === "Delivered") {
    return next(new ErrorHandler("You have already delivered this order", 400));
  }

  // If the status is "Shipped", update the stock of the products in the order
  if (req.body.status === "Shipped") {
    order.orderItems.forEach(async (o) => {
      await updateStock(o.product, o.quantity);
    });
  }
  order.orderStatus = req.body.status; // Update the order status

  // If the status is "Delivered", set the delivery date
  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }

  await order.save({ validateBeforeSave: false }); // Save the updated order
  // Respond with success status
  res.status(200).json({
    success: true,
  });
});

// Helper function to update stock of a product
async function updateStock(id, quantity) {
  const product = await Product.findById(id);

  // Reduce the stock of the product
  product.Stock -= quantity;

  await product.save({ validateBeforeSave: false }); // Save the updated product
}

// Delete an order -- admin only
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  // If the order is not found, return an error
  if (!order) {
    return next(new ErrorHandler("order not found with this id", 404));
  }

  await order.remove(); // Remove the order from the database

  // Respond with success status
  res.status(200).json({
    success: true,
  });
});
