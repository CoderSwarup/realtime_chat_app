import { Link, Stack, Typography } from "@mui/material";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import RegisterForm from "../../Sections/auth/RegisterForm";
import AuthSocial from "../../Sections/auth/AuthSocial";
export default function Register() {
  return (
    <Stack spacing={2}>
      <Typography variant="h3">Get Started With Talk Live</Typography>
      <Typography>
        Already Have Account{" "}
        <Link to="/auth/login" component={RouterLink}>
          Sign In
        </Link>
      </Typography>

      {/* Register form */}
      <RegisterForm />

      {/* Social Method Login */}
      <AuthSocial />
    </Stack>
  );
}
