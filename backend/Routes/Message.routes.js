import express from "express";
import AuthMiddleWare from "../middlewares/AuthMiddleWare.js";
import {
  allMessagesController,
  sendMessageController,
} from "../Controllers/message.controller.js";

const MsgRouter = express.Router();

MsgRouter.route("/").post(AuthMiddleWare, sendMessageController);
MsgRouter.route("/:chatid").get(AuthMiddleWare, allMessagesController);
export default MsgRouter;
