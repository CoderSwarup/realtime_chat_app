import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Login user
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }) => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/v1/user/login",
        { email, password },
        config
      );

      return data;
    } catch (error) {
      throw new Error(error.response.data.error);
    }
  }
);
const config = {
  headers: {
    "Content-type": "application/json",
  },
};

// Register User
export const RegisterUser = createAsyncThunk(
  "auth/registeruser",
  async (Data) => {
    try {
      const { data } = await axios.post("/api/v1/user/register", Data, config);
      return data;
    } catch (error) {
      throw new Error(error.response.data.error);
    }
  }
);
