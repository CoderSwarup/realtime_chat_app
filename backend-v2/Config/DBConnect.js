import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const DBConnect = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URL);
    console.log("Database Connect on : ", connection.connection.host);
  } catch (error) {
    console.log("Error ", error);
    process.exit(1);
  }
};

export default DBConnect;
