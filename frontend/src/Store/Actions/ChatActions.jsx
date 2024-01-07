import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const config = {
  " Content-Type": "application/json",
};
// Access Chats
export const accessChat = createAsyncThunk(
  "chat/accessChat",
  async ({ email, password, Navigator }) => {
    try {
      const { data } = await axios.post(
        "/api/v1/user/login",
        { email, password },
        config
      );
      Navigator("/");
      return data;
    } catch (error) {
      throw new Error(error.response.data.error);
    }
  }
);

export const FetchMyChats = createAsyncThunk("chats/Mychtas", async () => {
  try {
    const { data } = await axios.get("/api/v1/chats", config);
    return data;
  } catch (error) {
    throw new Error(error.response.data.error);
  }
});
