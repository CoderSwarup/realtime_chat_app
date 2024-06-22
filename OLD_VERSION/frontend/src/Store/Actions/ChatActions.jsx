import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const config = {
  " Content-Type": "application/json",
};

// Access Chats
export const accessNewChat = async ({ userId }) => {
  try {
    const { data } = await axios.post("/api/v1/chats", { userId }, config);

    return data;
  } catch (error) {
    throw new Error(error.response.data.error);
  }
};

export const FetchMyChats = createAsyncThunk("chats/Mychtas", async () => {
  try {
    const { data } = await axios.get("/api/v1/chats", config);
    return data;
  } catch (error) {
    throw new Error(error.response.data.error);
  }
});

// Create a Group
export const createGroupChat = async (
  name,
  users = [],
  toast,
  FetchAgainData = () => {}
) => {
  try {
    const { data } = await axios.post(
      "/api/v1/chats/group",
      {
        name,
        users: JSON.stringify(users),
      },
      config
    );
    console.log(data);
    toast({
      title: data.message,
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "top-left",
    });
    FetchAgainData();
  } catch (error) {
    toast({
      title: "Error in Create Group Name",
      description: error.response.data.error,
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "top-left",
    });
  }
};

export const ReNameGroup = async (
  chatid,
  newName,
  toast,
  FetchAgainData = () => {}
) => {
  try {
    const { data } = await axios.put(
      "/api/v1/chats/rename/group",
      { chatid, newName },
      config
    );

    console.log(data);
    toast({
      title: data.message,
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "top-left",
    });
    FetchAgainData();
  } catch (error) {
    toast({
      title: "Error in update Group Name",
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "top-left",
    });
  }
};

// Leave Group Funcationality
export const leaveGroup = async (chatId, toast, FetchAgainData = () => {}) => {
  try {
    const { data } = await axios.post(
      "/api/v1/chats/userleave/group",
      { chatid: chatId },
      config
    );

    toast({
      title: data.message,
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "top-left",
    });
    FetchAgainData();
  } catch (error) {
    toast({
      title: "Error in Leave Group",
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "top-left",
    });
  }
};

// Add New User In Group
export const AddUserInGroup = async (
  chatid,
  userid,
  toast,
  FetchAgainData = () => {}
) => {
  try {
    const { data } = await axios.put(
      "/api/v1/chats/useradd/group",
      { chatid, userid },
      config
    );

    toast({
      title: data.message,
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "top-left",
    });
    FetchAgainData();
  } catch (error) {
    toast({
      title: "Error in AddUser",
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "top-left",
    });
  }
};
// Remove User
export const RemoveUserFromGroup = async (
  chatid,
  userid,
  toast,
  FetchAgainData = () => {}
) => {
  try {
    const { data } = await axios.put(
      "/api/v1/chats/userremove/group",
      { chatid, userid },
      config
    );

    toast({
      title: data.message,
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "top-left",
    });
    FetchAgainData();
  } catch (error) {
    console.log(error);
    toast({
      title: "Error in RemoveUser",
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "top-left",
    });
  }
};
