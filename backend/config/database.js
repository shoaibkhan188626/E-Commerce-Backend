const mongoose = require("mongoose");
const connectDataBase = () => {
  mongoose
    .connect(process.env.DB_URI || "mongodb+srv://shoaib_188626:gtx1050ti@cluster1.0lhzcef.mongodb.net/teste", {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((data) => {
      console.log(`MongoDB connected with server: ${data.connection.host}`);
    });
};

module.exports = connectDataBase;
