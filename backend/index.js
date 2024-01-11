import express from "express";
import dotenv from "dotenv";
import ChatRouter from "./Routes/Chats.routes.js";
import cors from "cors";
import ConnectDB from "./DB/DBConnect.js";
import userRouter from "./Routes/user.routes.js";
import cookieParser from "cookie-parser";
import MsgRouter from "./Routes/Message.routes.js";
import { Server } from "socket.io";
dotenv.config();

const app = express();

// Enable CORS for all routes
app.use(
  cors({
    origin: "*",
  })
);
app.use(cookieParser());
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
app.use("/api/v1/messages", MsgRouter);

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:5173",
  },
});

io.on("connection", (socket) => {
  // console.log("Connection Done");

  socket.on("setup", (userdata) => {
    socket.join(userdata.user._id);
    socket.emit("connected");
  });

  // User Join the which Room
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("user join ", room);
  });

  //typing Effect
  socket.on("typing", (room) => {
    socket.to(room).emit("typing");
  });
  socket.on("stop typing", (room) => {
    socket.to(room).emit("stop typing");
  });

  //new Message isComming
  socket.on("new message", (newMessageReceived) => {
    let chat = newMessageReceived.message.chat;

    if (!chat.users) return console.log("Chat .user not defined");

    socket.to(chat._id).emit("message received", newMessageReceived);
    chat.users.forEach((user) => {
      // Exclude the sender from receiving "message received" event
      if (user._id !== newMessageReceived.message.sender._id) {
        socket.to(user._id).emit("send notification", newMessageReceived);
        return;
      }
    });
  });

  // socket.off("setup", () => {
  //   console.log("USER DISCONNECTED");
  //   socket.leave(userData._id);
  // });
});
