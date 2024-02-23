import { createSlice } from "@reduxjs/toolkit";
import AxiosInstance from "../../utils/Axios";

const initialState = {
  isLoggedIn: false,
  token: "",
  isLoading: false,
};
const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      state.isLoggedIn = action.payload.isLoggedIn;
      state.token = action.payload.token;
    },
    signout(state, action) {
      state.isLoggedIn = false;
      state.token = "";
    },
  },
});

export default AuthSlice.reducer;

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
          })
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };
}

//Logout
export function LogOutUser(data) {
  return async (dispatch, getState) => {
    dispatch(AuthSlice.actions.signout());
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
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
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
        dispatch(
          AuthSlice.actions.login({
            isLoggedIn: true,
            token: res.data.token,
          })
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };
}
