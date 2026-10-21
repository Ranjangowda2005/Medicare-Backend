// import mongoose from "mongoose";
// import dotenv from "dotenv";

//  dotenv.config();

// export const connectDb = async () => {
//   try {
//     // await mongoose.connect("mongodb://127.0.0.1:27017/project");
//     await mongoose.connect(process.env.MONGO_URI);
//     console.log("MongoDB connected successfully");
//   } catch (error) {
//     console.log("MongoDB connection error:", error.message);
//   }
// };


import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "node:dns";

dotenv.config();

// Use Google DNS for MongoDB Atlas SRV lookup
dns.setServers(["8.8.8.8", "8.8.4.4"]);

export const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Atlas connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
  }
};
