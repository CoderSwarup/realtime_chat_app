import React, { useEffect } from "react";
import { Stack } from "@mui/material";
import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { connectSocket, socket } from "../../Socket";
import { ShowSnackbar } from "../../Redux/Slices/AppSlice";

// const isAutenticated = false;
const DashboardLayout = () => {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.auth);

  const user_id = window.localStorage.getItem("user_id");

  useEffect(() => {
    if (isLoggedIn) {
      window.onload = function () {
        if (!window.location.hash) {
          window.location = window.location + "#loaded";
          window.location.reload();
        }
      };

      // window.onload();

      if (!socket) {
        connectSocket(user_id);
      }
      // Socket Listeners
      socket.on("friend_request_send", (data) => {
        dispatch(ShowSnackbar("success", data.message));
      });
      socket.on("new_friend_request", (data) => {
        dispatch(ShowSnackbar("success", data.message));
      });

      socket.on("request_accepted", (data) => {
        dispatch(ShowSnackbar("success", data.message));
      });

      // clear listeners
      return () => {
        socket.off("friend_request_send");
        socket.off("new_friend_request");
        socket.off("accept_request");
      };
    }
  }, [isLoggedIn, socket]);

  if (!isLoggedIn) {
    return <Navigate to={"/auth/login"} />;
  }

  return (
    <Stack direction="row">
      {/* Side Bar */}
      <Sidebar />

      <Outlet />
    </Stack>
  );
};

export default DashboardLayout;
