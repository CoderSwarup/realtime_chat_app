import React from "react";
import { Stack } from "@mui/material";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const DashboardLayout = () => {
  return (
    <Stack direction="row">
      {/* Side Bar */}
      <Sidebar />

      <Outlet />
    </Stack>
  );
};

export default DashboardLayout;
