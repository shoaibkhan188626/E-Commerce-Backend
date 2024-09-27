const mongoose = require("mongoose");
const { field } = require("../utils/fieldFiller");

const shippingInfoSchema = new mongoose.Schema({
  address: field(String),
  city: field(String),
  state: field(String),
  country: field(String),
  pinCode: field(Number),
  phoneNo: field(Number, {
    required: true,
    validate: {
      validator: (v) => /^\d{10}$/.test(v),
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  }),
});

const orderSchema = new mongoose.Schema(
  {
    shippingInfo: shippingInfoSchema,
    orderItems: [
      {
        name: field(String),
        price: field(Number),
        quantity: field(Number),
        image: field(String),
        product: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
          required: true,
        },
      },
    ],
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    paymentInfo: {
      id: field(String),
      status: field(String),
    },
    paidAt: field(Date),
    itemsPrice: field(Number, { default: 0 }),
    taxPrice: field(Number, { default: 0 }),
    shippingPrice: field(Number, { default: 0 }),
    totalPrice: field(Number, { default: 0 }),
    orderStatus: {
      type: String,
      required: true,
      enum: ["Process", "Shipped", "Delivered", "Cancelled"],
      default: "Processing",
      index: true,
    },
    deliveredAt: field(Date),
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
