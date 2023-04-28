const mongoose = require("mongoose");
const connectDataBase = () => {
  mongoose
    .connect(process.env.DB_URI || "mongodb://localhost:27017/ecommerce", {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((data) => {
      console.log(`MongoDB connected with server: ${data.connection.host}`);
    });
};

module.exports = connectDataBase;
