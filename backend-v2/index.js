import app from "./app.js";
import http from "http";
import dotenv from "dotenv";
import DBConnect from "./Config/DBConnect.js";

import { Server } from "socket.io";
import User from "./models/user.model.js";
import FrientRequestModel from "./models/friendrequest.model.js";

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
  // console.log(JSON.stringify(socket.handshake));
  const user_id = socket.handshake.query.user_id;
  const socket_id = socket.id;

  console.log("User Conncted Successfully", socket_id);

  if (Boolean(user_id)) {
    await User.findByIdAndUpdate(user_id, {
      socket_id,
    });
  }

  //socket Event Listener +++++++
  socket.on("friend_request", async (data) => {
    // console.log(data.to);

    const user_to = await User.findById(data.to).select("socket_id");
    const from_user = await User.findById(data.from).select("socket_id");
    // create a Friend Request
    await FrientRequestModel.create({
      sender: data.from,
      recipient: data.to,
    });

    // Emit event to the receiver's Socket ID
    io.to(user_to.socket_id).emit("new_friend_request", {
      message: "New Friend Request Received",
    });

    // Emit event to the sender's Socket ID

    io.to(from_user.socket_id).emit("friend_request_send", {
      message: "Friend Request Sent Successfully",
    });
  });

  // accespt Request EventLsitener
  socket.on("accept_request", async (data) => {
    // console.log("Accept request");
    if (!data.request_id) {
      return;
    }
    const request_doc = await FrientRequestModel.findById(data.request_id);
    console.log(request_doc);
    const sender = await User.findById(request_doc.sender);
    const receiver = await User.findById(request_doc.recipient);

    // add the Users To Their Friend List
    sender.friends.push(request_doc.recipient);
    receiver.friends.push(request_doc.sender);

    // save User Data
    await sender.save({ new: true, validateModifiedOnly: true });
    await receiver.save({ new: true, validateModifiedOnly: true });

    // Delete this Friend Request
    await FrientRequestModel.findByIdAndDelete(data.request_id);

    // emit event request accepted to both
    io.to(sender.socket_id).emit("request_accepted", {
      message: "Friend Request Accepted",
    });
    io.to(receiver.socket_id).emit("request_accepted", {
      message: "Friend Request Accepted",
    });
  });

  socket.on("end", () => {
    console.log(socket.id + " has disconnected");
    socket.disconnect(0);
  });
});

//LISTEN THE SERVER ON DEFINE PORT
server.listen(PORT, () => {
  console.log(`Server is Listen on the PORT : ${PORT}`);
});
