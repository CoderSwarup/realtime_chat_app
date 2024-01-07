import { createSlice } from "@reduxjs/toolkit";
import { FetchMyChats } from "../Actions/ChatActions";

const ChatSlice = createSlice({
  name: "chat",
  initialState: {
    mychats: [],
    // mynotifications: [],
    selectedChat: null,
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    clearChatMessage: (state) => ({
      ...state,
      message: null,
    }),
    clearChatError: (state) => ({
      ...state,
      error: null,
    }),
  },

  extraReducers: (builder) => {
    // Fetch My all Chats
    builder
      .addCase(FetchMyChats.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(FetchMyChats.fulfilled, (state, action) => {
        state.mychats = action.payload.chats;
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(FetchMyChats.rejected, (state, action) => {
        state.mychats = [];
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearChatError, clearChatMessage } = ChatSlice.actions;
export const { reducer: ChatReducer } = ChatSlice;
