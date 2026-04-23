const mongoose = require("mongoose");

let cachedConnectionPromise = null;

async function connectDB() {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI is missing from environment variables.");
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (cachedConnectionPromise) {
    return cachedConnectionPromise;
  }

  try {
    cachedConnectionPromise = mongoose.connect(mongoUri, {
      bufferCommands: false
    });

    const connection = await cachedConnectionPromise;
    console.log(`MongoDB connected: ${connection.connection.host}`);
    return connection;
  } catch (error) {
    cachedConnectionPromise = null;
    console.error(`MongoDB connection failed: ${error.message}`);
    throw error;
  }
}

module.exports = connectDB;
