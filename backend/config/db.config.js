import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MAX_RETRIES = 3;
const RETRY_DELAY = 5000;

const connection = mongoose.connection;

const connectDB = async (retryCount = 0) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });

    console.log("✅ MongoDB is connected successfully");
    return mongoose.connection;
  } catch (error) {
    console.error(
      `❌ MongoDB connection failed ${error.message} (attemp ${retryCount + 1})`
    );

    if (retryCount < MAX_RETRIES - 1) {
      console.log(`Retrying in ${RETRY_DELAY / 1000} seconds....`);
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      return connectDB(retryCount + 1);
    }

    console.error("Max retries reached. Exiting...");
    process.exit(1);
  }
};

// Connection quality monitoring
mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to DB cluster:", mongoose.connection.host);
});

mongoose.connection.on("open", () => {
  console.log("Mongoose connection is open");
});

mongoose.connection.on("disconnecting", () => {
  console.log("Mongoose is disconnecting...");
});

mongoose.connection.on("disconnected", () => {
  console.warn("Mongoose disconnected");
});

mongoose.connection.on("reconnected", () => {
  console.log("Mongoose reconnected");
});

mongoose.connection.on("error", (err) => {
  console.error("Mongoose connection error:", err);
});

// Close connection when app terminates
process.on("SIGINT", async () => {
  try {
    await mongoose.connection.close();
    console.log("Mongoose connection closed due to app termination");
    process.exit(0);
  } catch (err) {
    console.error("Error closing MongoDB connection:", err);
    process.exit(1);
  }
});

export { connectDB, mongoose, connection };
