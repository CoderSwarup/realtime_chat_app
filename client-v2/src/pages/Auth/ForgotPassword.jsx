import { Link, Stack, Typography } from "@mui/material";
import React from "react";
import ForgotPasswordForm from "../../Sections/auth/ForgotPasswordForm";
import { Link as RouterLnk } from "react-router-dom";
import { CaretLeft } from "phosphor-react";

export default function ForgotPassword() {
  return (
    <>
      <Stack spacing={3}>
        <Typography variant="h3">Forgot Password</Typography>
        <Typography variant="subtitle">
          Please Enter The Email That Associate With Your Account and We Will
          Email You a Link to reset Your Password{" "}
        </Typography>
        <ForgotPasswordForm />

        <Link
          to={"/auth/login"}
          variant="body2"
          component={RouterLnk}
          color={"#212121"}
        >
          <Stack spacing={0.3} alignItems={"center"} direction={"row"}>
            <CaretLeft />
            Return To Sign in
          </Stack>
        </Link>
      </Stack>
    </>
  );
}
