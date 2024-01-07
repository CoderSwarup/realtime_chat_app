import { ChatReducer } from "./Slice/ChatSlice";
import { UserReducer } from "./Slice/Userslice";
import { configureStore } from "@reduxjs/toolkit";

const Store = configureStore({
  reducer: {
    user: UserReducer,
    chats: ChatReducer,
  },
});

export default Store;
