import { UserReducer } from "./Slice/Userslice";
import { configureStore } from "@reduxjs/toolkit";

const Store = configureStore({
  reducer: {
    user: UserReducer,
  },
});

export default Store;
