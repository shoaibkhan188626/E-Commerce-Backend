const mongoose = require("mongoose");

// Function to connect to MongoDB
const connectDataBase = async () => {
  try {
    // Connect to MongoDB using mongoose
    const data = await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/market", {
      useNewUrlParser: true,   // Uses the new MongoDB connection string parser
      useUnifiedTopology: true // Enables the new unified topology engine for better server discovery and monitoring
    });
    // Log a success message if the connection is successful
    console.log(`MongoDB connected with server: ${data.connection.host}`);
  } catch (err) {
    // Log any errors during connection
    console.error(`Error connecting to MongoDB: ${err.message}`);
    process.exit(1); // Exit the process if the database connection fails
  }
};

module.exports = connectDataBase;
