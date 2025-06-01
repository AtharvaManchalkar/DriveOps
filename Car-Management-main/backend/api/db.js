const mongoose = require("mongoose");
//delete require.cache[require.resolve('dotenv')];
require("dotenv").config();

console.log(process.env.MONGO_URI);
//PASS = ABgDdlduVzNKeVVA

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
  }
};

module.exports = connectDB;
