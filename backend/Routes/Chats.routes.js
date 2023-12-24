import express from "express";
import chats from "../SampleData/data.js";

const ChatRouter = express.Router();

//
ChatRouter.route("/").get((req, res) => {
  res.json(chats);
});

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
