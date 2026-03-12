// import mongoose from 'mongoose'

// async function connectDb() {
//   const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/code-campus-appraisal'

//   if (mongoose.connection.readyState === 1) {
//     return mongoose.connection
//   }

//   return mongoose.connect(uri)
// }

// export default connectDb


import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const MONGO_URI = process.env.MONGO_URI;

async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}

export default connectDB;
