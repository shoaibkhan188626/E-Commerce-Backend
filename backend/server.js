const app = require("./app.js");
const cloudinary = require("cloudinary");
const dotenv = require("dotenv");
const connectDataBase = require("./config/database.js");

// HANDLING UNCAUGHT EXCEPTIONS
// This event listener catches uncaught exceptions (errors not caught by any catch block)
// and shuts down the server gracefully to avoid any unpredictable behavior.
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to an uncaught exception`);
  process.exit(1);
});

// LOAD ENVIRONMENT VARIABLES
// dotenv loads the configuration variables from a .env file located in backend/config/config.env
dotenv.config({ path: "backend/config/config.env" });

// CONNECT TO DATABASE
// Establishes a connection to the MongoDB database using the credentials
// specified in the configuration file.
connectDataBase();

// CONFIGURE CLOUDINARY
// Cloudinary configuration for uploading and managing images in your application.
// It uses environment variables or default values if those are not provided.
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME || "dhlafxfwo",
  api_key: process.env.CLOUDINARY_API_KEY || "129255245651838",
  api_secret: process.env.CLOUDINARY_API_SECRET || "4ZtRGnWqyRkVO_6rPYsZB2kQo2Q",
});

// START SERVER
// This starts the Express server, listening on the specified port (55821 in this case).
// server.address().port ensures the actual port is logged in case it dynamically chooses one.
const server = app.listen(55821, () => {
  console.log(`Server listening on port http://localhost:${server.address().port}`);
});

// HANDLING UNHANDLED PROMISE REJECTIONS
// This listener catches any unhandled promise rejections, logs the error,
// and shuts down the server gracefully, ensuring that unhandled promises don't cause issues.
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to an unhandled promise rejection`);

  // Closes the server and exits the process after all ongoing requests are completed.
  server.close(() => {
    process.exit(1);
  });
});
