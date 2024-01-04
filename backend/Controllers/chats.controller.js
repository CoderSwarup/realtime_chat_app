import ChatModel from "../Models/chat.model.js";
import UserModel from "../Models/user.model.js";
// Access The Chat
export const AccessChat = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      throw new Error("User Id pram Not Sent with Request");
    }

    let isChat = await ChatModel.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");

    isChat = await UserModel.populate(isChat, {
      path: "latestMessage.sender",
      select: "name avatar email",
    });
    if (isChat.length > 0) {
      res.status(200).send({
        success: true,
        data: isChat[0],
      });
    } else {
      let ChatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [req.user._id, userId],
      };

      const createdChat = await ChatModel.create(ChatData);

      const FullChat = await ChatModel.findOne({
        _id: createdChat._id,
      }).populate("users", "-password");

      return res.status(200).send({
        success: true,
        message: "New Private chat Created Successfully!",
        data: FullChat,
      });
    }
  } catch (error) {
    res.status(400).send({
      error: error.message,
      success: false,
    });
  }
};

// FetchAll chats Of the User

export const FetAllchats = async (req, res) => {
  try {
    const allChats = await ChatModel.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    res.status(200).send({
      success: true,
      message: "Your All Chats",
      count: allChats.length,
      data: allChats,
    });
  } catch (error) {
    res.status(400).send({
      error: error.message,
      success: false,
    });
  }
};

// Create Group Chat
export const createGroupChat = async (req, res) => {
  try {
    const { users, name } = req.body;
    if (!name || !users) {
      throw new Error("Please Fill All The Fields");
    }

    let allGroupUsers = JSON.parse(users);

    if (allGroupUsers.length < 2) {
      throw new Error("A group must consist of at least two members");
    }

    allGroupUsers.push(req.user);

    const GroupChat = await ChatModel.create({
      chatName: name,
      users: allGroupUsers,
      isGroupChat: true,
      groupAdmin: req.user._id,
    });

    const fullGroupChat = await ChatModel.findById(GroupChat._id)
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).send({
      message: `The ${fullGroupChat.chatName} has been created successfully`,
      success: true,
      data: fullGroupChat,
    });
  } catch (error) {
    res.status(400).send({
      error: error.message,
      success: false,
    });
  }
};

// Rename Group Name
export const RenameGroupName = async (req, res) => {
  try {
    const { chatid, newName } = req.body;

    if (!chatid || !newName) {
      throw new Error("Please Provide all fields");
    }

    const ChatExist = await ChatModel.findByIdAndUpdate(chatid, {
      chatName: newName,
    });

    if (!ChatExist) {
      throw new Error("No Chat Found");
    }

    return res.status(200).send({
      message: "Successfully updated the name of the group.",
      success: true,
    });
  } catch (error) {
    res.status(400).send({
      error: error.message,
      success: false,
    });
  }
};

// AddNew User  InGroup
export const AddNewUserInGroup = async (req, res) => {
  try {
    const { chatid, userid } = req.body;

    if (!chatid || !userid) {
      throw new Error("please provide all Fields");
    }

    //check Chat is Available or Not
    let IsGroupAvailable = await ChatModel.findById(chatid);
    if (!IsGroupAvailable) {
      throw new Error("This Group Does not Exists");
    }

    if (
      JSON.stringify(IsGroupAvailable.groupAdmin) !==
      JSON.stringify(req.user._id)
    ) {
      throw new Error("Only Admin perform this action.");
    }

    // Checking whether user is already in the group or not
    let IsUserAlreadyInTheGroup = await ChatModel.find({
      $and: [{ _id: chatid }, { users: { $elemMatch: { $eq: userid } } }],
    });
    if (IsUserAlreadyInTheGroup.length !== 0) {
      throw new Error("This user is already a member of this group.");
    }
    // Push the user to the users array list
    else {
      const addMember = await ChatModel.findByIdAndUpdate(
        { _id: chatid },
        { $push: { users: userid } }
      );
      if (!addMember) {
        throw new Error("Failed To Add The Member");
      }
      return res.status(201).json({
        data: addMember,
        message: "User has been added successfully",
      });
    }
  } catch (error) {
    res.status(400).send({
      error: error.message,
      success: false,
    });
  }
};

// Remove User From Group
export const RemoveUserFromGroup = async (req, res) => {
  try {
    const { chatid, userid } = req.body;

    if (!chatid || !userid) {
      throw new Error("Please provide all fields");
    }

    // Check if the Group Exists
    let isGroupAvailable = await ChatModel.findById(chatid);
    if (!isGroupAvailable) {
      throw new Error("This Group Does not Exist");
    }

    console.log(
      JSON.stringify(isGroupAvailable.groupAdmin),
      JSON.stringify(req.user._id)
    );
    // Check if the User Making the Request is the Admin of the Group
    if (
      JSON.stringify(isGroupAvailable.groupAdmin) !==
      JSON.stringify(req.user._id)
    ) {
      throw new Error("Only the admin can perform this action.");
    }

    if (
      JSON.stringify(isGroupAvailable.groupAdmin) ===
      JSON.stringify(req.user._id)
    ) {
      throw new Error("Admin Cannot Remove Our Self");
    }

    // Check if the User is a Member of the Group
    let isUserInGroup = await ChatModel.find({
      $and: [{ _id: chatid }, { users: { $elemMatch: { $eq: userid } } }],
    });
    if (isUserInGroup.length === 0) {
      throw new Error("This user is not a member of this group.");
    }

    // Remove the User from the Group
    const removeMember = await ChatModel.findByIdAndUpdate(
      { _id: chatid },
      { $pull: { users: userid } }
    );
    if (!removeMember) {
      throw new Error("Failed to remove the member");
    }

    return res.status(200).json({
      data: removeMember,
      message: "User has been removed successfully",
    });
  } catch (error) {
    res.status(400).send({
      error: error.message,
      success: false,
    });
  }
};
