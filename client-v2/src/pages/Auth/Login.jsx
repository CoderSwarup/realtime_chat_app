import { Link, Stack, Typography } from "@mui/material";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import AuthSocial from "../../Sections/auth/AuthSocial";
import LoginForm from "../../Sections/auth/LoginForm";
export default function Login() {
  return (
    <>
      <Stack spacing={2} sx={{ mb: 5, position: "relative" }}>
        <Typography variant="h3">Login To Talk Live</Typography>
        <Stack direction={"row"} spacing={0.5}>
          <Typography variant="body2">New User ?</Typography>
          <Link to="/auth/register" component={RouterLink}>
            Create an account
          </Link>
        </Stack>

        {/* Login Form  */}
        <LoginForm />

        {/* Social Method Login */}
        <AuthSocial />
      </Stack>
    </>
  );
}
