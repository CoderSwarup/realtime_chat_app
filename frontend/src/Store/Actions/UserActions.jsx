import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const config = {
  headers: {
    "Content-type": "application/json",
  },
};

// Login user
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password, Navigator, toast }) => {
    try {
      const { data } = await axios.post(
        "/api/v1/user/login",
        { email, password },
        config
      );
      Navigator("/");
      toast({
        title: "User Login Succefully",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return data;
    } catch (error) {
      throw new Error(error.response.data.error);
    }
  }
);

// Register User
export const RegisterUser = createAsyncThunk(
  "auth/registeruser",
  async ({ username, email, password, avatar, Navigator, toast }) => {
    try {
      const { data } = await axios.post(
        "/api/v1/user/register",
        { username, email, password, avatar },
        config
      );
      Navigator("/login");
      toast({
        title: "Registration Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return data;
    } catch (error) {
      throw new Error(error.response.data.error);
    }
  }
);

export const GetUserDeatils = createAsyncThunk("user/userDetails", async () => {
  try {
    const { data } = await axios.get("/api/v1/user/getuserdetails", config);
    return data;
  } catch (error) {
    throw new Error(error.response.data.error);
  }
});
export const LogOutUser = createAsyncThunk(
  "user/logout",
  async ({ Navigate }) => {
    try {
      const { data } = await axios.get("/api/v1/user/logout", config);
      Navigate("/");
      return data;
    } catch (error) {
      throw new Error(error.response.data.error);
    }
  }
);

//Serach User
export const SearchUsers = async (
  searchinput,
  setLoadingSearchResult,
  toast
) => {
  try {
    setLoadingSearchResult(true);

    const { data } = await axios.get(
      `/api/v1/user/getallusers?search=${searchinput}`,
      config
    );
    setLoadingSearchResult(false);
    // console.log(data);
    return data;
  } catch (error) {
    toast({
      title: "Error fetching the chat",
      description: error.message,
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom-left",
    });
    setLoadingSearchResult(false);

    return [];
  }
};
