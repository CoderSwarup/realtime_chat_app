import express from "express";
import dotenv from "dotenv";
import ChatRouter from "./Routes/Chats.routes.js";
import cors from "cors";
import ConnectDB from "./DB/DBConnect.js";
import userRouter from "./Routes/user.routes.js";

dotenv.config();

const app = express();

// Enable CORS for all routes
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

const PORT = process.env.PORT || 8080;

//  Db connection

ConnectDB();
// Routes

app.get("/", (req, res) => {
  res.send("Welcome to the Chat API");
});

app.use("/api/v1/chats", ChatRouter);
app.use("/api/v1/user", userRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
