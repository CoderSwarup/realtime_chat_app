import React from "react";
import { Stack } from "@mui/material";
import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const isAutenticated = true;
const DashboardLayout = () => {
  if (!isAutenticated) {
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
