import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const ConnectDB = async () => {
  try {
    const DBInstance = await mongoose.connect(process.env.MONGO_DB_URL, {
      useNewUrlParser: false,
    });

    console.log("DataBase is Connected", DBInstance.connection.host);
  } catch (error) {
    throw new Error(error);
  }
};

export default ConnectDB;
