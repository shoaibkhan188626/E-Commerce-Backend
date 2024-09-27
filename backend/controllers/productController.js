const Product = require("../models/productModel.js");
const ErrorHandler = require("../utils/errorhandler.js");
const catchAsyncErrors = require("../middleware/catchAsyncErrors.js");
const ApiFeatures = require("../utils/apifeatures.js");
const cloudinary = require("cloudinary");
const joi = require("joi");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});



exports.createProduct = catchAsyncErrors(async (req, res, next) => {
  const schema = joi.object({
    name: joi.string().required(),
    description: joi.string().required(),
    price: joi.number().required(),
    category: joi.string().required(),
    images: joi.array().items(joi.string()).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) return next(new ErrorHandler(error.details[0].message, 400));

  let images =
    typeof req.body.images === "string" ? [req.body.images] : req.body.images;
  const imagesLinks = await Promise.all(
    images.map(async (image) => {
      const result = await cloudinary.v2.uploader.upload(image, {
        folder: "products",
      });
      return { public_id: result.public_id, url: result.secure_url };
    })
  );
  req.body.images = imagesLinks;
  req.body.user = req.user.id;

  const product = await Product.create(req.body);
  res.status(201).json({ success: true, product });
});

exports.getAdminProducts = catchAsyncErrors(async (req, res, next) => {
  const products = await Product.find();
  res.status(200).json({ success: true, products });
});

exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {
  const resultPerPage = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;

  const apiFeatures = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter();

  const productsCount = await Product.countDocuments();
  apiFeatures.pagination(resultPerPage);
  const products = await apiFeatures.query;
  const filteredProductsCount = products.length;

  res.status(200).json({
    success: true,
    products,
    productsCount,
    resultPerPage,
    filteredProductsCount,
    currentPage: page,
  });
});

exports.getProductsDetails = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new ErrorHandler("Product not found ", 404));
  res.status(200).json({ success: true, product });
});

exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) return next(new ErrorHandler("product not found", 404));

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({ success: true, product });
});

exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new ErrorHandler("Product not found", 404));

  await product.remove();
  res
    .status(200)
    .json({ success: true, message: "Product deleted successfully" });
});

exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;
  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);
  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );
  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString()) {
        rev.rating = rating;
        rev.comment = comment;
      }
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }
  const avg =
    product.reviews.reduce((acc, rev) => acc + rev.rating, 0) /
    product.reviews.length;
  product.ratings = avg;

  await product.save({ validateBeforeSave: false });
  res.status(200).json({ success: true });
});

exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(rqe.query.id);
  if (!product) return next(new ErrorHandler("product not found", 404));
  res.status(200).json({ success: true, reviews: product.reviews });
});

exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);
  if (!product) return next(new ErrorHandler("product not found", 404));

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  const ratings =
    reviews.length === 0
      ? 0
      : reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews: reviews.length,
    },
    { new: true, runValidators: true, useFindAndModify: false }
  );
  res.status(200).json({ success: true });
});

exports.aggregateProductStats = catchAsyncErrors(async (req, res, next) => {
  const stats = await Product.aggregate([
    {
      $group: {
        _id: null,
        totalProducts: { $sum: 1 },
        avgRating: { $avg: "$ratings" },
        totalReviews: { $sum: "$numOfReviews" },
      },
    },
  ]);
  res.status(200).json({ success: true, stats });
});

exports.aggregateProductsByCategory = catchAsyncErrors(
  async (req, res, next) => {
    const stats = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          totalProducts: { $sum: 1 },
          avgRating: { $avg: "$ratings" },
        },
      },
      {
        $sort: { totalProducts: -1 },
      },
    ]);
    res.status(200).json({ success: true, stats });
  }
);

exports.aggregateProductsWithPagination = catchAsyncErrors(
  async (req, res, next) => {
    const resultPerPage = parseInt(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;
    const products = await Product.aggregate([
      {
        $facet: {
          products: [
            { $skip: resultPerPage * (page - 1) },
            { $limit: resultPerPage },
          ],
          totalCount: [{ $count: "count" }],
        },
      },
    ]);
    res.status(200).json({
      success: true,
      products: products[0].products,
      totalCount: products[0].totalCount[0]
        ? products[0].totalCount[0].count
        : 0,
      resultPerPage,
    });
  }
);
