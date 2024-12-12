import { useTheme } from "@emotion/react";
import { Box, Stack, Typography } from "@mui/material";
import React from "react";
import NoChat from "../../assets/Illustration/NoChat";
import DaillingDialog from "./DaillingDialog";

import { useCall } from "../../contexts/WebRTCVideoCallContext";

const NoConversation = () => {
  return (
    <Stack
      width={"100%"}
      height={"100%"}
      spacing={3}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <NoChat />
      <Typography variant="subtitle1">Start A New Conversation</Typography>
    </Stack>
  );
};

export default function CallMainPage() {
  const theme = useTheme();

  const { userOnCall, isCallAccepted, inComingCallDetails, isIncommingCall } =
    useCall();

  if (!userOnCall && inComingCallDetails?.call_type === null) {
    return (
      <Box
        sx={{
          height: "100%",
          width: "calc(100vw - 410px)",
          background:
            theme.palette.mode == "light"
              ? "#F0F4FE"
              : theme.palette.background.default,
        }}
      >
        {" "}
        <NoConversation />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: "100%",
        width: {
          sx: "100%",
          md: "calc(100vw - 410px)",
        }, // if we need sidebar -720px
        display: {
          xs: userOnCall ? "flex" : "none",
          md: "flex",
        },
        background:
          theme.palette.mode == "light"
            ? "#F0F4FE"
            : theme.palette.background.default,
      }}
    >
      <Stack
        width={"100vw"}
        height={"100vh"}
        spacing={2}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
        position={"relative"}
      >
        {userOnCall && isIncommingCall == false && !isCallAccepted ? (
          <DaillingDialog />
        ) : (
          <NoConversation />
        )}
      </Stack>
    </Box>
  );
}
