import ChatModel from "../Models/chat.model.js";
import MessageModel from "../Models/message.model.js";
import UserModel from "../Models/user.model.js";

export const sendMessageController = async (req, res) => {
  try {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
      throw new Error("Invalid data passed into request");
    }

    const chatExists = await ChatModel.findById(chatId);

    if (!chatExists) {
      throw new Error("Chat not found");
    }

    const ExistedUserSendMessageCheking = await ChatModel.findOne({
      $and: [{ _id: chatId }, { users: { $elemMatch: { $eq: req.user._id } } }],
    });
    if (!ExistedUserSendMessageCheking) {
      throw new Error("UnAuthorized Person");
    }

    var newMessage = {
      sender: req.user._id,
      content: content,
      chat: chatId,
    };

    var message = await MessageModel.create(newMessage);

    message = await message.populate("sender", "username avatar");

    message = await message.populate("chat");
    message = await UserModel.populate(message, {
      path: "chat.users",
      select: "username avatar email",
    });

    await ChatModel.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });

    res.status(200).send({
      success: true,
      message: "Message Send Successfully",
      message,
    });
  } catch (err) {
    res.status(400).send({
      error: err.message,
      success: false,
    });
  }
};

export const allMessagesController = async (req, res) => {
  try {
    const { chatid } = req.params;
    if (!chatid || chatid.length !== 24) {
      throw new Error("Please Provide Valid Fields");
    }

    const messages = await MessageModel.find({ chat: chatid })
      .populate("sender", "name pic email")
      .populate("chat");
    res.status(200).send({
      success: true,
      messages,
      message: "All Chats",
    });
  } catch (err) {
    res.status(400).send({
      error: err.message,
      success: false,
    });
  }
};
