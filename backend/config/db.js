const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    // DO NOT process.exit(1) in serverless environments, it causes 500 INVOCATION FAILED
  }
};

module.exports = connectDB;
