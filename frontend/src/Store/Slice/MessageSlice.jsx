import { createSlice } from "@reduxjs/toolkit";
import { FetchMyChatMessages } from "../Actions/MessageActions";

const MessageSlice = createSlice({
  name: "message",
  initialState: {
    messages: [],
    loading: false,
    error: null,
    message: null,
  },

  reducers: {
    MessageSliceClearMsg: (state) => ({
      ...state,
      message: null,
    }),
    MessageSliceClearError: (state) => ({
      ...state,
      error: null,
    }),
  },

  extraReducers: (builder) => {
    builder
      .addCase(FetchMyChatMessages.pending, (state) => {
        state.loading = true;
      })
      .addCase(FetchMyChatMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload.messages;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(FetchMyChatMessages.rejected, (state, action) => {
        state.loading = false;
        state.message = null;
        state.error = action.error.message;
      });
  },
});

export const { MessageSliceClearError, MessageSliceClearMsg } =
  MessageSlice.actions;
export const MessgaeReducer = MessageSlice.reducer;
