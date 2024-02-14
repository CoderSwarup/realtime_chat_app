import { combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import AppSlice from "./Slices/AppSlice";

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
});
