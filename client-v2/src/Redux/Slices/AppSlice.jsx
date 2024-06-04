import { createSlice } from "@reduxjs/toolkit";
import AxiosInstance from "../../utils/Axios";
// import { dispatch } from "../store";

const initialState = {
  sidebar: {
    open: false,
    type: "CONTACT", // CONTACT , STARMSG , MEDIA
    chat_type: null, // SINGLE , GROUP
  },
  snackbar: {
    open: false,
    message: null,
    severity: null,
  },
  users: [],
  friends: [],
  friendRequestList: [],
  chat_type: null, // individual , group
  room_id: null,
};

const AppSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    // set sidebar chat type
    setSidebarChatType(state, action) {
      state.sidebar.chat_type = action.payload.chat_type;
    },
    // toggle side Bar
    toggleSideBar(state, actions) {
      state.sidebar.open = !state.sidebar.open;
    },

    //Updtate SideBar Type
    updateSideBarType(state, actions) {
      state.sidebar.type = actions.payload.type;
    },

    //open snakbar
    openSnackbar(state, action) {
      state.snackbar.open = true;
      state.snackbar.severity = action.payload.severity;
      state.snackbar.message = action.payload.message;
    },

    //close snakbar
    closeSnackbar(state, action) {
      state.snackbar.open = false;
      state.snackbar.severity = null;
      state.snackbar.message = null;
    },

    // update Users
    updateUsers(state, action) {
      state.users = action.payload.users;
    },

    // friendsList
    updateFriends(state, action) {
      state.friends = action.payload.friends;
    },

    // Update Friend Request List
    updateFriendRequest(state, action) {
      state.friendRequestList = action.payload.friendRequestList;
    },

    // set chat type
    selectConversation(state, action) {
      state.chat_type = action.payload.chat_type;
      state.room_id = action.payload.room_id;
    },
  },
});

// Export Reducer
export default AppSlice.reducer;

export const SetSideBarChatType = (chat_type) => {
  return async (dispatch, getstate) => {
    dispatch(AppSlice.actions.setSidebarChatType({ chat_type }));
  };
};

//Toggle Reducer
export const ToggleSideBar = () => {
  return async (dispatch, getState) => {
    dispatch(AppSlice.actions.toggleSideBar());
  };
};

export const UpdateSidebarType = (type) => {
  return async (dispatch, getState) => {
    dispatch(AppSlice.actions.updateSideBarType({ type }));
  };
};

// SnackBar Thunk Asctions

export const ShowSnackbar = (severity, message) => {
  return async function (dispatch, getState) {
    dispatch(AppSlice.actions.openSnackbar({ severity, message }));
    await setTimeout(() => {
      dispatch(AppSlice.actions.closeSnackbar());
    }, 5000);
  };
};

export const HideSnackBar = () => {
  return async function (dispatch, getState) {
    dispatch(AppSlice.actions.closeSnackbar());
  };
};
// SnackBar Thunk Asctions END

//Fetch Users List

export const FetchUsersList = () => {
  return async (dispatch, getState) => {
    await AxiosInstance.get("/user/get-users", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getState().auth?.token}`,
      },
    })
      .then((res) => {
        dispatch(
          AppSlice.actions.updateUsers({
            users: res.data.data,
          })
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

// fetch Friends List
export const FetchFriendsList = () => {
  return async (dispatch, getState) => {
    // console.log(getState().auth);
    await AxiosInstance.get("/user/get-friends", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getState().auth?.token}`,
      },
    })
      .then((res) => {
        // console.log(res);
        dispatch(
          AppSlice.actions.updateFriends({
            friends: res.data.data,
          })
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

// fetch FriendRequest List
export const FetchFriendRequestList = () => {
  return async (dispatch, getState) => {
    await AxiosInstance.get("/user/get-requests", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getState().auth?.token}`,
      },
    })
      .then((res) => {
        dispatch(
          AppSlice.actions.updateFriendRequest({
            friendRequestList: res.data.data,
          })
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

// select new conversation
export const SelectConversation = ({ room_id, chat_type }) => {
  return async (dispatch, getState) => {
    dispatch(AppSlice.actions.selectConversation({ room_id, chat_type }));
  };
};
