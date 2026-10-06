const dns = require("dns");

try {
  dns.setDefaultResultOrder("ipv4first");
  dns.setServers(["1.1.1.1", "8.8.8.8"]);
} catch (e) {}

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    dns.setServers(["1.1.1.1", "8.8.8.8"]);
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 4000 });
    console.log("✅ MongoDB Connected Successfully (Atlas)");
  } catch (error) {
    console.log("⚠️ MongoDB Atlas connection failed/unreachable. Initializing fallback memory database...");
    try {
      const { MongoMemoryServer } = require("mongodb-memory-server");
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      await mongoose.connect(uri);
      console.log("✅ MongoDB Connected Successfully (Memory Database Fallback)");
    } catch (fallbackError) {
      console.error("❌ MongoDB Memory Fallback Failed:", fallbackError);
      process.exit(1);
    }
  }
};

module.exports = connectDB;