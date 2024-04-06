import app from "./app.js";
import http from "http";
import dotenv from "dotenv";
import DBConnect from "./Config/DBConnect.js";
import fs from "fs";

import { Server } from "socket.io";
import User from "./models/user.model.js";
import FrientRequestModel from "./models/friendrequest.model.js";
import OneToOneMessage from "./models/OneToOneMessage.model.js";

import path from "path";
import { uploadFileOnCloudinary } from "./utils/Services/CloudinaryServices.js";
import GroupMessage from "./models/GroupMessages.js";
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
      status: "Online",
    });
  }

  //socket Event Listener +++++++
  //  +++++++++++++++++++ FRIEND REQUEST EVENTS +++++++++++++++
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

  //  +++++++++++++++++++ FRIEND REQUEST EVENTS END+++++++++++++++

  // +++++++++++++ Conversation ENVENTS ++++++++++++++++++++++++
  socket.on("get_direct_conersation", async ({ user_id }, callback) => {
    const existing_conversations = await OneToOneMessage.find({
      participants: { $all: [user_id] },
    }).populate(
      "participants",
      "firstName lastName avatar _id email status updatedAt"
    );

    // console.log(exist_conersations);
    callback(existing_conversations);
  });

  socket.on("start_conversation", async (data) => {
    const { to, from } = data;

    // Check The Conversation Between this Users
    const existing_conversations = await OneToOneMessage.find({
      participants: {
        $size: 2,
        $all: [to, from],
      },
    }).populate("participants", "firstName lastName avatar _id email status");

    // console.log(existing_conversations, "Existing Conversation");

    // if no existing conversation
    if (!existing_conversations || existing_conversations.length == 0) {
      let new_chat = await OneToOneMessage.create({
        participants: [to, from],
      });
      // console.log("CREATE");

      new_chat = await OneToOneMessage.findOne({ _id: new_chat._id }).populate(
        "participants",
        "firstName lastName avatar _id email status"
      );

      console.log("new chat is :  ", new_chat);
      // emit start chat event on the frontend
      // socket.emit("start_chat", new_chat);
    } else {
      // start chat event emmiting with the existsing one
      socket.emit("start_chat", existing_conversations[0]);
      // console.log("exiting chat :  ", existing_conversations[0]);
    }
  });

  //
  socket.on("get_messages", async (data, callback) => {
    const messages = await OneToOneMessage.findById(
      data.conversation_id
    ).select("messages");
    // console.log(messages);
    callback(messages);
  });

  // Handle the text and link Message
  socket.on("text_message", async (data) => {
    // console.log("Text Message Recieve ", data);

    // data conatain {to ,from, message , conversation_id , type}
    const { to, from, message, conversation_id, type } = data;

    // access both users
    const user_to = await User.findById(to).select("socket_id");
    const from_user = await User.findById(from).select("socket_id");

    if (!user_to || !from_user) {
      return;
    }

    const new_message = {
      to: user_to._id,
      from: from_user._id,
      type,
      text: message,
      created_at: Date.now(),
    };

    // create new message
    const chat = await OneToOneMessage.findById(conversation_id);
    chat.messages.push(new_message);
    await chat.save();
    // console.log(user_to, from_user);
    // emit event to the frontend user to
    io.to(user_to.socket_id).emit("new_message", {
      conversation_id,
      message: new_message,
    });
    // emit event to the frontend user from
    io.to(from_user.socket_id).emit("new_message", {
      conversation_id,
      message: new_message,
    });
  });

  // Hanlde the Media Messages
  socket.on("media_message", async (data, callback) => {
    // console.log("media message recieve", data);
    const { conversation_id, from, to, file, type, message } = data;
    // get the File Extension
    const fileExtension = path.extname(data.filename);

    const GenerateFileName = `${Date.now()}_${Math.floor(
      Math.random() * 100000
    )}${fileExtension}`;
    console.log(GenerateFileName);

    let fileBuffer = Buffer.from(file);

    // Define the file path where you want to store the buffer data
    const filePath = `./Public/Temp/${GenerateFileName}`;

    // Write the buffer data to the file
    fs.writeFile(filePath, fileBuffer, async (err) => {
      if (err) {
        // console.error("Error writing file:", err);
        return callback({ success: false });
      }
    });

    const user_to = await User.findById(to).select("socket_id");
    const from_user = await User.findById(from).select("socket_id");
    if (!user_to || !from_user) {
      return;
    }

    // Upload the File on cloudinary

    const res = await uploadFileOnCloudinary(filePath);
    // console.log(res);
    if (res === null) return callback({ success: false });

    const new_message = {
      to: user_to._id,
      from: from_user._id,
      type,
      text: message,
      created_at: Date.now(),
      file: {
        public_id: res?.public_id,
        url: res?.url,
      },
    };

    // create new message
    const chat = await OneToOneMessage.findById(conversation_id);
    chat.messages.push(new_message);
    await chat.save();

    io.to(user_to.socket_id).emit("new_message", {
      conversation_id,
      message: new_message,
    });
    // emit event to the frontend user from
    io.to(from_user.socket_id).emit("new_message", {
      conversation_id,
      message: new_message,
    });

    callback({ success: true });

    fs.unlinkSync(filePath);
  });

  // handle Delete the Message
  socket.on("delete_message", async (data, callback) => {
    const { conversation_id, message_id, from } = data;

    const msgdelete = await OneToOneMessage.findByIdAndUpdate(
      conversation_id,
      { $pull: { messages: { _id: message_id } } },
      { multi: false }
    ).populate("participants", "socket_id");

    // // emit Event

    if (!msgdelete) {
      return;
    }

    io.to(msgdelete?.participants[0].socket_id).emit("delete-message", {
      conversation_id,
      message_id: message_id,
    });

    io.to(msgdelete?.participants[1].socket_id).emit("delete-message", {
      conversation_id,
      message_id: message_id,
    });

    callback("Message Delete");
  });

  // +++++++++++++ Conversation ENVENTS END ++++++++++++++++++++++++

  // ++++++++++++++ Group Conversations Events +++++++++++++++++++

  socket.on("get_group_conersation", async ({ user_id }, callback) => {
    const existing_conversations = await GroupMessage.find({
      participants: { $all: [user_id] },
    }).populate(
      "participants",
      "firstName lastName avatar _id email status updatedAt"
    );

    callback(existing_conversations);
  });

  // create a Group
  socket.on("create_group", async (data, callback) => {
    const { title, image, membersIdList, admin } = data;

    const newGroup = await GroupMessage({
      groupName: title,
      admins: [admin],
      participants: [...membersIdList, admin],
    });

    await newGroup.save();

    callback({
      status: true,
      message: "Group Created",
      conversation: newGroup,
    });
  });

  socket.on("get_group_messages", async (data, callback) => {
    // console.log(data);
    const messages = await GroupMessage.findById(data.conversation_id).select(
      "messages"
    );

    callback(messages);
  });

  // ++++++++++++++ Group Conversations Events END +++++++++++++++++++
  socket.on("disconnect", async () => {
    console.log(socket.id + " has disconnected");

    // make User Offine
    const user = await User.findOne({
      socket_id: socket.id,
    });
    // console.log(user);

    if (!user) return;

    user.status = "Offline";

    await user.save();

    // send the event to the al users
    io.emit("user_offline", { user: user._id });

    socket.disconnect(0);
  });
});

//LISTEN THE SERVER ON DEFINE PORT
server.listen(PORT, () => {
  console.log(`Server is Listen on the PORT : ${PORT}`);
});
