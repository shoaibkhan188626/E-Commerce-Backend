const app = require("./app.js");
const cloudinary = require("cloudinary");
const dotenv = require("dotenv");
const connectDataBase = require("./config/database.js");

//HANDLING UNCAUGHT EXCEPTIONS
process.on("uncaughtException", (err) => {
  console.log(`Error:${err.message}`);
  console.log(`shutting down the server due to some uncaughtException `);
  process.exit(1);
});

// configuration
dotenv.config({ path: "backend/config/config.env" });

//connect to database
connectDataBase();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME || "dhlafxfwo",
  api_key: process.env.CLOUDINARY_API_KEY || "129255245651838",
  api_secret: process.env.CLOUDINARY_API_SECRET || "4ZtRGnWqyRkVO_6rPYsZB2kQo2Q",
});

const server = app.listen(process.env.PORT || 8000, () => {
  console.log(`Server listening on port http://localhost:${process.env.PORT}`);
});

//unhandled promise rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error:${err.message}`);
  console.log(
    `shutting down the server due to some unhandled promise rejectioin error`
  );

  server.close(() => {
    process.exit(1);
  });
});
