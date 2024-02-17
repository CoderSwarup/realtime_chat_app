import { Container, Stack } from "@mui/material";
import React from "react";
import { Outlet } from "react-router-dom";
import Logo from "../../assets/Images/logo.ico";
const AuthLayout = () => {
  return (
    <>
      <Container sx={{ mt: 5 }} maxWidth="sm">
        {/* <div>Auth Layout</div> */}
        <Stack direction={"column"} alignItems={"center"} spacing={5}>
          <img style={{ width: 120, height: 120 }} src={Logo} alt="Logo" />
        </Stack>

        <Outlet />
      </Container>
    </>
  );
};

export default AuthLayout;
