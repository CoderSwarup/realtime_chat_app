import { combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import AppSlice from "./Slices/AppSlice";
import AuthSlice from "./Slices/AuthSlice";
import ConversationSlice from "./Slices/ConversationSlice";

// Slices
export const rootPersistConfig = {
  key: "root",
  storage,
  keyPrefix: "redux-",
  //whitelist:[],
  // blacklist:[],
};
export const rootReducer = combineReducers({
  app: AppSlice,
  auth: AuthSlice,
  conversation: ConversationSlice,
});
