import { createSlice } from "@reduxjs/toolkit";
import AxiosInstance from "../../utils/Axios";
import { SelectConversation, ShowSnackbar } from "./AppSlice";
import { socket } from "../../Socket";
import { useNavigate } from "react-router-dom";
import { FetchDirectConversations } from "./ConversationSlice";

const initialState = {
  isLoggedIn: false,
  token: "",
  isLoading: false,
  email: "",
  error: false,
  userdetails: null,
};
const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateLoading(state, action) {
      state.error = action.payload.error;
      state.isLoading = action.payload.isLoading;
    },
    login(state, action) {
      state.isLoggedIn = action.payload.isLoggedIn;
      state.token = action.payload.token;
      state.userdetails = action.payload.user;
    },
    signout(state, action) {
      state.isLoggedIn = false;
      state.token = "";
    },
    updateRegisterEmail(state, actions) {
      state.email = actions.payload.email;
    },
    updateUserDetails(state, action) {
      state.userdetails = action.payload.user;
    },
  },
});

export default AuthSlice.reducer;

export function UpdateUserDeatils(data, setLoading) {
  return async (dispatch, getState) => {
    socket.emit("update_user_details", data, (data) => {
      if (data.success) {
        dispatch(AuthSlice.actions.updateUserDetails({ user: data.user }));
        dispatch(ShowSnackbar("success", data.message));
      }
      if (!data.success) dispatch(ShowSnackbar("error", data.message));
      setLoading(false);
    });
  };
}

//Login
export function LoginUser(data) {
  return async (dispatch, getState) => {
    await AxiosInstance.post(
      "/auth/login",
      { ...data },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => {
        // console.log(res);
        dispatch(
          AuthSlice.actions.login({
            isLoggedIn: true,
            token: res.data.token,
            user: res.data.user,
          })
        );
        window.localStorage.setItem("user_id", res.data.user_id);
        dispatch(FetchDirectConversations());
        dispatch(ShowSnackbar("success", res.data.message));
      })
      .catch((err) => {
        // console.log(err);
        dispatch(ShowSnackbar("error", err.response.data.message));
      });
  };
}

//Logout
export function LogOutUser(data) {
  return async (dispatch, getState) => {
    dispatch(AuthSlice.actions.signout());
    window.localStorage.removeItem("user_id");
    dispatch(ShowSnackbar("success", "Logout Successfully"));
    dispatch(SelectConversation({ room_id: null, chat_type: null }));
    window.localStorage.clear();
  };
}

//Forgot Password
export function ForgoutUserPassword(data) {
  return async (dispatch, getState) => {
    await AxiosInstance.post("/auth/forgot-password", data, {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        // console.log(res);
        dispatch(ShowSnackbar("success", res.data.message));
      })
      .catch((err) => {
        // console.log(err);
        dispatch(ShowSnackbar("error", err.response.data?.message));
      });
  };
}

//Set New Password

export function NewPassword(data) {
  return async (dispatch, getState) => {
    await AxiosInstance.post("/auth/reset-password", data, {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        // console.log(res);
        // dispatch(
        //   AuthSlice.actions.login({
        //     isLoggedIn: true,
        //     token: res.data.token,
        //   })
        // );
        dispatch(ShowSnackbar("success", res.data.message));
      })
      .catch((err) => {
        // console.log(err);
        dispatch(ShowSnackbar("error", err.response.data?.message));
      });
  };
}

//Register User
export function RegisterUser(data) {
  return async (dispatch, getState) => {
    dispatch(
      AuthSlice.actions.updateLoading({ isLoading: true, error: false })
    );
    await AxiosInstance.post(
      "/auth/register",
      {
        ...data,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => {
        // console.log(res);
        dispatch(AuthSlice.actions.updateRegisterEmail({ email: data.email }));
        dispatch(
          AuthSlice.actions.updateLoading({ isLoading: false, error: false })
        );
        dispatch(ShowSnackbar("success", res.data.message));
        // window.location.href = "/auth/verify";
      })
      .catch((err) => {
        console.log(err);
        dispatch(
          AuthSlice.actions.updateLoading({ isLoading: false, error: true })
        );
        dispatch(ShowSnackbar("error", err.response?.data?.message));
      })
      .finally(() => {
        if (!getState().auth.error) {
          window.location.href = "/auth/verify";
        }
        // console.log(getState().auth.error);
      });
  };
}

// verify Email OTP
export function VerifyEmailOTP(data) {
  return async (dispatch, getState) => {
    await AxiosInstance.post(
      "/auth/verify",
      {
        ...data,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => {
        // console.log(res);
        dispatch(
          AuthSlice.actions.login({
            isLoggedIn: false,
            token: "",
          })
        );
        dispatch(ShowSnackbar("success", res.data.message));
        window.location.href = "/login";
      })
      .catch((err) => {
        // console.log(err);
        dispatch(ShowSnackbar("error", err.response.data?.message));
      });
  };
}
