import { ChatReducer } from "./Slice/ChatSlice";
import { MessgaeReducer } from "./Slice/MessageSlice";
import { NotificationReducer } from "./Slice/Notificationslice";
import { UserReducer } from "./Slice/Userslice";
import { configureStore } from "@reduxjs/toolkit";

const Store = configureStore({
  reducer: {
    user: UserReducer,
    chats: ChatReducer,
    message: MessgaeReducer,
    notification: NotificationReducer,
  },
});

export default Store;
