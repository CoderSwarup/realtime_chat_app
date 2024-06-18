import { CircularProgress, Stack, Typography } from "@mui/material";
import React from "react";
import PaymentPasswordForm from "../../../Sections/main/PaymentPasswordForm";

export default function PaymentPassword({ onSubmit, loading = false }) {
  const handleSubmit = (data) => {
    onSubmit(data); // Call the onSubmit prop with the password
  };

  return (
    <Stack
      spacing={3}
      sx={{
        mb: 3,
        position: "relative",
        width: "100%",
        height: "100%",
        // minHeight: "100vh",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {loading ? (
        <CircularProgress />
      ) : (
        <PaymentPasswordForm
          title="Enter Payment Password"
          onSubmit={handleSubmit}
        />
      )}
      {/* Verify OTP FORM */}
    </Stack>
  );
}
