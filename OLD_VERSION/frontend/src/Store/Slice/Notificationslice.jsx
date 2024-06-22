import { createSlice } from "@reduxjs/toolkit";

const NotificationSlice = createSlice({
  // name of the slice
  name: "notification",
  initialState: {
    notifications: [],
    isLoading: false,
    message: null,
    error: null,
  },
  reducers: {
    addNotification: (state, action) => {
      state.notifications = [...state.notifications, action.payload];
    },
    removeNotification: (state, action) => {
      // Use filter to create a new array without the specified notification
      state.notifications = state.notifications.filter(
        (el) => el._id !== action.payload._id
      );
    },
  },
});
export const { addNotification, removeNotification } =
  NotificationSlice.actions;
export const { reducer: NotificationReducer } = NotificationSlice;
