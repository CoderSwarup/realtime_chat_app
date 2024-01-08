import { ChatReducer } from "./Slice/ChatSlice";
import { MessgaeReducer } from "./Slice/MessageSlice";
import { UserReducer } from "./Slice/Userslice";
import { configureStore } from "@reduxjs/toolkit";

const Store = configureStore({
  reducer: {
    user: UserReducer,
    chats: ChatReducer,
    message: MessgaeReducer,
  },
});

export default Store;
