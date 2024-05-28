import app from "./app.js";
import http from "http";
import dotenv from "dotenv";
import DBConnect from "./Config/DBConnect.js";
import fs from "fs";

import { Server } from "socket.io";
import User from "./models/user.model.js";
import FrientRequestModel from "./models/friendrequest.model.js";
import OneToOneMessage from "./models/OneToOneMessage.model.js";

import { uploadFileOnCloudinary } from "./utils/Services/CloudinaryServices.js";
import GroupMessage from "./models/GroupMessages.js";
import connectApolloServer from "./GraphQl/index.js";
import { startStandaloneServer } from "@apollo/server/standalone";
dotenv.config();

// DEFINE THE PORT
const PORT = process.env.PORT || 3000;
const GRAPHQLPORT = process.env.GRAPHQLPORT || 3001;

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
const connectUsersIdAndSocketIds = [];
io.on("connection", async (socket) => {
  // console.log(JSON.stringify(socket.handshake));
  const user_id = socket.handshake.query.user_id;
  const socket_id = socket.id;

  connectUsersIdAndSocketIds.push({
    user_id,
    socket_id,
  });

  console.log("User Conncted Successfully", socket_id);

  if (Boolean(user_id)) {
    await User.findByIdAndUpdate(user_id, {
      socket_id,
      status: "Online",
    });
  }

  //socket Event Listener +++++++
  socket.on("update_user_details", async (data, callback) => {
    console.log(data);
    const { firstName, lastName, avatar, filename, user_id } = data;

    const isUser = await User.findById(user_id);

    if (!isUser)
      callback({
        success: false,
        message: "No User Found",
      });

    if (avatar !== null) {
      const res = await uploadFileOnCloudinary(avatar, filename);
      if (res === null)
        return callback({ success: false, message: "Something Went Wrong" });
      isUser.avatar.public_id = res?.public_id;
      isUser.avatar.url = res?.url;
    }

    isUser.firstName = firstName ? firstName : isUser.firstName;
    isUser.lastName = lastName ? lastName : isUser.lastName;

    const n = await isUser.save();

    callback({
      success: true,
      message: "User  Details Updated Successfully!",
      user: {
        firstName: isUser.firstName,
        lastName: isUser.lastName,
        email: isUser.email,
        avatar: isUser?.avatar?.url || "",
      },
    });
  });
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
      "firstName lastName avatar _id email status updatedAt socket_id"
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
    }).populate(
      "participants",
      "firstName lastName avatar _id email status updatedAt socket_id"
    );

    // console.log(existing_conversations, "Existing Conversation");

    // if no existing conversation
    if (!existing_conversations || existing_conversations.length == 0) {
      let new_chat = await OneToOneMessage.create({
        participants: [to, from],
      });
      // console.log("CREATE");

      new_chat = await OneToOneMessage.findOne({ _id: new_chat._id }).populate(
        "participants",
        "firstName lastName avatar _id email status  updatedAt socket_id"
      );

      // console.log("new chat is :  ", new_chat);
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
    console.log(conversation_id);
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
    if (!chat) return;
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

    const chat = await OneToOneMessage.findById(conversation_id);
    if (!chat) return;
    const user_to = await User.findById(to).select("socket_id");
    const from_user = await User.findById(from).select("socket_id");
    if (!user_to || !from_user) {
      return;
    }

    // Upload the File on cloudinary

    const res = await uploadFileOnCloudinary(file, data.filename);
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

  // Delete the Chat
  socket.on("delete_chat", async ({ room_id }, callback) => {
    const chatDelete = await OneToOneMessage.findByIdAndDelete(room_id);

    if (!chatDelete) return callback({ success: false, room_id });

    callback({ success: true, room_id });
  });

  // +++++++++++++ Conversation ENVENTS END ++++++++++++++++++++++++

  // ++++++++++++++ Group Conversations Events +++++++++++++++++++

  // get Users Groups
  socket.on(
    "get_group_conversation",
    async ({ user_id, room_id }, callback) => {
      const existing_conversations = await GroupMessage.find({
        participants: { $all: [user_id] },
      }).populate(
        "participants admins",
        "firstName lastName avatar _id email status updatedAt"
      );

      callback(existing_conversations);
    }
  );

  // create a Group
  socket.on("create_group", async (data, callback) => {
    const { title, image, membersIdList, admin } = data;

    const res = await uploadFileOnCloudinary(image, data.filename);
    // console.log(res);
    if (res === null) return callback({ success: false });

    const newGroup = await GroupMessage({
      groupName: title,
      admins: [admin],
      participants: [...membersIdList, admin],
      avatar: {
        public_id: res?.public_id,
        url: res?.url,
      },
    });

    await newGroup.save();

    callback({
      success: true,
      message: "Group Created",
      conversation: newGroup,
    });
  });

  socket.on("get_group_messages", async (data, callback) => {
    // console.log(data);
    const messages = await GroupMessage.findById(data.conversation_id).select(
      "messages"
    );
    socket.join(data.room_id);

    callback(messages);
  });

  // send the Message
  socket.on("send_group_message", async (data) => {
    const { from, type, room_id, message } = data;

    const new_message = {
      from,
      type,
      text: message,
      created_at: Date.now(),
    };

    const Groupchat = await GroupMessage.findById(room_id).populate(
      "participants",
      "socket_id"
    );
    if (!Groupchat) {
      return;
    }
    Groupchat.messages.push(new_message);
    await Groupchat.save();

    Groupchat.participants.map((participant) => {
      io.to(participant?.socket_id).emit("group_message_receive", {
        room_id,
        message: new_message,
      });
    });
  });

  //Send Group Media message
  socket.on("group_media_message", async (data, callback) => {
    // console.log("media message recieve", data);
    const { conversation_id, from, file, type, message } = data;
    const from_user = await User.findById(from);
    if (!from_user) {
      return;
    }
    const GroupChat = await GroupMessage.findById(conversation_id).populate(
      "participants",
      "socket_id"
    );
    if (!GroupChat) return;

    // Upload the File on cloudinary
    const res = await uploadFileOnCloudinary(file, data.filename);
    if (res === null) return callback({ success: false });

    const new_message = {
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

    GroupChat.messages.push(new_message);
    await GroupChat.save();

    GroupChat.participants.map((participant) => {
      io.to(participant?.socket_id).emit("group_message_receive", {
        room_id: conversation_id,
        message: new_message,
      });
    });
    callback({ success: true });
  });

  //Delete Group Messages
  socket.on("delete_group_message", async (data, callback) => {
    const { room_id, message_id, from } = data;

    const msgdelete = await GroupMessage.findByIdAndUpdate(
      room_id,
      { $pull: { messages: { _id: message_id } } },
      { multi: false }
    ).populate("participants", "socket_id");

    // // emit Event

    if (!msgdelete) {
      return;
    }

    msgdelete.participants.map((participant) => {
      io.to(participant?.socket_id).emit("delete-group-message", {
        room_id,
        message_id: message_id,
      });
    });

    callback("Message Delete");
  });

  // Exit From the Group
  socket.on("exit_group", async (data, callback) => {
    const { room_id, user_id } = data;
    let groupChat = await GroupMessage.findById(room_id);

    if (!groupChat) return callback({ success: false });

    // Remove the user from the participants array
    groupChat.participants.pull(user_id);

    // Remove the user from the admins array
    groupChat.admins.pull(user_id);

    // Save the updated groupChat
    await groupChat.save();

    callback({ success: true, room_id });
  });

  socket.on("delete_group", async (data, callback) => {
    const { room_id, user_id } = data;
    let groupChat = await GroupMessage.findByIdAndDelete(room_id);

    if (!groupChat) return callback({ success: false });

    callback({ success: true, room_id });
  });

  // add Member From the Group
  socket.on("add_member_in_group", async (data, callback) => {
    const { room_id, member_ids } = data;

    try {
      let groupChat = await GroupMessage.findById(room_id);
      if (!groupChat)
        return callback({
          success: false,
          message: "Group Doesn't Exist!",
        });

      // Check if any member_id is already in the participants array
      const alreadyAddedMembers = [];
      member_ids.forEach((member_id) => {
        if (groupChat.participants.includes(member_id)) {
          alreadyAddedMembers.push(member_id);
        } else {
          groupChat.participants.push(member_id);
        }
      });

      // Save changes to the database
      await groupChat.save();

      const Gchat = await GroupMessage.findById(room_id).populate(
        "participants",
        "firstName lastName avatar _id email status updatedAt"
      );
      if (alreadyAddedMembers.length > 0) {
        const names = Gchat.participants
          .filter((participant) =>
            alreadyAddedMembers.includes(participant._id.toString())
          ) // Convert participant._id to string for comparison
          .map((participant) => participant.firstName);

        return callback({
          success: false,
          message: `Members ${names.join(", ")} are already in the group!`,
          participants: Gchat.participants,
        });
      } else {
        return callback({
          success: true,
          message: "Members are added to the group.",
          participants: Gchat.participants,
        });
      }
    } catch (error) {
      console.error("Error adding members to group:", error);
      return callback({
        success: false,
        message: "An error occurred while adding members to the group.",
      });
    }
  });

  // remove members from the group
  socket.on("remove_member_from_group", async (data, callback) => {
    const { room_id, membersList } = data;

    try {
      let groupChat = await GroupMessage.findById(room_id).populate(
        "participants",
        "firstName"
      );

      if (!groupChat)
        return callback({
          success: false,
          message: "Group Doesn't Exist!",
        });

      // Check if any member_id is in the participants array and remove them
      const nonremovedMembers = [];
      membersList.forEach((member) => {
        const index = groupChat.participants.findIndex(
          (participant) => String(participant._id) === String(member.memberid)
        );
        if (index === -1) {
          nonremovedMembers.push(member.membername);
        } else {
          groupChat.participants.splice(index, 1);
        }
      });

      // Save changes to the database
      await groupChat.save();

      const Gchat = await GroupMessage.findById(room_id).populate(
        "participants",
        "firstName lastName avatar _id email status updatedAt"
      );

      if (nonremovedMembers.length > 0) {
        // Get the names of non-removed members

        return callback({
          success: true,
          message: `Members [ ${nonremovedMembers.join(
            ", "
          )} ] were alredy removed from the group!`,
          participants: Gchat.participants,
        });
      }

      return callback({
        success: true,
        message: "Members Removed from Group Successfully!",
        participants: Gchat.participants,
      });
    } catch (error) {
      console.error("Error removing members from group:", error);
      return callback({
        success: false,
        message: "An error occurred while removing members from the group.",
      });
    }
  });

  // ++++++++++++++ Group Conversations Events END +++++++++++++++++++

  // ++++++++++ TYPING  EVENTS +++++++++++++++++
  socket.on("SINGLE_CHAT_START_TYPING", (data) => {
    // Find the corresponding socket ID for the given user ID
    const userSocket = connectUsersIdAndSocketIds.find(
      (item) => item.user_id === data.user_id
    );

    // If the user's socket ID is found, emit the "SINGLE_CHAT_TYPING" event to that socket ID
    if (userSocket) {
      io.to(userSocket.socket_id).emit("SINGLE_CHAT_TYPING", data);
    }
  });

  socket.on("SINGLE_CHAT_STOP_TYPING", (data) => {
    // Find the corresponding socket ID for the given user ID
    const userSocket = connectUsersIdAndSocketIds.find(
      (item) => item.user_id === data.user_id
    );

    // If the user's socket ID is found, emit the "SINGLE_CHAT_TYPING_STOP" event to that socket ID
    if (userSocket) {
      io.to(userSocket.socket_id).emit("SINGLE_CHAT_TYPING_STOP", data);
    }
  });

  //Group Chat

  socket.on("GROUP_CHAT_START_TYPING", (data) => {
    data.user_ids?.forEach((user) => {
      const { _id } = user;
      // Find the corresponding socket ID for the given user ID
      const userSocket = connectUsersIdAndSocketIds?.find(
        (item) => item?.user_id === _id
      );

      // Check if the user has a valid socket ID and is not the current user
      if (userSocket && _id !== data?.current_user_id) {
        // Emit the "GROUP_CHAT_TYPING" event to that socket ID
        io.to(userSocket.socket_id).emit("GROUP_CHAT_TYPING", {
          room_id: data.room_id,
          _id,
          firstName: data.firstName,
        });
      }
    });
  });

  socket.on("GROUP_CHAT_STOP_TYPING", (data) => {
    data.user_ids.forEach((user) => {
      const { _id } = user;
      // Find the corresponding socket ID for the given user ID
      const userSocket = connectUsersIdAndSocketIds.find(
        (item) => item.user_id === _id
      );

      // Check if the user has a valid socket ID
      if (userSocket) {
        // Emit the "GROUP_CHAT_TYPING_STOP" event to that socket ID
        io.to(userSocket.socket_id).emit("GROUP_CHAT_TYPING_STOP", {
          room_id: data?.room_id,
          _id,
        });
      }
    });
  });

  // ++++++++++ TYPING EVENTS END +++++++++++++
  socket.on("disconnect", async () => {
    console.log(socket.id + " has disconnected");
    const index = connectUsersIdAndSocketIds.findIndex(
      (item) => item.socket_id === socket.id
    );
    if (index !== -1) {
      connectUsersIdAndSocketIds.splice(index, 1);
    }

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

const initApolloServer = async () => {
  const apolloServer = await connectApolloServer();
  startStandaloneServer(apolloServer, {
    listen: { port: GRAPHQLPORT },
  }).then((res) => {
    console.log(`🚀GraphQl Server ready at: ${res.url}`);
  });
};
initApolloServer();

//LISTEN THE SERVER ON DEFINE PORT
server.listen(PORT, () => {
  console.log(`Server is Listen on the PORT : ${PORT}`);
});
