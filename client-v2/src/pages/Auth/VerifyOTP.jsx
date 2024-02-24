import { Stack, Typography } from "@mui/material";
import React from "react";
import VerifyOTPForm from "../../Sections/auth/VerifyOTPForm";

export default function VerifyOTP() {
  return (
    <Stack spacing={3} sx={{ mb: 3, position: "relative" }}>
      <Typography variant="h3">Verify the OTP</Typography>
      <Stack spacing={3}>
        <Typography typography={"body2"} textAlign={"center"}>
          Sent to Email {"xyz@gmail.com"}
        </Typography>

        {/* Verify OTP FORM */}
        <VerifyOTPForm />
      </Stack>
    </Stack>
  );
}
