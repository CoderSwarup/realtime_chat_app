import { CircularProgress, Stack, Typography, Button } from "@mui/material";
import React, { useState } from "react";
import PaymentPasswordForm from "../../Sections/main/PaymentPasswordForm";
import { useDispatch } from "react-redux";
import { CreateAccount } from "../../Redux/Slices/PaymentSlice";

export default function ActivateAccount() {
  const [loading, setloading] = useState(false);
  const dispatch = useDispatch();
  const handleSubmit = (data) => {
    const { code1, code2, code3, code4, code5, code6 } = data;
    const password = code1 + code2 + code3 + code4 + code5 + code6;
    dispatch(CreateAccount(password));
  };

  return (
    <Stack
      spacing={3}
      sx={{
        mb: 3,
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: "80vh",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: 3,
      }}
    >
      <Typography variant="h4" sx={{ mb: 2 }}>
        Activate Your Account
      </Typography>
      <Typography variant="body1" sx={{ mb: 4 }}>
        Please enter your payment password to activate your account and access
        all features.
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <PaymentPasswordForm
          title="Enter Payment Password"
          onSubmit={handleSubmit}
        />
      )}
      <Typography variant="caption">
        Note : Payment Password Is Use At a Time of Payment
      </Typography>
    </Stack>
  );
}
