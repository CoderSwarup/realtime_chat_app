import app from "./app.js";
import http from "http";
import dotenv from "dotenv";
import DBConnect from "./Config/DBConnect.js";

import { Server } from "socket.io";
import User from "./models/user.model.js";

dotenv.config();

// DEFINE THE PORT
const PORT = process.env.PORT || 3000;

// Create a HTTP SERVER
const server = http.createServer(app);

// socket Instance
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// DB CONNECTION
DBConnect();

io.on("connection", async (socket) => {
  const user_id = socket.handshake.query("user_id");
  const socket_id = socket.id;

  console.log("User Conncted Successfully", socketId);

  if (user_id) {
    await User.findByIdAndUpdate(user_id, {
      socket_id,
    });
  }

  //socket Event Liostener +++++++
  socket.on("friend_request", async (data) => {
    console.log(data.to);

    const to = await User.findById(data.to);

    io.to(to.socket_id).emit("new_friend_request", {});
  });
});

//LISTEN THE SERVER ON DEFINE PORT
server.listen(PORT, () => {
  console.log(`Server is Listen on the PORT : ${PORT}`);
});
