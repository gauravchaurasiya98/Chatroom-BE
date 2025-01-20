const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/chatroom";

// MongoDB connection setup
exports.connectToMongoDb = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1); // Exit the process if the DB connection fails
  }
};

exports.closeMongoConnection = async () => {
  // Close MongoDB connection
  console.log("Closing MongoDB connection...");
  try {
    await mongoose.connection.close();
    console.log("MongoDB connection closed.");
  } catch (err) {
    console.error("Error closing MongoDB connection:", err.message);
  }
};
