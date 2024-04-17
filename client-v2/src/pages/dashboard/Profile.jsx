import React from "react";
import { Box, IconButton, Stack, Typography, useTheme } from "@mui/material";
import { CaretLeft } from "phosphor-react";
import ProfileForm from "../../Sections/auth/ProfileForm";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const theme = useTheme();
  const navigate = useNavigate();
  return (
    <>
      <Stack
        width={"100%"}
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
        sx={{ position: "relative" }}
      >
        {/* Left  */}
        <Box
          height={"100%"}
          sx={{
            position: "relative",
            width: 320,
            background:
              theme.palette.mode == "light"
                ? "#F8FAFE"
                : theme.palette.background.paper,
            boxShadow: "0px 0px 2px rgba(0,0,0,0.25)",
          }}
        >
          <Stack spacing={3} p={3} sx={{ height: "100vh" }}>
            {/* Heading */}
            <Stack direction={"row"} alignItems={"center"} spacing={1}>
              <IconButton onClick={() => navigate(-1)}>
                <CaretLeft />
              </IconButton>
              <Typography variant="h5">Profile</Typography>
            </Stack>

            {/* Profile Form  */}
            <ProfileForm />
          </Stack>
        </Box>

        {/* Right   */}
        <Box
          sx={{
            height: "100%",
            width: "calc(100vw - 410px)", // if we need sidebar -720px
            background:
              theme.palette.mode == "light"
                ? "#F0F4FE"
                : theme.palette.background.default,
          }}
        ></Box>
      </Stack>
    </>
  );
}
