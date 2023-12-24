import express from "express";
import dotenv from "dotenv";
import ChatRouter from "./Routes/Chats.routes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 8080;

// Routes

app.get("/", (req, res) => {
  res.send("Welcome to the Chat API");
});

app.use("/api/v1/chats", ChatRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
