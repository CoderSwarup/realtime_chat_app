import express from "express";
import chats from "../SampleData/data.js";
import AuthMiddleWare from "../middlewares/AuthMiddleWare.js";
import {
  AccessChat,
  AddNewUserInGroup,
  FetAllchats,
  RemoveUserFromGroup,
  RenameGroupName,
  createGroupChat,
} from "../Controllers/chats.controller.js";

const ChatRouter = express.Router();

//
ChatRouter.route("/")
  .get(AuthMiddleWare, FetAllchats)
  .post(AuthMiddleWare, AccessChat);

ChatRouter.route("/group").post(AuthMiddleWare, createGroupChat);
ChatRouter.route("/rename/group").put(AuthMiddleWare, RenameGroupName);
ChatRouter.route("/useradd/group").put(AuthMiddleWare, AddNewUserInGroup);
ChatRouter.route("/userremove/group").put(AuthMiddleWare, RemoveUserFromGroup);

// get single chat
ChatRouter.route("/:chatid").get((req, res) => {
  const id = req.params.chatid;
  const chat = chats.find((c) => c._id === id);
  if (!chat) {
    return res.status(404).send("The chat with the given ID was not found.");
  }
  res.json(chat);
});
export default ChatRouter;
