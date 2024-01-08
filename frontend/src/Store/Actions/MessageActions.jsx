import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const config = {
  "Content-Type": "application/json",
};
export const FetchMyChatMessages = createAsyncThunk(
  "messages/fetchmsg",
  async ({ selectedChatId }) => {
    try {
      const { data } = await axios.get(
        `/api/v1/messages/${selectedChatId}`,
        config
      );
      return data;
    } catch (error) {
      throw new Error(error.response.data.error);
    }
  }
);

export const SendNewMessage = async (
  content,
  chatId,
  toast,
  callFunction = () => {}
) => {
  try {
    const { data } = await axios.post(
      "/api/v1/messages",
      {
        content,
        chatId,
      },
      config
    );
    console.log(data);
    callFunction();
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
