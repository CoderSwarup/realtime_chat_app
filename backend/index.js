import express from "express";
import dotenv from "dotenv";
import ChatRouter from "./Routes/Chats.routes.js";
import cors from "cors";

dotenv.config();
const app = express();

// Enable CORS for all routes
app.use(
  cors({
    origin: "*",
  })
);

const PORT = process.env.PORT || 8080;

// Routes

app.get("/", (req, res) => {
  res.send("Welcome to the Chat API");
});

app.use("/api/v1/chats", ChatRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
