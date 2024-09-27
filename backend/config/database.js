const mongoose = require("mongoose");

// Function to connect to MongoDB
const connectDataBase = () => {
  // Connect to MongoDB using mongoose
  mongoose
    .connect("mongodb://localhost:27017/market", {
      // MongoDB connection options to prevent deprecation warnings and ensure compatibility
      useCreateIndex: true,    // Creates indexes for better performance
      useNewUrlParser: true,   // Uses the new MongoDB connection string parser
      useUnifiedTopology: true // Enables the new unified topology engine for better server discovery and monitoring
    })
    .then((data) => {
      // Log a success message if the connection is successful
      console.log(`MongoDB connected with server: ${data.connection.host}`);
    })
    .catch((err) => {
      // Log any errors during connection
      console.log(`Error connecting to MongoDB: ${err.message}`);
      process.exit(1); // Exit the process if the database connection fails
    });
};

module.exports = connectDataBase;
